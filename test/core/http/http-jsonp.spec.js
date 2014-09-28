"use strict";

describe("$httpJsonp", function() {
    var scriptEl;
    var $window;
    var $document;
    var $httpJsonp;

    function getCallbackId() {
        return scriptEl.src.substring(scriptEl.src.indexOf("=") +1);
    }

    function getCallback() {
        return $window[getCallbackId()];
    }

    function shouldNotBeCalled() {
        assert(false, "fulfilled or rejected promise callback called when should not be");
    }

    beforeEach(function() {
        scriptEl = {};
        scriptEl.addEventListener = function(event, fn) {
            this.eventListener = fn;
        };
        scriptEl.removeEventListener = function() {
            this.eventListner = null;
        };
        scriptEl.onreadystatechange = function() {
        };

        $include(null, function($mockable) {
            $mockable.value("$document", {
                createElement: jasmine.createSpy("createElement").and.returnValue(scriptEl),
                head : {
                    removeChild: jasmine.createSpy("removeChild"),
                    appendChild: jasmine.createSpy("appendChild")
                }
            });

            $mockable.value("$window", {
                setTimeout: function(fn, time) {
                    window.setTimeout(fn, time);
                }
            });
        });

        $invoke(["$window", "$document", "$httpJsonp"], function(window, document, httpJsonp) {
            $window = window;
            $document = document;
            $httpJsonp = httpJsonp;
        });
    });

    it("should be invokable", function() {
        expect($httpJsonp).toBeDefined();
        expect(isFunction($httpJsonp)).toEqual(true);
    });

    it("should create async javascript script element", function() {
        $httpJsonp({url: "www.test.com"}).send();

        expect($document.createElement).toHaveBeenCalled();
        expect(scriptEl.type).toEqual("text/javascript");
        expect(scriptEl.async).toEqual(true);
    });

    it("should remove 'callback' parameter from url", function() {
        $httpJsonp({url: "www.test.com?callback=a"}).send();
        expect(endsWith(scriptEl.src, "?callback=a")).toEqual(false);
    });

    it("should add callback parameter to url", function() {
        $httpJsonp({url: "www.test.com"}).send();
        expect(contains(scriptEl.src, "?callback=")).toEqual(true);
    });

    it("should add script element to head", function() {
        $httpJsonp({url: "www.test.com"}).send();
        expect($document.head.appendChild).toHaveBeenCalledWith(scriptEl);
    });

    it("should add global callback with same callback id as url", function() {
        $httpJsonp({url: "www.test.com"}).send();

        expect(getCallback()).toBeDefined();
        expect(isFunction(getCallback())).toEqual(true);
    });

    describe("promise", function() {
        var promise;

        beforeEach(function() {
            promise = $httpJsonp({url: "www.test.com"}).send();
        });

        it("should return promise", function() {
            expect(promise).toBeDefined();
            expect(promise.then).toBeDefined();
        });

        it("should resolve promise on success", function(done) {
            promise.then(function() {
                done();
            }, shouldNotBeCalled);

            getCallback()();
        });

        it("should reject promise on error", function(done) {
            promise.then(shouldNotBeCalled, function() {
                done();
            });

            scriptEl.eventListener({type: "load"});
        });
    });

    describe("response", function() {
        var promise;

        beforeEach(function() {
            promise = $httpJsonp({url: "www.test.com"}).send();
        });

        it("should return data on success", function(done) {
            promise.then(function(response) {
                expect(response.data).toEqual({a:1});
                done();
            }, shouldNotBeCalled);

            getCallback()({a:1});
        });

        it("should return 200 status on success", function(done) {
            promise.then(function(response) {
                expect(response.status).toEqual(200);
                done();
            }, shouldNotBeCalled);

            getCallback()();
        });

        it("should return 404 status on fail to load", function(done) {
            promise.then(function() {
                assert();
            }, function(response) {
                expect(response.status).toEqual(404);
                done();
            });

            scriptEl.eventListener({type: "load"});
        });
    });

    describe("cleanup", function() {
        var promise;

        beforeEach(function() {
            promise = $httpJsonp({url: "www.test.com"}).send();
        });

        it("should remove script element from head on success", function() {
            getCallback()();
            scriptEl.eventListener({type: "load"});

            expect($document.head.removeChild).toHaveBeenCalledWith(scriptEl);
        });

        it("should remove script element from head on error", function() {
            scriptEl.eventListener({type: "error"});

            expect($document.head.removeChild).toHaveBeenCalledWith(scriptEl);
        });

        it("should remove global callback on success", function() {
            getCallback()();
            scriptEl.eventListener({type: "load"});

            expect(getCallback()).toBeUndefined();
        });

        it("should remove global callback on error", function() {
            scriptEl.eventListener({type: "error"});

            expect(getCallback()).toBeUndefined();
        });
    });

    describe("cancel", function() {
        var httpJsonp;
        var promise;

        beforeEach(function() {
            httpJsonp = $httpJsonp({url: "www.test.com"});
            promise = httpJsonp.send();
        });

        it("should reject and return no data", function(done) {
            promise.then(shouldNotBeCalled, function(response) {
                expect(response.data).toBeUndefined();
                done();
            });

            httpJsonp.cancel();
            getCallback()();
        });

        it("should return 0 status code", function() {
            promise.then(shouldNotBeCalled, function(response) {
                expect(response.status).toEqual(0);
                done();
            });

            httpJsonp.cancel();
            getCallback()();
        });
    });
});
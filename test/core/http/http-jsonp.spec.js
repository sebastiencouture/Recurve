"use strict";

describe("$httpJsonp", function() {

    function getCallbackId() {
        return scriptEl.src.substring(scriptEl.src.indexOf("=") +1);
    }

    function getCallback() {
        return $window[getCallbackId()];
    }

    function shouldNotBeCalled() {
        assert(false, "fulfilled or rejected promise callback called when should not be");
    }

    var scriptEl;
    var $window;
    var $document;
    var $async;
    var $httpJsonp;
    var callback;

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
        });

        $invoke(["$window", "$document", "$async", "$httpJsonp"], function(window, document, async, httpJsonp) {
            $window = window;
            $document = document;
            $async = async;
            $httpJsonp = httpJsonp;
        });

        callback = jasmine.createSpy();
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

    it("should remove 'callback' param from url", function() {
        $httpJsonp({url: "www.test.com?callback=a"}).send();
        expect(endsWith(scriptEl.src, "?callback=a")).toEqual(false);
    });

    it("should add callback param to url", function() {
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

        it("should resolve promise on success", function() {
            promise.then(callback, shouldNotBeCalled);

            getCallback()();

            $async.flush();
            expect(callback).toHaveBeenCalled();
        });

        it("should reject promise on error", function() {
            promise.then(shouldNotBeCalled, callback);

            scriptEl.eventListener({type: "load"});

            $async.flush();
            expect(callback).toHaveBeenCalled();
        });
    });

    describe("response", function() {
        var promise;

        beforeEach(function() {
            promise = $httpJsonp({url: "www.test.com"}).send();
        });

        it("should return data on success", function() {
            promise.then(function(response) {
                expect(response.data).toEqual({a:1});
            }, shouldNotBeCalled);

            getCallback()({a:1});
            $async.flush();
        });

        it("should return 200 status on success", function() {
            promise.then(function(response) {
                expect(response.status).toEqual(200);
            }, shouldNotBeCalled);

            getCallback()();
            $async.flush();
        });

        it("should return 404 status on fail to load", function() {
            promise.then(shouldNotBeCalled, function(response) {
                expect(response.status).toEqual(404);
            });

            scriptEl.eventListener({type: "load"});
            $async.flush();
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

        it("should reject and return no data", function() {
            promise.then(shouldNotBeCalled, function(response) {
                expect(response.data).toBeUndefined();
            });

            httpJsonp.cancel();
            getCallback()();

            $async.flush();
        });

        it("should return 0 status code", function() {
            promise.then(shouldNotBeCalled, function(response) {
                expect(response.status).toEqual(0);
            });

            httpJsonp.cancel();
            getCallback()();

            $async.flush();
        });
    });
});
/** @jsx React.DOM */

"use strict";

docsModule.factory("App", ["$window", "$document", "$router", "$state", "$promise", "stateStore", "docsService", "NavBar", "Loading", "Error", "Api", "Tutorial", "Guide"],
    function($window, $document, $router, $state, $promise, stateStore, docsService, NavBar, Loading, Error, Api, Tutorial, Guide) {

    // TODO TBD find better spot for this
    function setupInternalLinkHandling() {
        $document.body.onclick = function(event) {
            var target = event ? event.target : $window.event.srcElement;

            if( "a" === target.nodeName.toLowerCase()) {
                // Some bootstrap components depend on href="#", so let these pass through
                if (/#$/.test(target.href)) {
                    return;
                }

                var origin = $window.location.origin;
                var index = target.href.indexOf(origin);
                if (-1 === index) {
                    return;
                }

                event.stopPropagation();
                event.preventDefault();

                var path = target.href.substring(origin.length);
                $router.navigate(path);
            }
        };
    }

    function getStateFromStores() {
        var current = stateStore.getCurrent();
        return {
            name: current.name,
            params: current.params,
            data: current.data,
            isLoading: stateStore.isLoading(),
            isError: stateStore.isError(),
            isApi: stateStore.isApi(),
            isTutorial: stateStore.isTutorial(),
            isGuide: stateStore.isGuide()
        };
    }

    function getSection(state) {
        var Section;
        if (state.isError) {
            Section = Error;
        }
        else if (state.isLoading) {
            Section = Loading;
        }
        else if (state.isApi) {
            Section = Api;
        }
        else if (state.isTutorial) {
            Section = Tutorial;
        }
        else {
            Section = Guide;
        }

        return Section;
    }

    function loadInitialData() {
        var promises = [];
        promises.push(docsService.getApiMetadata());
        promises.push(docsService.getContentMetadata());
        promises.push(docsService.getVersionMetadata());

        return $promise.all(promises);
    }

    return React.createClass({
        getInitialState: function() {
            return getStateFromStores();
        },

        componentDidMount: function() {
            stateStore.changed.on(this._changeHandler, this);

            setupInternalLinkHandling();
            loadInitialData().then(function() {
                $state.start();
            });
        },

        componentWillUnmount: function() {
            stateStore.changed.off(this._changeHandler, this);
        },

        render: function() {
            var Section = getSection(this.state);

            return (
                <div>
                    <NavBar />
                    <Section appState={this.state}/>
                </div>
            );
        },

        _changeHandler: function() {
            this.setState(getStateFromStores());
        }
    })
});
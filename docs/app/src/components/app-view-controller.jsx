/** @jsx React.DOM */

"use strict";

docsModule.factory("AppViewController", ["stateDataStore", "NavBarView", "LoadingView", "ErrorView", "ApiView", "TutorialView", "GuideView"],
    function(stateDataStore, NavBarView, LoadingView, ErrorView, ApiView, TutorialView, GuideView) {

    function getState() {
        var current = stateDataStore.getCurrent();
        return {
            name: current.name,
            params: current.params,
            data: current.data,
            isLoading: stateDataStore.isLoading(),
            isError: stateDataStore.isError(),
            isApi: stateDataStore.isApi(),
            isTutorial: stateDataStore.isTutorial(),
            isGuide: stateDataStore.isGuide()
        };
    }

    return React.createClass({
        getInitialState: function() {
            return getState();
        },

        componentDidMount: function() {
            stateDataStore.changed.on(this._changeHandler, this);
        },

        componentWillUnmount: function() {
            stateDataStore.changed.off(this._changeHandler, this);
        },

        render: function() {
            var Section;
            if (this.state.isError) {
                Section = ErrorView;
            }
            else if (this.state.isLoading) {
                Section = LoadingView;
            }
            else if (this.state.isApi) {
                Section = ApiView;
            }
            else if (this.state.isTutorial) {
                Section = TutorialView;
            }
            else {
                Section = GuideView;
            }

            return (
                <div>
                    <NavBarView />
                    <Section name={this.state.name} params={this.state.params} data={this.state.data}/>
                </div>
            );
        },

        _changeHandler: function() {
            this.setState(getState());
        }
    })
});
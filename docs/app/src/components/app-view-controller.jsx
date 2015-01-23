/** @jsx React.DOM */

"use strict";

docsModule.factory("AppViewController", ["stateDataStore", "HeaderView", "SubHeaderView", "LoadingView", "ErrorView", "ApiView", "TutorialView", "GuideView"],
    function(stateDataStore, HeaderView, SubHeaderView, LoadingView, ErrorView, ApiView, TutorialView, GuideView) {

    function getState() {
        var state = {
            isLoading: stateDataStore.isLoading(),
            error: stateDataStore.getError()
        };

        var current = stateDataStore.getCurrent();
        if (current) {
            recurve.extend(state, {
                name: current.name,
                params: current.params,
                data: current.data,
                isApi: stateDataStore.isCurrentApi(),
                isTutorial: stateDataStore.isCurrentTutorial(),
                isGuide: stateDataStore.isCurrentGuide()
            });
        }

        return state;
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
            if (this.state.error) {
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
                    <HeaderView />
                    <SubHeaderView />
                    <Section name={this.state.name} params={this.state.params} data={this.state.data}/>
                </div>
            );
        },

        _changeHandler: function() {
            this.setState(getState());
        }
    })
});
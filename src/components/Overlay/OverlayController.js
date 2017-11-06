import React from 'react';
import Overlay from './Overlay';
import transition from 'transitionjs';
import './Overlay.css';

let singleton = null;

export default class OverlayController extends React.Component {

    constructor(props) {
        super(props);

        if (singleton) {
            throw new Error ("OverlayController can not be used twice");
        }
        singleton = this;

        this.curtain = null;
        this.keyDownEventListenerAttached = false;
        this.componentCounter = 0;
        this.componentOptions = [];

        this.state = {
            hidden: true,
            isDisappearing: false
        };
    }

    static isOverlayHidden() {
        return singleton.state.hidden;
    }

    static showOverlay(options) {
        return singleton.show(options);
    }

    static hideOverlay() {
        singleton.hide();
    }

    static updateComponent(componentId, component) {
        singleton.updateComponent(componentId, component);
    }

    show(options) {
        options = Object.assign({
            id: ++this.componentCounter,
            hideOnCurtainClick: true,
            hideOnEscape: true,
            component: null,
            animate: true,
            onDidHide: null,
            isDisappearing: false,
            width: null,
            height: null,
            maxWidth: null,
            maxHeight: null,
            curtainOpacity: null,
            curtainColor: null,
            className: null,
            onComponentCurtainClick: this._onComponentCurtainClick,
            onComponentDidDisappear: this._onComponentDidDisappear
        }, options);

        this.componentOptions.push(options);

        this.setState({
            hidden: false,
            isDisappearing: false
        });

        return options.id;
    }

    hide() {
        let topComponentOptions = this._topNonDisappearingComponentOptions();
        if (!topComponentOptions) {
            return;
        }
        this._hideComponentForComponentOptions(topComponentOptions, false);
    }

    updateComponent(componentId, component) {
        let componentOptions = this.componentOptions.find(options => options.id === componentId);
        if (!componentOptions) {
            return;
        }
        componentOptions.component = component;
        this.forceUpdate();
    }

    _hideComponentForComponentOptions(componentOptions, callOnDidHideCallback) {
        if (!componentOptions.animate) {
            this._removeComponent(componentOptions, callOnDidHideCallback);
        } else {
            let index = this._indexOfComponentOptions(componentOptions);
            let componentOption = this.componentOptions[index];
            componentOption.isDisappearing = true;
            componentOption.callOnDidHideCallback = callOnDidHideCallback;
            let topComponentOptions = this._topNonDisappearingComponentOptions();
            if (topComponentOptions) {
                // can also be this.forceUpdate() as if there is at least non disappearing component left
                this.setState({
                    hidden: false,
                    isDisappearing: false
                });
            } else {
                this.setState({
                    isDisappearing: true
                });
                transition.begin(this.curtain, "opacity 1 0").promise.then(() => {
                    if (this.componentOptions.length === 0) {
                        this.setState({
                            hidden: true,
                            isDisappearing: false
                        });
                    } else {
                        this.setState({
                            isDisappearing: false
                        });
                    }
                });
            }
        }
    }

    _indexOfComponentOptions(componentOptions) {
        return this.componentOptions.findIndex(options => options.id === componentOptions.id)
    }

    _topNonDisappearingComponentOptions() {
        for (let i = this.componentOptions.length - 1; i >= 0; i--) {
            if (!this.componentOptions[i].isDisappearing) {
                return this.componentOptions[i];
            }
        }
        return null;
    }

    _onComponentCurtainClick = (component) => {
        if (component.props.hideOnCurtainClick && !component.props.isDisappearing) {
            let componentOptions = this.componentOptions.find(options => options.id === component.props.id);
            this._hideComponentForComponentOptions(componentOptions, true);
        }
    };

    _onComponentDidDisappear = (component) => {
        this._removeComponent(component.props, component.props.callOnDidHideCallback);
    };

    _removeComponent(componentOptions, callOnDidHideCallback) {
        let index = this._indexOfComponentOptions(componentOptions);
        this.componentOptions.splice(index, 1);
        if (this.componentOptions.length === 0 && !this.state.isDisappearing) {
            // if newComponentOptions.length === 0 && this.state.isDisappearing === true then the hidden
            // will be set to true from within _hide method when curtain hide transition completes.
            this.setState({
                hidden: true
            });
        } else {
            this.setState({
                hidden: false
            });
        }
        if (callOnDidHideCallback && componentOptions.onDidHide) {
            componentOptions.onDidHide();
        }
    }

    _updateKeyDownEventListener() {
        let topComponentOptions = this._topNonDisappearingComponentOptions();
        let hideOnEscape = topComponentOptions ? topComponentOptions.hideOnEscape : false;
        if (!this.keyDownEventListenerAttached && hideOnEscape) {
            this.keyDownEventListenerAttached = true;
            document.addEventListener('keydown', this._onDocumentKeyPress, true);
        } else if (this.keyDownEventListenerAttached && !hideOnEscape) {
            this.keyDownEventListenerAttached = false;
            document.removeEventListener('keydown', this._onDocumentKeyPress, true);
        }
    }

    _onDocumentKeyPress = (event) => {
        if (event.keyCode === 27) {
            let topComponentOptions = this.componentOptions[this.componentOptions.length - 1];
            if (!topComponentOptions.isDisappearing) {
                this._hideComponentForComponentOptions(topComponentOptions, true);
            }
        }
    };

    componentDidUpdate(prevProps, prevState) {
        // only if overlay was hidden and now shown, and one of the components should be animated, animate the main curtain
        let animate = this.componentOptions.some((options) => options.animate);
        if ((prevState.hidden && !this.state.hidden && animate) || (!this.state.hidden && prevState.isDisappearing && !this.state.isDisappearing)) {
            transition.begin(this.curtain, "opacity 0 1");
        }
        this._updateKeyDownEventListener();
    }

    render() {
        if (this.state.hidden) {
            return null;
        }

        return (
            <div id="overlayContainer">
                <div className="overlayCurtain" ref={(elm) => { this.curtain = elm; }}/>
                {this.componentOptions.map((options) => (
                    <Overlay key={options.id} {...options} />
                ))}
            </div>
        );
    }
}

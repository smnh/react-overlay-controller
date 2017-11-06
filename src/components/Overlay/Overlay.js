import React from 'react';
import transition from 'transitionjs';

export default class Overlay extends React.Component {

    constructor(props) {
        super(props);

        this.container = null;
    }

    componentDidMount() {
        if (this.props.animate) {
            transition.begin(this.container, "opacity 0 1");
        } else {
            this.container.style.opacity = 1;
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isDisappearing && this.props.isDisappearing) {
            transition.begin(this.container, "opacity 1 0").promise.then(() => {
                this.props.onComponentDidDisappear(this);
            });
        }
    }

    render() {
        let overlayCurtainStyle = {};
        if (this.props.curtainColor) {
            overlayCurtainStyle.backgroundColor = this.props.curtainColor;
        }
        if (this.props.curtainOpacity) {
            overlayCurtainStyle.opacity = this.props.curtainOpacity;
        }
        let overlayContentStyle = {
            width: this.props.width,
            height: this.props.height,
            maxWidth: this.props.maxWidth,
            maxHeight: this.props.maxHeight
        };
        return (
            <div className="overlayComponentContainer" ref={(elm) => { this.container = elm; }}>
                <div className="overlayComponentCurtain" style={overlayCurtainStyle} onClick={() => { this.props.onComponentCurtainClick(this); }}/>
                <div className={"overlayComponentContent" + (this.props.className ? " " + this.props.className : "") } style={overlayContentStyle}>{this.props.component}</div>
            </div>
        );
    }
}

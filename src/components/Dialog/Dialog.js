import React from 'react';
import PropTypes from 'prop-types';
import OverlayController from "../Overlay/OverlayController";

export default class Dialog extends React.Component {

    static propTypes = {
        text: PropTypes.string
    };

    static defaultProps = {
        text: 'Hello World!'
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    onClose = () => {
        OverlayController.hideOverlay();
    };

    render() {
        return (
            <div className="demoDialog mdc-elevation--z24">
                <header className="mdc-dialog__header">
                    <div className="mdc-dialog__header__title">Dialog</div>
                </header>
                <section className="mdc-dialog__body">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque feugiat justo sed mattis laoreet. Morbi vitae urna nulla. Nunc non sodales est. Aenean pharetra massa quis lectus aliquam sollicitudin.
                </section>
                <footer className="mdc-dialog__footer">
                    <button type="button" className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel" onClick={this.onClose}>Close</button>
                </footer>
            </div>
        );
    }
};

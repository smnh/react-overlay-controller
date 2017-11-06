import React from 'react';
import OverlayController from "../Overlay/OverlayController";
import Dialog from "../Dialog/Dialog";
import './App.css';

export default class App extends React.Component {

    static propTypes = {};

    static defaultProps = {};

    static options = [
        {
            title: 'Default options',
            subtitle: '',
            options: {}
        },
        {
            title: 'No hiding on escape or curtain click',
            subtitle: 'By default, hitting escape or clicking on the area around the dialog will dismiss the overlay. ' +
            'This behavior can be turned off by setting following options to false.',
            options: {hideOnCurtainClick: false, hideOnEscape: false}
        },
        {
            title: 'Setting onDidHide Callback',
            subtitle: 'When hideOnCurtainClick or hideOnEscape are set to true (the default), the onDidHide callback can ' +
            'be used to determine when the overlay was dismissed by one of these options.',
            options: {onDidHide: () => {alert('Overlay did hide!')}}
        },
        {
            title: 'No animation',
            subtitle: 'By default, when presented, the overlay will fade-in the curtain and the component and fade them ' +
            'out when overlay is dismissed. To turn off the fade-in/out animation set animate to false.',
            options: {animate: false}
        }
    ];

    constructor(props) {
        super(props);
        this.state = {};
    }

    onButtonClick(options) {
        OverlayController.showOverlay(Object.assign({}, options, {
            component: <Dialog/>
        }));
    }

    replacer(key, value) {
        if (typeof value === "function") {
            return '__$' + value.toString() + '$__';
        }
        return value;
    }

    renderCode(options) {
        let overlayOptions = Object.assign({component: "DIALOG"}, options);
        let optionsString = JSON.stringify(overlayOptions, this.replacer, 4)
            .replace(/\\n/g, '\n')
            .replace(/"__\$/g, '')
            .replace(/\$__"/g, '')
            .replace('"DIALOG"', '<Dialog/>');
        let code = `OverlayController.showOverlay(${optionsString});`;
        return <pre>{code}</pre>
    }

    render() {
        return (
            <div className="appContainer">
                <ul className="demoList">
                    {App.options.map((option, index) => (
                        <li key={index} className="mdc-card demoItem">
                            <section className="mdc-card__primary">
                                <div className="mdc-card__title mdc-card__title--large">{option.title}</div>
                                {option.subtitle && <div className="mdc-card__subtitle">{option.subtitle}</div>}
                            </section>
                            <section className="mdc-card__supporting-text">
                                {this.renderCode(option.options)}
                            </section>
                            <section className="mdc-card__actions">
                                <button className="mdc-button mdc-button--raised mdc-button--compact mdc-button--dense mdc-card__action" onClick={() => this.onButtonClick(option.options)}>show overlay</button>
                            </section>
                        </li>
                    ))}
                </ul>
                <OverlayController/>
            </div>
        );
    }
};

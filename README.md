# React Overlay Controller

React singleton component that manages presentation of overlays. An
overlay is a customizable lightbox with any react component. The component
might be a loading indicator, a modal dialog, an error popup, etc. The
Overlay Controller can present several overlays on top of each other as
a stack. Then, stacked overlays can be dismissed in the reverse order of
their presentation.

## Setting Up

The `OverlayController` should be placed close to the top of your
component hierarchy. Most important, it should not have any ancestor
elements with css `transform` applied. Otherwise, it will not cover the
entire screen.

```javascript
import React from 'react';
import OverlayController from 'react-overlay-controller';

class App extends React.Component {

    render() {
        return (
            <div>
                <div>... app content ...</div>
                <OverlayController/>
            </div>
        );
    }

}
```

## Presenting an Overlay

```javascript
import React from 'react';
import OverlayController from 'react-overlay-controller';
import MyModal from './somewhere/MyModal';

class MyComponent extends React.Component {

    showModal() {
        OverlayController.showOverlay({
            component: <MyModal/>
        });
    }

}
```

## Dismissing an Overlay

```javascript
import React from 'react';
import OverlayController from 'react-overlay-controller';

class MyModal extends React.Component {

    onClose = () => {
        OverlayController.hideOverlay();
    };

    render() {
        return (
            <div>
                <div>... modal content ...</div>
                <button onClick={this.onClose}>Close</button>
            </div>
        );
    }

}
```

## API

`OverlayController.showOverlay(options)`

Shows an overlay. If another overlay is already presented, then it shows
the new overlay on top of the old one.

Returns `overlayId` which can be used to update overlay content.

Available options:

- `component` (React component) - The component that should be rendered
  as the overlay content, on top of the curtain. Required.
- `hideOnCurtainClick` (boolean) - A flag indicating if the overlay should
  be closed when user clicks on the curtain. Optional, default: `true`.
- `hideOnEscape` (boolean) - A flag indicating if the overlay should be
  closed when user presses escape. Optional, default: `true`.
- `animate` (boolean) - A flag indicating if the overlay should be
  shown and hidden with fade-in and fade-out animation. Optional,
  default: `true`.
- `onDidHide` (function) - A callback that is called when the overlay
  was hidden by clicking on curtain or pressing escape. This callback is
  not called when overlay was hidden by calling `OverlayController.hideOverlay()`
  method. Optional, default: `null`.
- `className` (string) - The class name that will be added to the
  `div.overlayComponentContent`. See overlay hierarchy for more info.
  Optional, default: `null`.
- `curtainOpacity` (string|number) - Inline opacity of the
  `div.overlayComponentCurtain`. See overlay hierarchy for more info.
  Optional, default: `null`.
- `curtainColor` (string) - Inline background-color (e.g.: "#000000" or
  "rgba(0, 0, 0, 0.25)") of the `div.overlayComponentCurtain`. See overlay
  hierarchy for more info. Optional, default: `null` (default
  background-color `rgba(0, 0, 0, 0.25)` is set through CSS style).

`OverlayController.hideOverlay(options)`

Hides an overlay. If multiple overlays presented, the topmost overlay is
dismissed. If no overlays presented, this method does nothing.

`OverlayController.updateComponent(overlayId, component)`

Updates the `component` of a shown overlay.

## Overlay Hierarchy

The `div#overlayContainer` element is the root element of the
`<OverlayController/>` component. Each presented overlay will be appended
to the root element and rendered inside `div.overlayComponentContainer`
element:

```jsx
<div id="overlayContainer">
    <div class="overlayCurtain"></div>
    <div class="overlayComponentContainer">
        <div class="overlayComponentCurtain" style={{opacity: options.curtainOpacity, backgroundColor: options.curtainColor}}/>
        <div class={"overlayComponentContent " + options.className}>{options.component}</div>
    </div>
    <div class="overlayComponentContainer">
        <div class="overlayComponentCurtain"/>
        <div class="overlayComponentContent">...</div>
    </div>
</div>
```

When overlays are hidden, they are removed from the hierarchy. When no
overlays presented, the root element is removed as well.

The `div.overlayComponentContainer` uses CSS flex box to center the
`div.overlayComponentContent`.

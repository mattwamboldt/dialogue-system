// Changing this file requires a full page reload
// because it's where the state is maintained

import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from './state';

const renderApp = () => {
    let App = require('./view').default;
    render(
        <Provider store={store}><App /></Provider>,
        document.getElementById('app')
    );
};

let devtools = window.__REDUX_DEVTOOLS_EXTENSION__;
let store = createStore(reducers, devtools && devtools());

// These define what code runs when the given dependencies are reloaded
// It stops the dependency tree at those modules
if(module.hot) {
    module.hot.accept('./state/index', () => {
        const newReducers = require('./state');
        store.replaceReducer(newReducers);
    });

    module.hot.accept('./view/index', renderApp);
}

renderApp();

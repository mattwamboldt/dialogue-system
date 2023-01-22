import React from 'react';
import { createRoot } from 'react-dom/client';

const renderApp = () => {
    const rootElement = document.getElementById('app');
    const root = createRoot(rootElement);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const App = require('./view').default;

    root.render(
        <App />
    );
};

renderApp();

// These define what code runs when the given dependencies are reloaded
// It stops the dependency tree at those modules
if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./view', renderApp);
}

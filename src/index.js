import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux'
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router'
import { HashRouter, Route } from 'react-router-dom'; 
import registerServiceWorker from './registerServiceWorker';
import {AppReducer, initialAppState} from './redux/reducers/app';
import App from './App';

const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(AppReducer), // new root reducer with router state,
  initialAppState,
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
    )
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history} router={HashRouter}>
      <HashRouter>
        <Route render={props => (
          <App {...props} />
        )}/>
      </HashRouter>
    </ConnectedRouter>
  </Provider>
, document.querySelector('[react-js="root"]'));

registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore,applyMiddleware,compose} from "redux";
import reduxThunk from "redux-thunk";
import {Provider} from "react-redux";
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from "react-router-dom"
import bugerBuilder from "./store/reducer";
const composeEnhanser =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(bugerBuilder,composeEnhanser(applyMiddleware(reduxThunk)));


ReactDOM.render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));
registerServiceWorker();

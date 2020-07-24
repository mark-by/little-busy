import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {rootReducer} from "./redux/reducers/rootReducer";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
// import {composeWithDevTools} from "redux-devtools-extension";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import Message from "./component/Common/Message/Message";

const store = createStore(rootReducer, applyMiddleware(thunk))
// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
                <App/>
        </BrowserRouter>
    </Provider>,
  document.getElementById('root')
);


ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Message/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('message')
);

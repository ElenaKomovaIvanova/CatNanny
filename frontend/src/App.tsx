import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from "./components/HomeCat";
import {setDispatch} from "./redux/axiosInstance";

setDispatch(store.dispatch);

function App() {
    return (
        <Provider store={store}>
            <Router>
                <HomePage/>
            </Router>
        </Provider>
    );
}

export default App;

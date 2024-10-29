import React from 'react';
import './App.css';
import RegisterForm from './components/RegisterForm';
import Profile from './components/Profile';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from "./components/HomeCat";

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

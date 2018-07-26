import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ActionBar from "./trashes/losers/ActionBar";
import NavigationBar from "./trashes/losers/NavigationBar";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
            <div>
                <ActionBar/>
                <NavigationBar/>
            </div>
        </BrowserRouter>
    );
  }
}

export default App;

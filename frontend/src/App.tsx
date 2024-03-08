import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import { Checklist } from './pages/Checklist';
import { Login } from './pages/Login';

function App() {



  return (

    //fetch data and console log it 
    //test
    <Router>
      <Switch>
        <Route path='/checklist'>
          <Checklist />
        </Route>
        <Route path="/">
          <Login />
        </Route>
        {/* <Route></Route> */}
      </Switch>
    </Router>
  );
}

export default App;

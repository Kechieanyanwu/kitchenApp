import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Checklist from './pages/Checklist';
import { Login } from './pages/Login';
import NavBar from './components/NavBar';

function App() {

  return (
    <>
      <Checklist />
      <NavBar />
    </>
  )

}

export default App;

import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // by default its a GET
  const checklist = fetch("http://localhost:4002/checklist/" )
  console.log(checklist)
  return (
    //fetch data and console log it 
   <div>

   </div> 
  );
}

export default App;

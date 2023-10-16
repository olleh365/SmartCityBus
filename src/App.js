import React from 'react';
import MainLayout from './components/MainLayout';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import axios from 'axios';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Sidebar/>
      <MainLayout/>
      {/* Your homepage content goes here */}
    </div>
  );
}


export default App;

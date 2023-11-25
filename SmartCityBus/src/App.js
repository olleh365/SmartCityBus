import React, { useContext } from 'react';
import MainLayout from './components/MainLayout';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Register from './components/Register';
import Login from './components/Login';
import ChatHome from './chats/ChatHome';
import Home from './components/Home';

import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from './context/AuthContext';


function App() {

  const {currentUser} = useContext(AuthContext);
  const ProtectedRoute = ({children}) =>{ 
    if(!currentUser){
      return <Navigate to ="/Login"/>
    }
    return children
  }
  
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<Home />
              }/>
            <Route path='login' element={<Login/>}/>
            <Route path='register' element={<Register />}/>
            <Route path='chathome' element={
              <ProtectedRoute>
                <ChatHome />
              </ProtectedRoute>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}


export default App;

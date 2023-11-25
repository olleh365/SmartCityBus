// src/chats/Chats.jsx

import React, { useContext, useEffect, useState } from 'react'
import './styles.scss'
import { doc, onSnapshot } from "firebase/firestore"
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'



const Chats = ({ selectedVehicleno }) => {

  const [chats,setChats] = useState([])
  const {currentUser} = useContext(AuthContext)

  useEffect(()=> {
    const getChats = () => {
      if (selectedVehicleno) {
        const unsub = onSnapshot(doc(db, "vehicleno", selectedVehicleno), (doc) => {
          setChats(doc.data());
        });
        return () => {
          unsub();
        };
      }
    };

    selectedVehicleno && getChats();
  }, [selectedVehicleno]);
  

  
  return (
    <div className='chats'>
        <div className='busChat'>
            <img src='/busLogo.png' />
            <div className='busChatInfo'>
                <span>{chats.vehicleno}</span>
                <p></p>
            </div>
        </div>
    </div>
  )
}

export default Chats
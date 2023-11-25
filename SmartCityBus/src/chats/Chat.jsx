// src/chats/Chat.jsx

import React, { useEffect, useState } from 'react'
import ChatInput from './ChatInput'
import Messages from './Messages'
import './styles.scss'
import { doc, onSnapshot } from "firebase/firestore"
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom';


const Chat = ({selectedVehicleno}) => {
  const navigate = useNavigate();
  const[chat, setChat] = useState([])
  useEffect(()=>{
    const getChat = () => {
      if (selectedVehicleno) {
        const unsub = onSnapshot(doc(db, "vehicleno", selectedVehicleno), (doc) => {
          setChat(doc.data());
        });
        return () => {
          unsub();
        };
      }
    };
    
    selectedVehicleno && getChat();
  },[selectedVehicleno]);

  const handleIconClick = () => {
    navigate('/');
  };


  return (
    <div className='chat'>
        <div className='chatInfo'>
          {selectedVehicleno?(

            <span>{chat.routenm}버스 <br/>차량번호 : {chat.vehicleno}</span>
            ) : (
              <p></p>
            )
          }
            <div className="chatIcons">
                <span onClick={handleIconClick}>X</span>
            </div>
        </div>    
        <Messages selectedVehicleno={selectedVehicleno}/>
        <ChatInput selectedVehicleno={selectedVehicleno} />
    </div>
  )
}

export default Chat
// src/chats/Chat.jsx

import React, { useEffect, useState } from 'react'
import ChatInput from './ChatInput'
import Messages from './Messages'
import './styles.scss'
import { doc, onSnapshot } from "firebase/firestore"
import { db } from '../firebase'


const Chat = ({selectedVehicleno}) => {

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


  return (
    <div className='chat'>
        <div className='chatInfo'>
            <span> {chat.routenm}버스 <br/>차량번호 : {chat.vehicleno}</span>
            <div className="chatIcons">
                <img src={'/xxx.png'} alt="" />
            </div>
        </div>    
        <Messages selectedVehicleno={selectedVehicleno}/>
        <ChatInput selectedVehicleno={selectedVehicleno} />
    </div>
  )
}

export default Chat
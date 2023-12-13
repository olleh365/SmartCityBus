// src/chats/Messages.jsx

import React,{useState, useEffect} from 'react'
import Message from './Message'
import { db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'

const Messages = ({selectedVehicleno}) => {
  const [messages, setMessages] = useState([])

  useEffect(()=> {
    if (selectedVehicleno){

      const unsub = onSnapshot(doc(db,"chats",selectedVehicleno),(doc)=>{
        doc.exists() && setMessages(doc.data().messages);
      })
      return () => {
        unsub();
      }
    }
  },[selectedVehicleno]);


  return (
    <div className='messages'>
      {messages.map(m=>(
        <Message message={m} key={m.id}/>
      ))}
    </div>
  )
}

export default Messages
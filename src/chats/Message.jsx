//src /chats/Message.jsx

import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import './styles.scss'



const Message = ({message}) => {
  
  const {currentUser} = useContext(AuthContext)
  
  const ref = useRef()

  const dateString = message.date; 

  const mdate = dateString.toDate();


  const hours = mdate.getHours().toString().padStart(2, '0');
  const minutes = mdate.getMinutes().toString().padStart(2, '0');

  // Display in 'hh:mm' format
  const formattedTime = `${hours}:${minutes}`;
 
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message]);

  
  return (
    <div ref={ref}
    className={`message ${message.senderId === currentUser.uid && "owner"}`}>
        <div className="messageInfo">
            <img src="/userImg.png" alt="" />
            <span>{formattedTime}</span>
        </div>
        <div className="messageContent">
            <p>{message.text}</p>
            {message.img && <img src={message.img} alt="" />}
        </div>
    </div>
  )
}

export default Message
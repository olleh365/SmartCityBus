//src /chats/Message.jsx

import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import './styles.scss'
import { db } from '../firebase'
import { getDoc, doc } from 'firebase/firestore';



const Message = ({message}) => {
  
  const {currentUser} = useContext(AuthContext)
  const [displayName, setdisplayName] = useState(null);

  const ref = useRef()

  const dateString = message.date; 
  const mdate = dateString.toDate();


  const hours = mdate.getHours().toString().padStart(2, '0');
  const minutes = mdate.getMinutes().toString().padStart(2, '0');

  const formattedTime = `${hours}:${minutes}`;
 
  useEffect(()=>{
    const fetchSenderDisplayName = async () => {
      if(message.senderId!=currentUser.uid){
        try {
          const senderDocRef = doc(db, 'users', message.senderId);
          const senderDocSnapshot = await getDoc(senderDocRef);
          
          if (senderDocSnapshot.exists()) {
            const senderData = senderDocSnapshot.data();
            setdisplayName(senderData.displayName);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchSenderDisplayName();
    
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message]);

  
  return (
    <div ref={ref}
    className={`message ${message.senderId === currentUser.uid && "owner"}`}>
        <div className="messageInfo">
            <img src="/userImg.png" alt="" />
            <span>{displayName}</span>
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
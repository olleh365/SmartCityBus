// src/chats/ChatInput.jsx

import { async } from '@firebase/util';
import React, {useContext, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import './styles.scss';
import { db, storage } from '../firebase'
import { arrayUnion, doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore'
import {v4 as uuid} from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';


const ChatInput = ({selectedVehicleno}) => {

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const {currentUser} = useContext(AuthContext)

  const handleSend = async () => {
    if(img){
      const storageRef = ref(storage,uuid());
      const uploadTask = uploadBytesResumable(storageRef,img);

      uploadTask.on(
        (error) => {
          // setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db,"chats",selectedVehicleno),{
              messages: arrayUnion({
                id:uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img:downloadURL,
              })
            });
          });
        }
      )
    }else{
      await updateDoc(doc(db,"chats",selectedVehicleno),{
        messages: arrayUnion({
          id:uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      });
    }
    setText("");
    setImg(null);
  }
  const handlePressKey = (e) => {
    if (e.code === 'Enter') {
      handleSend();
    }
  }


  return (
    <div className='chatInput'>
        <input type='text' onKeyPress={handlePressKey} placeholder='메시지를 입력하시오...' onChange={e=>setText(e.target.value)}
        value={text}/>
        <div className="send">
            <img src="" alt="" />
            <input type='file' style={{display:"none"}} id="file" onChange={e=>setImg(e.target.files[0])}/>
            <label htmlFor='file'>
                <img src={'./putImg.png'} alt="" />
                </label>
            <button onClick={handleSend}>보내기</button>   
        </div>
    </div>
  )
}

export default ChatInput
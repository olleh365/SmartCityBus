// src/chats/ChatSearch.jsx

import React, { useContext, useState} from 'react'
import './styles.scss'
import { collection, doc, setDoc, where, getDocs, query, getDoc, updateDoc, serverTimestamp} from "firebase/firestore"; 
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext'

const ChatSearch = ({onSelectVehicleno}) => {
  const [vehiclenm, setVehiclenm] = useState("")
  const [vehicle , setVehicle] = useState(null)
  const [err, setErr] = useState(false)
  const {currentUser} = useContext(AuthContext);


  const handleSearch = async () => {
    const q = query(collection(db, "vehicleno"),where("vehicleno","==",vehiclenm));

    try{

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setVehicle(doc.data());
      });
    }catch(err){
      setErr(true);
    }
      
  }
  const handleKey = e => {
    e.code === "Enter" && handleSearch();
  }

  const handleSelect = async () => {


    if (vehicle) {

      onSelectVehicleno(vehicle.vehicleno);

      const chatRoomRef = doc(db, 'chats', vehicle.vehicleno);

      try {
        const chatRoomDoc = await getDoc(chatRoomRef);
  
        if (!chatRoomDoc.exists()) {
          await setDoc(chatRoomRef, {
            messages: [],
          });
        }
  
        const userDocumentRef = doc(db, "vehicleno", vehiclenm);
        try {
          await updateDoc(userDocumentRef, {
            [vehiclenm + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
            },
            [vehiclenm + ".date"]: serverTimestamp(),
          });
        } catch (updateError) {
          console.error('Error updating user document:', updateError);
        }
  
      } catch (error) {
        console.error('Error checking or creating chat room:', error);
      }

    }

  };

  return (
    <div className='chatSearch'>
        <div className='searchForm'>
            <input type="text" placeholder='버스 찾기' onKeyDown={handleKey} onChange={e => setVehiclenm(e.target.value)}/>
        </div>
        {err && <span>Bus not found!</span>}
        <div className='busChat' onClick={handleSelect}>
            <img src='/busLogo.png' />
            <div className='busChatInfo'>
                <span>{vehicle && vehicle.vehicleno}</span>
            </div>
        </div>
    </div>
  )
}

export default ChatSearch;

import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { auth } from '../firebase'
import './styles.scss'


const ChatNavbar = () => {
  const {currentUser} = useContext(AuthContext);

  return (
    <div className='chatNavbar'>
        <span className="chatLogo">스마트버스챗</span>
        <div className="user">
            <img src="/userImg.png" alt=""/>
            <span>{currentUser.displayName}</span>
            <button onClick={()=>signOut(auth)}>로그아웃</button>
        </div>
    </div>
  )
}

export default ChatNavbar
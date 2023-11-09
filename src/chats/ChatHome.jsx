import React from 'react'
import Chat from './Chat'
import ChatSidebar from './ChatSidebar'
import './styles.scss'

const ChatHome = () => {
  return (
    <div className='chathome'>
        <div className='chatContainer'>
            <ChatSidebar/>
            <Chat/>
        </div>
    </div>
  )
}

export default ChatHome
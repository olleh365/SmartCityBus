import React from 'react'
import ChatNavbar from './ChatNavbar'
import Chats from './Chats'
import ChatSearch from './ChatSearch'
import './styles.scss'

const ChatSidebar = () => {
  return (
    <div className='chatSidebar'>
        <ChatNavbar/>
        <ChatSearch/>
        <Chats/>
    </div>
  )
}

export default ChatSidebar
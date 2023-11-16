// src/chats/ChatSidebar.jsx

import React, {useState} from 'react'
import ChatNavbar from './ChatNavbar'
import Chats from './Chats'
import ChatSearch from './ChatSearch'
import './styles.scss'

const ChatSidebar = ({ onSelectVehicleno, selectedVehicleno }) => {


  return (
    <div className='chatSidebar'>
        <ChatNavbar/>
        <ChatSearch onSelectVehicleno={onSelectVehicleno} />
        <Chats selectedVehicleno={selectedVehicleno} onSelectVehicleno={onSelectVehicleno}  />
    </div>
  )
}

export default ChatSidebar
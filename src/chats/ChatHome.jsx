// src/chats/ChatHome.jsx

import React, {useState} from 'react'
import Chat from './Chat'
import ChatSidebar from './ChatSidebar'
import './styles.scss'

const ChatHome = () => {
  const [selectedVehicleno, setSelectedVehicleno] = useState(null);

  const handleSelectVehicleno = (vehicleno) => {
    setSelectedVehicleno(vehicleno);
  };
  return (
    <div className='chathome'>
        <div className='chatContainer'>
            <ChatSidebar onSelectVehicleno={handleSelectVehicleno}
            selectedVehicleno={selectedVehicleno}/>
            <Chat selectedVehicleno={selectedVehicleno}/>
        </div>
    </div>
  )
}

export default ChatHome
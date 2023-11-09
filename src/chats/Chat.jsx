import React from 'react'
import ChatInput from './ChatInput'
import Messages from './Messages'
import './styles.scss'


const Chat = () => {
  return (
    <div className='chat'>
        <div className='chatInfo'>
            <span>Euni</span>
            <div className="chatIcons">
                <img src={'/xxx.png'} alt="" />
            </div>
        </div>    
        <Messages/>
        <ChatInput/>
    </div>
  )
}

export default Chat
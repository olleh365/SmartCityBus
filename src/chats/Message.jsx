import React from 'react'
import './styles.scss'


const Message = () => {
  return (
    <div className='message owner'>
        <div className="messageInfo">
            <img src="/userImg.png" alt="" />
            <span>just now</span>
        </div>
        <div className="messageContent">
            <p>Hello</p>
            <img src="/bus_icon.png" alt="" />
        </div>
    </div>
  )
}

export default Message
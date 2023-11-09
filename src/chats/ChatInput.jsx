import React from 'react'
import './styles.scss'


const ChatInput = () => {
  return (
    <div className='chatInput'>
        <input type='text'placeholder='Type something...'/>
        <div className="send">
            <img src="" alt="" />
            <input type='file' style={{display:"none"}} id="file"/>
            <label htmlFor='file'>
                <img src={'./putImg.png'} alt="" />
                </label>
            <button>보내기</button>   
        </div>
    </div>
  )
}

export default ChatInput
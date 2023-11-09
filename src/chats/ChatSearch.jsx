import React from 'react'
import './styles.scss'


const ChatSearch = () => {
  return (
    <div className='chatSearch'>
        <div className='searchForm'>
            <input type="text" placeholder='버스 찾기'/>
        </div>
        <div className='busChat'>
            <img src='/busLogo.png' />
            <div className='busChatInfo'>
                <span>840버스</span>
            </div>
        </div>
    </div>
  )
}

export default ChatSearch
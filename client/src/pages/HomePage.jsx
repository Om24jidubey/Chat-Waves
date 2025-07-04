import React, { useContext, useState } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'

import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

    // const [selectedUser,setSelectedUser]=useState(false);
    const {selectedUser}=useContext(ChatContext)
  return (
    <div className='border w-full h-screen sm:px-[7.5%] sm:py-[2%] '>
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1.2fr_2fr_1fr] xl:grid-cols-[1.5fr_3.5fr_2fr]':'md:grid-cols-[1.2fr_1.5fr]'}`}>
      

        <SideBar  />
        <ChatContainer />
        <RightSideBar />
        </div>  
    </div>
  )
}

export default HomePage



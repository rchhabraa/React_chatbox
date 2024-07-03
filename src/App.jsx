import { useEffect, useState } from 'react'
import List from './components/list/List'
import Chat from './components/chat/Chat'
import Details from './components/detail/Details'
import Login from './components/login/Login'
import Notification from './components/notification/Notification'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './library/firebase'
import { useUserStore } from './library/userStore'
import { useChatStore } from './library/chatStore'


function App() {
  
  const {currentUser,isLoading,fetchUserInfo}= useUserStore()
  const {chatId}=useChatStore()

  useEffect(()=>{
    const unsub =onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid);
    })
    return ()=>{
      unsub()
    }
  },[fetchUserInfo])
  
if(isLoading) 
  {return ( 
  <div className='w-full justify-center flex items-center h-screen bg-cover text-white font-bold ' style={{backgroundImage: `url('/bg.jpg')`}}>Loading...</div>
)}
  return (
    <div>
    <div
    className="w-full h-screen flex absolute bg-cover bg-no-repeat"
    style={{
        backgroundImage: `url('/bgimm.jpeg')`,
    }}
>
  
  {
    currentUser?(<div className=' flex w-4/5 max-h-screen mx-auto border  border-gray-100 rounded-lg m-5   backdrop-blur-md '>
      
    <div className=' w-1/4  '><List/></div>
    <div className=' w-1/2   border-r-2 border-l-2 border-gray-300 '>{chatId && <Chat/>}</div>
    <div className=' w-1/4 '>{chatId &&<Details/>}</div>
    </div>):(<Login/> )
  }
      </div>
      <Notification/>
      </div>
  
  )
}

export default App

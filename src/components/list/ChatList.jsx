import React, { useCallback, useEffect, useState } from 'react';
import Adduser from './adduser/Adduser';
import {useUserStore} from '../../library/userStore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../library/firebase';
import { motion } from "framer-motion"
import { useChatStore } from '../../library/chatStore';

function ChatList() {
    const [chats,setChats]=useState([])
    const[addmode,setaddmode]=useState(false)
    const [input,setInput]=useState("")
    const {currentUser}= useUserStore()
    const {chatId,changeChat}=useChatStore()

    useEffect(()=>{
        const unSub = onSnapshot(
            doc(db, "userchats", currentUser.id),
            async (res) => {
              const items = res.data().chats;
      
              const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.recieverId);
                const userDocSnap = await getDoc(userDocRef);
      
                const user = userDocSnap.data();
      
                return { ...item, user };
              });
      
              const chatData = await Promise.all(promises);
      
              setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
            }
          );
      
          return () => {
            unSub();
          };
        }, [currentUser.id]);

        const handleSelect=async(chat)=>{
        const userchats=chats.map(item=>{
          const {user,...rest}=item
          return rest
        })
        const chatIndex=userchats.findIndex(item=>item.chatId=== chat.chatId)
        userchats[chatIndex].isSeen=true
        const userChatRef=doc(db,'userchats',currentUser.id)
        try {
          await updateDoc(userChatRef,{
            chats:userchats,
          })
          changeChat(chat.chatId,chat.user)
        } catch (error) {
          console.log(error);
        }
        }
    const filterchats=chats.filter((c)=>
      c.user.username.toLowerCase().includes(input?.toLowerCase()))

    return (
        <>
        <div className='flex  mb-3 mt-2 gap-2 p-2  justify-center flex-wrap '>
            <div className='flex h-7 bg-transparent border rounded-xl'>
            <img src="./search.png" className=' p-1  cursor-pointer ' alt="" />
            <input type="text" 
            onChange={(e)=>setInput(e.target.value)}
            placeholder='Search'
            className='rounded-lg bg-transparent placeholder-white text-white  border-none outline-none  p-1'
            />
            </div>
            <motion.img
            className=' h-7 bg-transparent bg-gray-700 border p-1  cursor-pointer'
            src={addmode?"./minus.png":"./plus.png"}
            onClick={()=>setaddmode(prev=>!prev)}
               whileHover={{ scale: 1.2, rotate: 90 }}
               whileTap={{
               scale: 0.8,
               rotate: -90,
               borderRadius: "100%"
            }}
            />
        </div>
        <div className=' overflow-y-auto '>
            {filterchats.map((chat)=>(
        <div key={chat.chatId} onClick={()=>handleSelect(chat)} 
        style={{backgroundColor:chat?.isSeen?'transparent':'#5183fe'}}
        className='flex cursor-pointer border-b-2 border-gray-300 border-solid gap-2 p-3 flex-wrap '>
        <img className=' size-10 object-cover cursor-pointer rounded-full' src={chat.user.blocked.includes(currentUser.id)?'./img.png':chat.user.avatar || "./img.png"} alt="" />
        <div className='p-1 text-white text-md'>
        <div className=' font-semibold'>{chat.user.blocked.includes(currentUser.id)?'Chatbox User':chat.user.username}</div> 
        <p>{chat.lastMessage}</p>
        </div>
        </div>
        ))}
        { addmode && <Adduser/>}
        </div>
        </>
    );
}

export default ChatList;
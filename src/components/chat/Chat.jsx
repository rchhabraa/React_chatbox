import React, { useCallback, useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../library/firebase';
import { useChatStore } from '../../library/chatStore';
import { useUserStore } from '../../library/userStore';
import upload from '../../library/upload';
import { format } from "timeago.js"

function Chat(props) {
    const [chat,setchat]=useState()
    const[openemoji,setopenemoji]=useState(false)
    const [handleInput,sethandleInput]=useState('')
    const [img,setimg]=useState({
        file:null,
        url:""
    })
    const {chatId,user,isCurrentUserBlocked,isReceiverBlocked}=useChatStore()
    const {currentUser}=useUserStore()

    const handleEmoji=(e)=>{
        sethandleInput(prev=>prev+e.emoji)
        setopenemoji(false)
    }

    const handleimg=(e)=>{
        if(e.target.files[0])
       { setimg({
            file: e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })}
     }

    const endref=useRef(null)
    useEffect(()=>{
        endref.current?.scrollIntoView({behavior:'smooth'})
    },[chat.messages])
    useEffect(()=>{
        const unSub=onSnapshot(doc(db,'chats',chatId),(res)=>{
            setchat(res.data())
        })
        return()=>{
            unSub()
        }
    },[chatId])
    console.log(chat);

    const handleSend=async ()=>{
        if(handleInput ==='') return
        let imgurl=null
        try {
            if(img.file){
                imgurl=await upload(img.file)
            }
            await updateDoc(doc(db,"chats",chatId),{
                messages:arrayUnion({
                    senderId:currentUser.id,
                    text:handleInput,
                    createdAt:new Date(),
                    ...(imgurl && {img:imgurl})
                })
            })
            const userIds=[currentUser.id,user.id]
            userIds.forEach(async(id)=>{
            const userChatRef=doc(db,'userchats',id)
            const userChatsSnapshot=await getDoc(userChatRef)

            if(userChatsSnapshot.exists()){
                const userChatData=userChatsSnapshot.data()
                const chatIndex=userChatData.chats.findIndex(
                    (c)=>c.chatId === chatId
                )
                userChatData.chats[chatIndex].lastMessage=handleInput
                userChatData.chats[chatIndex].isSeen=
                id===currentUser.id?true:false
                userChatData.chats[chatIndex].updatedAt=Date.now()

                await updateDoc(userChatRef,{
                    chats:userChatData.chats,

                })
            }})
        } catch (error) {
            console.log(error);
        }
        setimg({
        file:null,
        url:""
        })
       sethandleInput('')
    }
    return (
        <div className='flex flex-col '>

            <div>
            <div className=' flex flex-wrap h-40 border-b-2 border-gray-300 items-center justify-between'>
            <div className='p-2  flex'>
                <img className=' size-12 object-cover cursor-pointer rounded-full' src={user.avatar || './img.png'} alt="" />
                <h2 className='p-2 text-white text-md font-semibold'>{user.username}</h2>
            </div>
            <div className='flex items-center gap-3'>
            <img className=' size-5  cursor-pointer' src="./phone.png" alt="" />
            <img className=' size-5  cursor-pointer' src="./video.png" alt="" />
            <img  className=' size-5  cursor-pointer mr-3' src="./info.png" alt="" />
            </div>
        </div>
            </div>

             {/*center*/}
            <div className=' flex overflow-y-scroll h-96 gap-2 flex-col p-2  '>
                {chat?.messages?.map((message)=>(

                <div className='text-white' key={message?.createAt} >
                    <div className=''>
                    {message.img && <img src={message.img} />}
                    </div>
                <p className={message.senderId===currentUser?.id?' p-2  rounded-md bg-blue-500':'  p-2 flex justify-end rounded-md bg-gray-500'}>{message.text} </p>
                <span className={message.senderId===currentUser?.id?' p-2  ':'  p-2 flex justify-end '}>{format(message.createdAt.toDate())}</span>
                </div>
                ))}
                {/*message own*/}
               {img.url && (<div className='w-1/3 flex justify-end h-52 object-cover'>
                    <img src={img.url} alt="" />
                </div>)}
               <div ref={endref}></div>
            </div>
            

            {/*bottom*/}
           
            <div className=' flex  items-center border-t  border-gray-300  justify-center'>
             <div className='flex gap-2 '>
            <label htmlFor="file">
            <img className=' size-5  cursor-pointer' src="./img.png" alt="" />
            </label>
            <input type="file" style={{display:"none"}} id='file' onChange={handleimg} />
            <img className=' size-5  cursor-pointer' src="./camera.png" alt="" />
            <img  className=' size-5  cursor-pointer ' src="./mic.png" alt="" />
            </div>
            <input type="text" placeholder={isCurrentUserBlocked || isReceiverBlocked ?'You cannot send a message':'Type a message' }value={handleInput} disabled={isCurrentUserBlocked || isReceiverBlocked} onChange={e=>sethandleInput(e.target.value)} className=' m-2 w-8/12 disabled:cursor-not-allowed outline-none p-2 text-white rounded-md bg-transparent border placeholder-white' />
            <img className=' size-5 cursor-pointer' src="./emoji.png" alt="" onClick={()=>setopenemoji(prev=>!prev)} />
           
            
            <div className=' bottom-20 absolute right-0'>
                <EmojiPicker open={openemoji} onEmojiClick={handleEmoji} />
            </div>
            </div>
            <button className=' mr-20 ml-20 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-md' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>

        </div>
    );
}

export default Chat;
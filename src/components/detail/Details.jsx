import React from 'react';
import {auth, db} from '../../library/firebase'
import { useChatStore } from '../../library/chatStore';
import { useUserStore } from '../../library/userStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
function Details() {
    
        const {chatId, user ,isCurrentUserBlocked,isReceiverBlocked,changeBlock}=useChatStore()
        const {currentUser}=useUserStore()
        const handleBlock=async ()=>{
            if(!user) return 

            const userdocref=doc(db,'users',currentUser.id)
            try {
                await updateDoc(userdocref,{
                    blocked:isReceiverBlocked?arrayRemove(user.id):arrayUnion(user.id)
                })
                changeBlock()
            } catch (err) {
                console.log(err);
            }
        }
    return (
        <div className='text-white'>

            <div className=' flex flex-col   items-center p-2 border-b-2 border-gray-300 '>
            <img className=' size-20 m-2  object-cover cursor-pointer rounded-full' src={user.avatar || './img.png'} alt="" />
            <h1>{user?.username}</h1>
            <p>Hi i am using chatbox</p>
            </div>

            <div>
                <div className='flex p-2 justify-between'>
                    <span>Chat setting</span>
                    <img src="/arrowUp.png" alt="" className='size-5 p-1' />
                </div>
                <div className='flex p-2 justify-between'>
                    <span>Privacy</span>
                    <img src="/arrowUp.png" alt="" className='size-5 p-1' />
                </div>
                <div>
                <div className='flex p-2 justify-between'>
                    <span>Shared Photos</span>
                    <img src="/arrowDown.png" alt="" className='size-5 p-1' />
                 </div>
                    <div className='flex p-2 justify-between items-center'>
                        <img className='size-10 object-cover' src="https://images.pexels.com/photos/4560134/pexels-photo-4560134.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                        <span className='p-2 '>photo.png</span>
                        <img src="/download.png" alt="" className='p-2 cursor-pointer size-9'/>
                    </div>
                    <div className='flex p-2 justify-between items-center'>
                        <img className='size-10 object-cover' src="https://images.pexels.com/photos/4560134/pexels-photo-4560134.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                        <span className='p-2 '>photo.png</span>
                        <img src="/download.png" alt="" className='p-2 cursor-pointer size-9'/>
                    </div>
                    <div className='flex p-2 justify-between items-center'>
                        <img className='size-10 object-cover' src="https://images.pexels.com/photos/4560134/pexels-photo-4560134.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                        <span className='p-2 '>photo.png</span>
                        <img src="/download.png" alt="" className='p-2 cursor-pointer size-9'/>
                    </div>
                    <div className='flex p-2 justify-between items-center'>
                        <img className='size-10 object-cover' src="https://images.pexels.com/photos/4560134/pexels-photo-4560134.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                        <span className='p-2 '>photo.png</span>
                        <img src="/download.png" alt="" className='p-2 cursor-pointer size-9'/>
                    </div>
                </div>
                <div className='flex p-2 justify-between'>
                    <span>Shared Files</span>
                    <img src="/arrowUp.png" alt="" className='size-5 p-1' />
                </div>
                <button className=' w-full rounded-lg hover:bg-red-900 p-2 mb-2 bg-red-800' onClick={handleBlock}>
                {isCurrentUserBlocked?'You are blocked!':isReceiverBlocked?'User Blocked':'Block User'}
                </button>
                <button className='w-full rounded-md hover:bg-green-900 p-2  bg-green-800' onClick={()=>auth.signOut()}>Log Out</button>
            </div>
        </div>
    );
}

export default Details;
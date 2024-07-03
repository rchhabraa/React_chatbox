import React, { useState } from 'react';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../../../library/firebase';
import { useUserStore } from '../../../library/userStore';

function Adduser() {
    const [user,setuser]=useState(null)
    const {currentUser}=useUserStore()

    const handleAdd=async()=>{
        const chatref=collection(db,"chats")
        const userChatref=collection(db,"userchats")
        try {
            const newchatref=doc(chatref)
            await setDoc(newchatref,{
                createdAt:serverTimestamp(),
                messages:[]
            })
            await updateDoc(doc(userChatref,user.id),{
                chats:arrayUnion({
                    chatId:newchatref.id,
                    lastMessage:'',
                    recieverId:currentUser.id,
                    updatedAt:Date.now()
                })
            })
            await updateDoc(doc(userChatref,currentUser.id),{
                chats:arrayUnion({
                    chatId:newchatref.id,
                    lastMessage:'',
                    recieverId:user.id,
                    updatedAt:Date.now()
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch=async e=>{
        e.preventDefault()
        const formData=new FormData(e.target)
        const username=formData.get('username')

        try {
            const userRef = collection(db, "users");

            const q = query(userRef, where("username", "==", username));
      
            const querySnapShot = await getDocs(q);
      
            if (!querySnapShot.empty) {
              setuser(querySnapShot.docs[0].data());
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className=' w-72 h-fit rounded-lg top-0 bottom-0 left-0 right-0 m-auto  bg-gray-400 p-2  backdrop-blur-md absolute border'>
            <form onSubmit={handleSearch}>
                <input className='m-1 p-1 outline-none  rounded-lg bg-transparent border placeholder-gray-700' name='username' type="text" placeholder='Username' />
                <button className='rounded-lg p-1 ml-2 text-gray-200 bg-blue-800 hover:bg-blue-900'>Search</button>
            </form>
           {user &&( <div className='flex mt-5 justify-around items-center'>
                <img src={user.avatar || "/img.png" }alt="" className=' rounded-full  size-10  object-cover' />
                <span className=''> {user.username}</span>
                <button onClick={handleAdd}  className='rounded-lg p-1 ml-2 text-gray-200 bg-green-700 hover:bg-green-900'>Add User</button>
            </div>)}
        </div>
    );
}

export default Adduser;
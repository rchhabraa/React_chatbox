import React from 'react';
import {useUserStore} from '../../library/userStore'

const UserInfo=()=> {

    const {currentUser}= useUserStore()
    return (
        <div className=' flex flex-wrap justify-between align-center mt-3 ml-2 mr-2'>
            <div className='p-2 mr-10 flex'>
                <img className=' object-cover size-10 cursor-pointer rounded-full' src={currentUser.avatar||"./img.png"} alt="" />
                <h2 className='p-1 ml-1 text-white text-md font-semibold'>{currentUser.username}</h2>
            </div>
            <div className=' flex align-center gap-2'>
            <img className=' size-5 mt-2 mb-2 cursor-pointer' src="./edit.png" alt="" />
            <img className=' size-5 mt-2 mb-2 cursor-pointer' src="./video.png" alt="" />
            <img  className=' size-5 mt-2 mb-2  cursor-pointer mr-2' src="./more.png" alt="" />
            </div>
        </div>
    );
}

export default UserInfo;
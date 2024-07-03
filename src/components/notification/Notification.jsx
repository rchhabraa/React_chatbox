import React from 'react';
import { ToastContainer}from 'react-toastify'

function Notification() {
    return (
        <div className=' absolute p-2  m-4 h-auto w-auto text-center text-black-600'>
            <ToastContainer  position='right' />
           
        </div>
    );
} 

export default Notification;
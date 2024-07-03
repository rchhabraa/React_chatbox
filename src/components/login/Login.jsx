import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {auth, db} from '../../library/firebase'
import { doc, setDoc } from 'firebase/firestore';
import upload from '../../library/upload';



function Login() {
    const [image,setimage]=useState({
        file:null,
        url:''
})
      const [loading, setLoading] = useState(false);
     const handleimage=(e)=>{
        if(e.target.files[0])
       { setimage({
            file: e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })}
     }

     const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const formData = new FormData(e.target)
        const {email, password } = Object.fromEntries(formData);
    
        try {
          await signInWithEmailAndPassword(auth, email, password);
          alert('login successfully')
        } catch (err) {
          console.log(err);
          
        } finally {
          setLoading(false);
        }
      };
     const handleRegister=async (e)=>{
        e.preventDefault()
        setLoading(true)
        const formdata=new FormData(e.target)
        const {username,email,password}=Object.fromEntries(formdata)

        try {
            const res= await createUserWithEmailAndPassword(auth,email,password)
            const imgUrl = await upload(image.file);
            await setDoc(doc(db,'users',res.user.uid),{
                username,
                email,
                avatar:imgUrl,
                id:res.user.uid,
                blocked:[],
                
            })
            await setDoc(doc(db,'userchats',res.user.uid),{
                chats:[]
            })
            alert('Account Created Successfully')
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
     }
    
    return (
        <div className=' flex w-3/5 h-3/5 mx-auto my-auto border text-white  border-gray-100 rounded-lg p-5   backdrop-blur-md '>
           {/*login */}
           <form onSubmit={handleLogin} className='w-1/2 border-r-2 items-center flex justify-center'>
                <div className=' flex flex-col'>
                <h2 className=' p-2 flex mb-5 justify-center'>Welcome Back</h2>
                <input type="text" placeholder='Email' className=' placeholder-white mb-2 outline-none rounded-md p-1 bg-transparent border'/>
                <input type="password" placeholder='Password' className=' placeholder-white mb-5 outline-none rounded-md p-1 bg-transparent border'/>
                <button disabled={loading} className='bg-green-700 disabled:cursor-not-allowed disabled:bg-green-800 rounded-md p-2 hover:bg-green-800' >{loading?'Loading':'Log In'}</button>
                </div>
            </form>
           {/*signup */}
           <form onSubmit={handleRegister} className='w-1/2'>
            <div className=' items-center justify-center flex'>
                <div className=' flex flex-col justify-center m-4'>
                <h2 className=' p-2 flex justify-center mb-4'>Create An Account</h2>
               
                <label htmlFor="file" className='flex underline items-center p-2' >
                    <img src={image.url || '/img.png'} className='size-12 p-2'  alt="" />
                    Upload An Image</label>
                <input type="file" id='file' placeholder='Create Username' accept='image/*'  onChange={handleimage} className=' placeholder-white hidden  outline-none rounded-md  bg-transparent '/>
                
                <input type="text" placeholder='Username' name='username' className=' placeholder-white mb-2 outline-none rounded-md p-1 bg-transparent border'/>
                <input type="text" placeholder='Email' name='email' className=' placeholder-white mb-2 outline-none rounded-md p-1 bg-transparent border'/>
                <input type="password" placeholder='Create Password' name='password' className=' placeholder-white mb-5 outline-none rounded-md p-1 bg-transparent border'/>
                <button disabled={loading} className='bg-green-700 disabled:cursor-not-allowed disabled:bg-green-800 rounded-md p-2 hover:bg-green-800' > {loading?'loading':'Sign up' }</button>
            </div>
            </div>
            </form>
        </div>
    );
}

export default Login;
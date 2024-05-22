"use client"

import axios from 'axios'
import Link from 'next/link'
import {  useRouter} from 'next/navigation'
import React, { useState } from 'react'
import { NEXT_APP_BASE_URL } from '../../../envv'


export default function SignUp() {
    const [userSignUp,setUserSignUp] = useState<{email:string, password:string}>({email:"", password:""})
    const [processing,setProcessing] = useState(false)
    const router = useRouter()
    const handleSignUp = async () =>{
        setProcessing(true)
        try{
            const res = await axios.post(`${NEXT_APP_BASE_URL}/api/signup`,JSON.stringify(userSignUp))
            if(res.status == 200){
                router.push("/")
            }
        }
        catch(err){
            console.log(err)
        } 
        router.push("/")  

    }

  return (
    <div className="flex justify-center">
      <div>
      <h1 className="flex justify-center my-5 text-2xl">Sign Up</h1>
      <div className='w-[300px] px-4 py-6 bg-cyan-900 rounded'>
        <div className='flex justify-center'>
            <h1 >New Account? Sign Up</h1>
        </div>
        <div className='grid grid-cols-4'>
            <input 
                placeholder='Enter Email'
                className='col-span-4 mt-4 px-2 py-2 rounded bg-transparent border border-slate-200'
                onChange={(e)=>{
                    setUserSignUp((prev)=>({...prev,email:e.target.value}))
                }} />

            <input 
                placeholder='Enter Password'
                className='col-span-4 mt-4 px-2 py-2 rounded bg-transparent border border-slate-200'
                onChange={(e)=>{
                    setUserSignUp((prev)=>({...prev,password:e.target.value}))
                }} />
            
            <div className='flex justify-center mt-4'>
                <hr />
            </div>
            <button 
                onClick={async ()=>{
                    handleSignUp()      
                }}
                disabled={(userSignUp.email === "" && userSignUp.password === "")}
                className='col-span-4 px-3 py-2 mt-4 rounded-md bg-slate-100 text-slate-800'
                >
                    {
                        (processing) ? 
                        <div>Signing Up ...</div> 
                        :
                        <div>
                            Sign Up
                        </div>
                    }
            </button>

            
        </div>
        
      </div>
        <div className='flex justify-center my-5'>
                    <h1>Already have an account? |</h1>
                    <Link href="/login" className="text-purple-500 ml-2"> Login</Link>
        </div>
      </div>
    </div>
  )
}

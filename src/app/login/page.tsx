"use client"


import axios from 'axios'
import Link from 'next/link'
import { redirect ,useRouter} from 'next/navigation'
import React, { useState } from 'react'

export default function page() {
    const [userSignIn,setUserSignIn] = useState<{email:string, password:string}>({email:"", password:""})
    const [errorMessage,setErrorMessage] = useState("")
    const [processing,setProcessing] = useState(false)

    const router = useRouter()
    const handleSignIn = async () =>{
        setProcessing(true)
        
        try{
            const res = await axios.post(`http://localhost:3000/api/login`,JSON.stringify(userSignIn))
            if(res.status == 200){
                router.push("/")
            }
        }
        catch(err){
            console.log(err)
        } 
        finally{
            router.push("/") 
        }
    }

  return (
    <div className="flex justify-center">
        <div>
        <h1 className="flex justify-center my-5 text-2xl">Login In</h1>
        <div className='w-[300px] px-4 py-6 bg-cyan-900 rounded'>
            <div className='flex justify-center'>
                <h1 >Already have an account? Login</h1>
            </div>
            <div className='grid grid-cols-4'>
                <input 
                    placeholder='Enter Email'
                    className='col-span-4 mt-4 px-2 py-2 rounded bg-transparent border border-slate-200'
                    onChange={(e)=>{
                        setUserSignIn((prev)=>({...prev,email:e.target.value}))
                    }} />

                <input 
                    placeholder='Enter Password'
                    className='col-span-4 mt-4 px-2 py-2 rounded bg-transparent border border-slate-200'
                    onChange={(e)=>{
                        setUserSignIn((prev)=>({...prev,password:e.target.value}))
                    }} />
                
                <div className='flex justify-center mt-4'>
                    <hr />
                </div>
                
                <button 
                    onClick={async ()=>{
                        handleSignIn()        
                    }}
                    disabled={(userSignIn.email === "" && userSignIn.password === "")}
                    className='col-span-4 px-3 py-2 mt-4 rounded-md bg-slate-100 text-slate-800'
                    >
                        {
                            (processing) ? 
                            <div>Logging In ...</div> 
                            :
                            <div>
                                Login
                            </div>
                        }
                </button>
            </div>
            
        </div>
        <div className='flex justify-center my-5'>
                        <h1>Already have an account? |</h1>
                        <Link href="/signup" className="text-purple-500 ml-2"> Sign Up</Link>
        </div> 
        </div>
    </div>
  )
}

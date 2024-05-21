"use client"

import { usePathname, useRouter} from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import axios from 'axios';

export default function NavBar() {
  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false)
  
  const initUser = async () =>{
    try{
       const res = await axios.post("http://localhost:3000/api/isLoggedIn")
       if(res){
          setIsLoggedIn(res.data.isLoggedIn)
       }
    }
    catch(err:any){
        console.log(err.message)
        return false;
    }
  }

  useEffect(()=>{
    initUser()
  },[])

  const router = useRouter()
  const pathname = usePathname()
 
  // console.log(isLoggedIn,"isLogged In")
    
  return (
    <div className='px-6 my-3'>
        <div className='w-full flex justify-between items-center'>
              <h1>PdfChat.ai</h1>
              {
                (pathname.endsWith("/login") || pathname.endsWith("/signup")) ? 
                <div></div>
                :
                <div>
                   <div>
                  {
                    (!isLoggedIn) ? 
                    <div>
                        <Link href="/login" className='text-slate-100 font-semibold px-3 py-1 bg-transparent border border-blue-200 rounded hover:bg-blue-200 hover:text-[#16183b] '>login</Link>
                    </div> :
                    <div>
                        <h1  
                        onClick={async ()=>{
                          try{
                            const res =await axios.post("http://localhost:3000/api/signout",JSON.stringify({signout:true}))
                            if(res){
                              router.push("/login")
                            }
                          }
                          catch(err){
                            alert("some error occured, please reload")
                          }
                        }}
                        className='text-slate-100 font-semibold cursor-pointer   px-3 py-1 bg-transparent border border-blue-200 rounded hover:bg-blue-200 hover:text-[#16183b] '>sign out</h1>    
                    </div>
                  }
                    </div>
                </div>
              }
              
        </div>
    </div>
  )
}

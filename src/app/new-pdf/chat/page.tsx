"use client"
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { aiMessagesType } from '@/app/types/chatTypes'
const getResponse = async (question:string) =>{
    const chatId = uuidv4()
    try{
        const response = await axios.post(`http://localhost:3000/api/${chatId}`, JSON.stringify({question:question}),{
          
            headers:{
                "Content-Type":"application/json"
            }
           
        })

        if(response){
            console.log(response.data,"from llm")
            return response.data.response
        }
    }
    catch(err){
        throw new Error("Error while fetching answer from server")
    }
}

export default function ChatSeciton() {
    const [question, setQuestion] = useState("")
    const [aiResponse,setAiResponse] = useState("")
    const [aiMessages, setAiMessages] = useState<aiMessagesType[]>([])
  return (
    <div >
      <div className='border rounded border-blue-600 w-full h-[70vh] my-5'>
        <div className=''>
            <div className='bg-slate-800 px-2 py-1 rounded-sm rounded-t-none flex justify-center'>Pdf Name Here</div>
            <div className='my-2'>
                {
                    aiMessages.map((message)=>{
                        return (
                            <div className='border border-slate-300/50 px-2 py-4 rounded-r-xl rounded-bl-xl mx-4 w-[60%] my-4'>{message.aiResponse}</div>
                        )
                    })
                }
            </div>
        </div>
      </div>
      <div className='relative '>
        <input 
            type='text'
            placeholder='Ask question here ...'
            className='bg-[#383739] h-10 w-full px-2 py-2 text-slate-200/60 rounded hover:border hover:border-blue-100 '
            onChange={(e)=>{
                setQuestion(e.target.value)
            }}
        />
        <button 
            className='h-8 w-12 rounded bg-[#1c2977] text-slate-100 absolute right-[5px] top-[4px] '
            disabled={question.length === 0}
            onClick={async ()=>{
                const response = await getResponse(question)
                const date = new Date()
                setAiMessages((prev) => ([...prev,{aiResponse:response,timestamp:date.getTime()}]))
                setQuestion("")
            }}
        >
            Ask 
        </button>
      </div>
     
    </div>
  )
}

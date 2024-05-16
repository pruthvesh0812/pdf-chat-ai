"use client"
import React, { useState , useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { aiMessagesType, messageType } from '@/app/types/chatTypes'
import { useRecoilValue } from 'recoil'
import { pdfIdState } from '../store/Pdf'

const getResponse = async (question:string,messages:messageType[],pdfId:string) =>{
    const chatId = pdfId
    try{
        const response = await axios.post(`http://localhost:3000/api/${chatId}`, JSON.stringify({question:question,messages}),{
          
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
    const pdfId = useRecoilValue(pdfIdState)
    const [allMessages, setAllMessages] = useState<messageType[]>(
        [
            {
                type:"AI",
                text:"Hello, ask questions from uploaded PDF",
                timestamp: new Date().getTime()
            }
        ])
        
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    },[allMessages])

  return (
    <div >
      <div className='border rounded border-blue-600 w-full h-[70vh] my-5 overflow-y-auto ' ref={scrollContainerRef}>
        <div className=''>
            <div className='bg-slate-800 px-2 py-1 rounded-sm rounded-t-none flex justify-center'>Pdf Name Here</div>
            
                {
                    allMessages.map((message,index)=>{
                        return (
                            <div key={index} className={`flex ${message.type == "AI" ? "justify-start" : "justify-end"}`}>
                                <div 
                                    className={`border border-slate-300/50 px-2 py-4 mx-4 w-[55%] my-4 ${message.type == "AI" ? "rounded-r-xl rounded-bl-xl" : "rounded-l-xl rounded-br-xl"}`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        )
                    })
                }
            
        </div>
      </div>
      <div className='relative '>

        <input 
            type='text'
            value={question}
            placeholder='Ask question here ...'
            className='bg-[#383739] h-10 w-full px-2 py-2 text-slate-200/60 rounded hover:border hover:border-blue-100 '
            onChange={(e)=>{
                setQuestion(e.target.value)
            }}

            onKeyDown={async (e) => {
            // Checking if the pressed key is Enter
            if (e.key === 'Enter') {
                setAllMessages((prev) => [...prev, { type: "HUMAN",text:question, timestamp: new Date().getTime()}]);
                
                const response = await getResponse(question,allMessages,pdfId);
                const date = new Date();
                setAllMessages((prev) => [...prev, { type: "AI",text:response, timestamp: date.getTime()}]);
                setQuestion("");
            }}}
        />
        
        <button 
            className='h-8 w-12 rounded bg-[#1c2977] text-slate-100 absolute right-[5px] top-[4px] '
            disabled={question.length === 0}

            onClick={async ()=>{
                setAllMessages((prev) => [...prev, { type: "HUMAN",text:question, timestamp: new Date().getTime()}]);
                
                const response = await getResponse(question,allMessages,pdfId)
                const date = new Date()
                setAllMessages((prev) => [...prev, { type: "AI",text:response, timestamp: date.getTime()}]);
                setQuestion("")
            }}
        >
            Ask 
        </button>
      </div>
     
    </div>
  )
}

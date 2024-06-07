"use client"
import React, { useState, useEffect, useRef } from 'react'

import axios from 'axios'
import {  messageType } from '@/types/AllTypes'
import { useRecoilValue } from 'recoil'
import { pdfIdState } from '../../store/Pdf'
import { truncate } from '@/utils/truncate'
import { NEXT_APP_BASE_URL } from '../../../envv'

const getResponse = async (question: string, messages: messageType[], pdfId: string, setAllMessages:React.Dispatch<React.SetStateAction<messageType[]>>) => {
    const chatId = pdfId
    try {

        // get request to init redis subscriber - eventSource sends a get request by default
        const eventSource = new EventSource(`http://localhost:5001/chat/${chatId}`)

        // post request to send question to backend
        const response = await axios.post(`${NEXT_APP_BASE_URL}/api/${chatId}`, JSON.stringify({ question: question, messages }), {

            headers: {
                "Content-Type": "application/json"
            }

        })

        if (response && response.data.pending == true) {
            // console.log(response.data, "from llm")
            eventSource.addEventListener('message',(event)=>{
                const date = new Date();
                setAllMessages((prev) => [...prev, { type: "AI", text: event.data, timestamp: date.getTime() }]);
            })

            eventSource.addEventListener('error', (event) => {
                const date = new Date();
                setAllMessages((prev) => [...prev, { type: "AI", text: "Error", timestamp: date.getTime() }]);
                console.error('Error occurred while streaming:', event);
                eventSource.close();
              });

           
        }
    }
    catch (err) {
        throw new Error("Error while fetching answer from server")
    }
}

const isEmptyOrWhitespace = (str:string) => {
    return !str.trim();
}

export default function ChatSeciton() {
    const [question, setQuestion] = useState("")
    const [gettingResponse,setGettingResponse] = useState<boolean>(false)
    const {pdfId,pdfName} = useRecoilValue(pdfIdState)
    const [allMessages, setAllMessages] = useState<messageType[]>(
        [
            {
                type: "AI",
                text: "Hello, ask questions from uploaded PDF",
                timestamp: new Date().getTime()
            }
        ])

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }, [allMessages])

    return (
        <div >
            <div className=' w-full h-[70vh] my-5 overflow-y-auto px-2 md:px-14' ref={scrollContainerRef}>
                <div className='relative  '>
                    <h1 className='bg-[#195157] px-3 py-2 rounded-sm rounded-t-none flex justify-center fixed top-14 left-[15%] md:left-[40%]'>Chatting With {truncate(pdfName)}</h1>
                    <div className='pt-10'>

                    {
                        allMessages.map((message, index) => {
                            return (
                                <div key={index} className={`flex  ${message.type == "AI" ? "justify-start" : "justify-end"}`}>
                                    <div
                                        className={` px-2 py-4 mx-4 w-[70%] md:w-[50%] my-4 bg-[#195157]  ${message.type == "AI" ? "rounded-r-xl rounded-bl-xl" : "rounded-l-xl rounded-br-xl"}`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            )
                        })
                    }                        
                     </div>

                </div>
            </div>
            <div className='relative mt-[8vh] px-6 md:px-14 h-full'>

                <input
                    type='text'
                    value={question}
                    aria-multiline
                    placeholder='Ask question here ...'
                    className='bg-[#383739] h-14 w-full  px-2 py-2 text-slate-200/60 rounded hover:border hover:border-blue-100 '
                    onChange={(e) => {
                        setQuestion(e.target.value)
                    }}

                    onKeyDown={async (e) => {
                        // Checking if the pressed key is Enter
                        if (e.key === 'Enter' && !isEmptyOrWhitespace(question) && gettingResponse == false) {
                            setGettingResponse(true)
                            setAllMessages((prev) => [...prev, { type: "HUMAN", text: question, timestamp: new Date().getTime() }]);

                            const response = await getResponse(question, allMessages, pdfId, setAllMessages);
                           
                            setQuestion("");
                            setGettingResponse(false)
                        }
                    }}
                />

                <button
                    className={`h-12 w-12 rounded  text-slate-100 absolute right-[27px] md:right-[60px] top-[4px] ${gettingResponse ? "bg-[#1a2020]" : "bg-[#195157]"}  `}
                    disabled={(question.length === 0 || isEmptyOrWhitespace(question) || gettingResponse == true)}

                    onClick={async () => {
                        if( !isEmptyOrWhitespace(question)){
                            setGettingResponse(true)

                            setAllMessages((prev) => [...prev, { type: "HUMAN", text: question, timestamp: new Date().getTime() }]);

                            await getResponse(question, allMessages, pdfId, setAllMessages)
                            // const date = new Date()
                            // setAllMessages((prev) => [...prev, { type: "AI", text: response, timestamp: date.getTime() }]);
                            setQuestion("")
                            setGettingResponse(false)

                        }
                       
                    }}
                >
                    Ask
                </button>
            </div>

        </div>
    )
}

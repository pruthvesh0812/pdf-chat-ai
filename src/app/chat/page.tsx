"use client"
import React, { useState, useEffect, useRef } from 'react'

import axios from 'axios'
import {  messageType } from '@/types/AllTypes'
import { useRecoilValue } from 'recoil'
import { pdfIdState } from '../../store/Pdf'
import { truncate } from '@/utils/truncate'
import { NEXT_APP_BASE_URL } from '../../../env'

const getResponse = async (question: string, messages: messageType[], pdfId: string) => {
    const chatId = pdfId
    try {
        const response = await axios.post(`${NEXT_APP_BASE_URL}/api/${chatId}`, JSON.stringify({ question: question, messages }), {

            headers: {
                "Content-Type": "application/json"
            }

        })

        if (response) {
            // console.log(response.data, "from llm")
            return response.data.response
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
            <div className=' w-full h-[70vh] my-5 overflow-y-auto px-14' ref={scrollContainerRef}>
                <div className='relative'>
                    <h1 className='bg-[#195157] px-3 py-2 rounded-sm rounded-t-none flex justify-center fixed top-1 left-[40%]'>Chatting With {truncate(pdfName)}</h1>

                    {
                        allMessages.map((message, index) => {
                            return (
                                <div key={index} className={`flex ${message.type == "AI" ? "justify-start" : "justify-end"}`}>
                                    <div
                                        className={` px-2 py-4 mx-4 w-[50%] my-4 bg-[#195157]  ${message.type == "AI" ? "rounded-r-xl rounded-bl-xl" : "rounded-l-xl rounded-br-xl"}`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
            <div className='relative px-14'>

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

                            const response = await getResponse(question, allMessages, pdfId);
                            const date = new Date();
                            setAllMessages((prev) => [...prev, { type: "AI", text: response, timestamp: date.getTime() }]);
                            setQuestion("");
                            setGettingResponse(false)
                        }
                    }}
                />

                <button
                    className={`h-12 w-12 rounded  text-slate-100 absolute right-[60px] top-[4px] ${gettingResponse ? "bg-[#1a2020]" : "bg-[#195157]"}  `}
                    disabled={(question.length === 0 || isEmptyOrWhitespace(question) || gettingResponse == true)}

                    onClick={async () => {
                        if( !isEmptyOrWhitespace(question)){
                            setGettingResponse(true)

                            setAllMessages((prev) => [...prev, { type: "HUMAN", text: question, timestamp: new Date().getTime() }]);

                            const response = await getResponse(question, allMessages, pdfId)
                            const date = new Date()
                            setAllMessages((prev) => [...prev, { type: "AI", text: response, timestamp: date.getTime() }]);
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

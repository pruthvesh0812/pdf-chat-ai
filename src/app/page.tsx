"use client"
import React from 'react'
// import pdf from 'pdf-parse'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { extractTextFromPdf } from './lib/ProcessPdf'
import { generateEmbeddings } from './lib/GenerateEmbeddings'
import { redirect } from 'next/navigation'
import { SetterOrUpdater, useSetRecoilState } from 'recoil'
import { pdfIdState } from './store/Pdf'

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>,setPdfId: SetterOrUpdater<string>) => {
  console.log("sdfs1")

  if (e.target.files) {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = async () => {
      const arrBuffer = reader.result as ArrayBuffer
      const blob = new Blob([arrBuffer])
      const formData = new FormData()
      formData.append('pdfBlob', blob)
      const pdfId = `${uuidv4()}-pdfId`
      const res = await axios.post(`http://localhost:3000/api/generate-embeddings?pdfId=${pdfId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      })
      console.log(res, "res")
      if(res){
        setPdfId(pdfId)
        redirect("/chat")
      }
    }
    reader.readAsArrayBuffer(file)
  }
}


export default function HomePage() {
  const setPdfId = useSetRecoilState(pdfIdState)

  return (
    <div className='flex justify-center'>
      <div>
        <input
          type='file'
          accept="application/pdf"
          placeholder='upload pdf document'
          onChange={(e) => { handleFileUpload(e,setPdfId) }}
        />
      </div>
    </div>
  )
}

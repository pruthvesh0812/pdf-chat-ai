"use client"
import React from 'react'
// import pdf from 'pdf-parse'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { extractTextFromPdf } from '../lib/ProcessPdf'
import { generateEmbeddings } from '../lib/GenerateEmbeddings'

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log("sdfs1")

  if (e.target.files) {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = async () => {
      const arrBuffer = reader.result as ArrayBuffer
      const blob = new Blob([arrBuffer])
      const formData = new FormData()
      formData.append('pdfBlob', blob)
      const res = await axios.post("http://localhost:3000/api/generate-embeddings", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      })
      console.log(res, "res")
    }
    reader.readAsArrayBuffer(file)
  }
}


export default function HomePage() {


  return (
    <div className='flex justify-center'>
      <div>
        <input
          type='file'
          accept="application/pdf"
          placeholder='upload pdf document'
          onChange={(e) => { handleFileUpload(e) }}
        />
      </div>
    </div>
  )
}

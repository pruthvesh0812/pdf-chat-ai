"use client"
import React, { useCallback, useEffect, useState } from 'react'
// import pdf from 'pdf-parse'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { extractTextFromPdf } from './lib/ProcessPdf'
import { generateEmbeddings } from './lib/GenerateEmbeddings'
import { redirect } from 'next/navigation'
import { SetterOrUpdater, useSetRecoilState } from 'recoil'
import { pdfIdState } from '../store/Pdf'
import { useDropzone } from 'react-dropzone'
import { pdf } from '@/types/AllTypes'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const handleFileUpload = async (pdfFILE : File, setPdfId: SetterOrUpdater<pdf>,router:AppRouterInstance) => {
  // console.log("sdfs1")

  if (pdfFILE) {
    const file = pdfFILE
    const pdfName:string = file.name
    const reader = new FileReader()
    reader.onload = async () => {
      const arrBuffer = reader.result as ArrayBuffer
      const blob = new Blob([arrBuffer])
      const formData = new FormData()
      formData.append('pdfBlob', blob)
      
      const pdfId = `${uuidv4()}-pdfId`
      try{
        const res = await axios.post(`http://localhost:3000/api/generate-embeddings?pdfId=${pdfId}&pdfName=${pdfName}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        })
        // console.log(res, "res")
        if (res) {
          setPdfId({pdfId,pdfName:file.name})
          router.push("/chat")
        }
      }
      catch(err:any){
        console.log(err)
        alert(err.message)
        return 
      }
     
    }
    reader.readAsArrayBuffer(file)
  }
}


const getAllUserPdfs = async (setUserPdfs: React.Dispatch<React.SetStateAction<pdf[]>>) =>{
  try{
    const res = await axios.get("http://localhost:3000/api/pdfs")
    if(res){
      // console.log(JSON.parse(res.data))
      setUserPdfs(JSON.parse(res.data).userPdfs)
    }
  }
  catch(err:any){
    console.log(err)
  }
}


export default function HomePage() {
  const [uploadedFiles,setUploadedFiles] = useState<File[]>([])
  const [userPdfs,setUserPdfs] = useState<pdf[]>([])
  const setPdfId = useSetRecoilState(pdfIdState)
  const router = useRouter()
  const {getRootProps,getInputProps,isDragActive} = useDropzone({
    onDrop: useCallback((acceptedFiles:File[])=>{ 
      setUploadedFiles(acceptedFiles)
      handleFileUpload(acceptedFiles[0],setPdfId,router)
    },[]),
    maxFiles:1,
    accept:{
      'application/pdf':['.pdf']
    }
  })

  useEffect(()=>{
    getAllUserPdfs(setUserPdfs)
  },[])
  

  return (
    <div className='flex justify-center '>
      <div className=''>
        <h1 className="text-2xl ">Upload a PDF File to Chat With!</h1>
        
        {/* drop zone */}
        <div {...getRootProps()} className='border border-dashed  border-slate-200 h-[300px] rounded-lg my-10'>
          {
              (isDragActive || uploadedFiles.length != 0) ? 
              <div className="flex flex-col items-center justify-center h-full -mt-2 text-lg">
                <h3 className="text-xl">Uploading File... Please Wait</h3> 
                {
                  uploadedFiles.map(file=>{
                    return (
                      <div className='flex justify-between px-3 py-2 my-3'>
                        <div>
                          {file.name}
                        </div>
                        <div>
                          {file.size}
                        </div>
                      </div>
                     
                    )
                  })
                }              
              </div>
              :
              <div className="flex flex-col items-center justify-center h-full -mt-2">
                <h3 className='my-2 '>Drag and Drop files or</h3>
                <h3 className='my-2 '>Click here to upload files</h3>
              </div>
            }
          <div {...getInputProps()}>
            
          </div>
        </div>
        {/* <input
          type='file'
          accept="application/pdf"
          placeholder='upload pdf document'
          onChange={(e) => { handleFileUpload(e, setPdfId) }}
        /> */}
        <div className="my-5">
        <h1 className='flex justify-center text-xl'>Previously Uploaded PDFs</h1>
        {
          (userPdfs.length == 0) ? 
          <div className='flex justify-center my-5'>
            Loading previous Pdfs ... Please wait
          </div> 
          :
          <div>
            {
               userPdfs.map(pdf =>{
                return (
                  <div 
                  onClick={()=>{
                    setPdfId({pdfId:pdf.pdfId,pdfName:pdf.pdfName})
                    router.push("/chat")
                  }}
                  className="flex px-3 py-2 my-4 text-lg bg-[#195157] rounded cursor-pointer hover:bg-[#0a2f33]">
                    {pdf.pdfName}
                  </div>
                )
              })
            }
          </div>
         
        }
      </div>
      </div>
      
    </div>
  )
}

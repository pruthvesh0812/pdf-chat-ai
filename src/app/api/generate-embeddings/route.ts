import { generateEmbeddings } from "@/app/lib/GenerateEmbeddings";
import { getPineconeClient } from "@/app/lib/PineconeClient";
import { extractTextFromPdf } from "@/app/lib/ProcessPdf";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid'

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const blob: Blob = formData.get("pdfBlob") as Blob
    const userId = request.cookies.get("user")?.value as string || `${uuidv4()}-guest`
    const pdfId = request.nextUrl.searchParams.get("pdfId") as string 
    const pdfName = request.nextUrl.searchParams.get("pdfName")!
    try{
        const arrayBuffer = await blob.arrayBuffer()
        const splitDocs = await extractTextFromPdf(arrayBuffer)
        // console.log("before pine")
        const client = await getPineconeClient()
        // console.log("after pine")

        await generateEmbeddings(splitDocs,client,userId,pdfId,pdfName)
        // console.log("after embeddings")

        return NextResponse.json({ message: "document embedded successfully" }, { status: 200 })
        
    }
    catch(err){
        // console.log(err)
        return NextResponse.json({error:err},{status:500});
    }
    
}
import { generateEmbeddings } from "@/app/lib/GenerateEmbeddings";
import { getPineconeClient } from "@/app/lib/PineconeClient";
import { extractTextFromPdf } from "@/app/lib/ProcessPdf";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const blob: Blob = formData.get("pdfBlob") as Blob

    try{
        const arrayBuffer = await blob.arrayBuffer()
        const splitDocs = await extractTextFromPdf(arrayBuffer)
        console.log("before pine")
        const client = await getPineconeClient()
        console.log("after pine")

        await generateEmbeddings(splitDocs,client)
        console.log("after embeddings")

        return NextResponse.json({ message: "document embedded successfully" }, { status: 200 })
        
    }
    catch(err){
        console.log(err)
        return NextResponse.json({error:err},{status:500});
    }
    
}
import { getPineconeClient } from "@/app/lib/PineconeClient";
import { getRetrievalChain } from "@/app/lib/RetrievalChain";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    const {question}:{question:string} = await req.json();
    const client = await getPineconeClient()
    const retrievalChain = getRetrievalChain(client)
    const result = await (await retrievalChain).invoke({
        input: question,
      });
    
      console.log(result.answer)

    return NextResponse.json({response:result.answer},{status:200})
}
import { getPineconeClient } from "@/app/lib/PineconeClient";
import { getConversationalRetrievalChain } from "@/app/lib/RetrievalChain";
import { NextRequest, NextResponse } from "next/server";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { messageType } from "@/types/AllTypes";
import { MQClient, redisConnect } from "@/app/lib/redisConfig";

export async function POST(req: NextRequest) {
  const { question, messages }: { question: string, messages: messageType[] } = await req.json();
  // const pdfId = req.nextUrl.searchParams.get("chatId") as string
  const pdfId = req.nextUrl.pathname.split('/')[2]
  const userId = req.cookies.get("user")?.value as string
 
  const chatHistory = messages.map(message => {
    if (message.type == "AI") {
      return new AIMessage(message.text)
    }
    else {
      return new HumanMessage(message.text)
    }
  })

  // console.log(chatHistory,"chat history")
  try {
    
    await redisConnect()
    const client = await getPineconeClient()
    await MQClient.lPush("Questions", JSON.stringify({client, userId, pdfId,question,chatHistory}))
    // console.log(result.answer)
    return NextResponse.json({ response: "response pending",pending:true }, { status: 200 })
  }
  catch (err) {
    return NextResponse.json({ error: err ,pending:false}, { status: 500 })
  }


}
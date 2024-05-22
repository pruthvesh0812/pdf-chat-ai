import { getPineconeClient } from "@/app/lib/PineconeClient";
import { getConversationalRetrievalChain } from "@/app/lib/RetrievalChain";
import { NextRequest, NextResponse } from "next/server";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { messageType } from "@/types/AllTypes";

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
    const client = await getPineconeClient()

    const conversationalRetrievalChain = await getConversationalRetrievalChain(client, userId, pdfId)
    // const retrievalChain = getRetrievalChain(client)
    // const result = await (await retrievalChain).invoke({
    //     input: question,
    //   });
    const result = await conversationalRetrievalChain.invoke({
      chat_history: chatHistory,
      input: question,
    });

    // console.log(result.answer)
    return NextResponse.json({ response: result.answer }, { status: 200 })
  }
  catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }


}
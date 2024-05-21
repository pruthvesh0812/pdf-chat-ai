import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeStoreParams } from "@langchain/pinecone";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { getPineconeClient } from "./PineconeClient";
import { Pinecone } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from "uuid";

import { connectMongoDb } from "../../models/mongoDbClient";
import { pdfs } from "../../models/Pdf";
import { users } from "@/models/User";
export const generateEmbeddings = async (splitDocs: Document<Record<string, any>>[], client: Pinecone, userId: string, pdfId: string,pdfName:string) => {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(process.env.PINECONE_INDEX_NAME)

    const dynamicNamespace = userId + uuidv4() + "-namespace"
    try {
        const vectorstore = await PineconeStore.fromDocuments(
            splitDocs,
            embeddings,
            {
                pineconeIndex: index,
                namespace: dynamicNamespace
            }
        );
        
        
        connectMongoDb()
        const newPDF = new pdfs({ pdfId, userId, namespace: dynamicNamespace,pdfName })
        const pdf = await newPDF.save()

        const pdfArray:string[] = []
        pdfArray.push(pdfId)

        const updateUser = await users.findOneAndUpdate({userId},{pdfId:pdfArray},{new:true})
        
       
    }
    catch (err:any) {
        console.log(err)
    }


}

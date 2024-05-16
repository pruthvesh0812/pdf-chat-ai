import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeStoreParams } from "@langchain/pinecone";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { getPineconeClient } from "./PineconeClient";
import { Pinecone } from "@pinecone-database/pinecone";
import { v4 as uuidv4} from "uuid";
import { PDFs } from "../models/User";
export const generateEmbeddings = async (splitDocs:Document<Record<string, any>>[],client:Pinecone,userId:string,pdfId:string) =>{
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(process.env.PINECONE_INDEX_NAME)

    const dynamicNamespace = userId+uuidv4()+"namespace"
    try{
        const vectorstore = await PineconeStore.fromDocuments(
            splitDocs,
            embeddings,
            {
                pineconeIndex:index,
                namespace:dynamicNamespace
            }
        );
        
        const newPDF = new PDFs({pdfId,userId,namespace:dynamicNamespace})
        await newPDF.save()
    
    }
    catch(err){
        throw new Error("error while generating embeddings")
    }
  
    
}

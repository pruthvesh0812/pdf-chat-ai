import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFs } from "../models/User";

let NAMESPACE:string = ""
let PDFID:string = ""

export async function getVectorStore(client: Pinecone,userId:string,pdfId:string){
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(process.env.PINECONE_INDEX_NAME)
    try{
         // for first question
        if(NAMESPACE.length == 0){
            const userPdfNamespace = await PDFs.findOne({userId,pdfId})
            NAMESPACE = userPdfNamespace?.namespace as string
        }
        else if(PDFID != pdfId){
            const userPdfNamespace = await PDFs.findOne({userId,pdfId})
            NAMESPACE = userPdfNamespace?.namespace as string
        }

        const existingVectorStore = await PineconeStore.fromExistingIndex(
            embeddings,
            {
                pineconeIndex: index,
                textKey:'text',
                namespace: NAMESPACE
            }
        )
        
        return existingVectorStore;
    }
    catch(err){
        throw new Error("Error while getting existing vector store")
    }
   
}
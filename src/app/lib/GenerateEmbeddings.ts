import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeStoreParams } from "@langchain/pinecone";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { getPineconeClient } from "./PineconeClient";
import { Pinecone } from "@pinecone-database/pinecone";
export const generateEmbeddings = async (splitDocs:Document<Record<string, any>>[],client:Pinecone) =>{
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(process.env.PINECONE_INDEX_NAME)
    const vectorstore = await PineconeStore.fromDocuments(
        splitDocs,
        embeddings,
        {
            pineconeIndex:index,
            namespace:"test-namespace-1"
        }
    );

    
}

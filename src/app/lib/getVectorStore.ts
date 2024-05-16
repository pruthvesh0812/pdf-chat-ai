import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export async function getVectorStore(client: Pinecone){
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(process.env.PINECONE_INDEX_NAME)

    const existingVectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        {
            pineconeIndex: index,
            textKey:'text',
            namespace: "test-namespace-1"
        }
    )
    
    return existingVectorStore;
}
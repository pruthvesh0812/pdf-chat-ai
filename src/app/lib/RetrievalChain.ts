import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { systemPrompt } from "./PromptTemplates";
import { chatModel } from "./InitOpenAi";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { getVectorStore } from "./getVectorStore";
import { Pinecone } from "@pinecone-database/pinecone";





export const getRetrievalChain = async (client:Pinecone) =>{
    const documentChain = await createStuffDocumentsChain({
        llm: chatModel,
        prompt:systemPrompt,
        });
    
    const existingVectorStore = await getVectorStore(client);
    const retriever = existingVectorStore.asRetriever();

    const retrievalChain = await createRetrievalChain({
        combineDocsChain: documentChain,
        retriever,
      });
    return retrievalChain
}


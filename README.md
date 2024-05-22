This is a Nextjs application which enables users to query contents from uploaded pdf, with a chat interface.

# Project Report
## Methodology

#### PDF Parser: Pdf contents have to be parsed first, for that I used built in Pdf parsers provided by langchain, which uses pdf-dist at its core. I wanted to parser the pdf on the client side and then send only the parsed data on the server, trying to reduce some server load, but couldn't find any suitable client-side Pdf parsing library.
#### Vector Embeddings: The parsed pdf content being huge in size most of the times, the parsed data needs to be chunked first and then vector embeddings have to be generated for each of the chunked data and then combined and stored in Pinecone vector database. I used openAi's embedding class object to generate embeddings
#### Pinecone: The vector embeddings are stored in pinecone vector database. It uses indexing to retrived data quickly compared to tradition databases, and also has metric like cosine, nearest neighbours, to allow semantic search, that is search on the basis of context of the seach query.
#### Chat Section: The user can interact with the pdf once it is processed. A conversational format is used for the chat. The question the user asks, is first converted into vector embeddings, and then context for the question is retrieved from pdf's vector embeddings in the pinecone db (semantic search). Then the questions vector embeddings, contextual vector embeddings, and chat history is passed to the historyAwareConversationalRetrievalChain from langchain with a set of custom prompts to get the desired output

## Architecture Diagram
![pdf-chat-ai-architecture](https://github.com/pruthvesh0812/pdf-chat-ai/assets/98747838/55f36d73-7d79-48ff-8801-34cd0e179323)

## Tech Stack
Nextjs 13, MongoDb, Langchain, PineconeDb

## Encountered Challenges
The only challenge I faced was to use app router in nextjs 13. Shifting from page router to app router, and building an app in a contricted time window was a challenge.
First, run the development server:

## Key Learnings
Understood how LLM's and Vector Database work. Got familiar with the ups and downs of the Nextjs 13's app router.

Open [https://pdf-chat-ai-two.vercel.app/signup](https://pdf-chat-ai-two.vercel.app/signup) with your browser to chat with your pdf.



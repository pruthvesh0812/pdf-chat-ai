import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MessagesPlaceholder } from "@langchain/core/prompts";

export const systemPrompt =
  ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
    <context>
    {context}
    </context>

    Question: {input}`
);


export const historyAwarePrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
  [
    "user",
    "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
  ],
]);


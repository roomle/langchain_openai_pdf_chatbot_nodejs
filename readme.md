# LangChain OpenAI Chatbot for PDFs with Node.js

**An OpenAI key is required for this application (see [Create an OpenAI API key](https://gptforwork.com/help/gpt-for-docs/setup/create-openai-api-key)).
The OpenAI key must be set in the environment variable `OPENAI_API_KEY`.**

In this application, a simple chatbot is implemented that uses OpenAI [LangChain](https://js.langchain.com/docs/get_started/introduction) to answer questions about texts stored in a database.
The database can be created and expanded with PDF documents.  
The application consists of two scripts. The first generates a database from a given set of PDFs or adds documents to an existing database.
The second script starts a chatbot that uses the database to answer questions.

## Install

```none
npm install
```

## Add PDFs to the database

```none
npm run adddocs <path>
```

The database is created in "data/vectorstore.usql".

First, all documents in the specified directory are searched for, loaded and split into chunks:

```ts
const directoryLoader = new DirectoryLoader(directory, {
    '.pdf': (path) => new PDFLoader(path),
});
const docs = await directoryLoader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splitDocs = await textSplitter.splitDocuments(docs);
```

The the chunks are vectorized and added to the database:

```ts
const vectorStoreSource = 'data/vectorstore.hnsw';
if (fs.existsSync(vectorStoreSource)) {
  const vectorStore = await HNSWLib.load(vectorStoreSource, new OpenAIEmbeddings());
  await vectorStore.addDocuments(docs);
  await vectorStore.save(vectorStoreSource);
} else {
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  await vectorStore.save(vectorStoreSource);
}
```

In this example, an "HNSWLib" lib is used for the VectorStore, as it has proven to be the easiest to implement and is used in the tutorials. The documents are stored in a JSON file.
However, [LangChain](https://js.langchain.com/docs/get_started/introduction) supports many different databases for [Vector stores](https://js.langchain.com/docs/integrations/vectorstores).

## Start the chatbot server

```none
npm run start
```

The app is implemented with an Express HTTP server that uses a VectorStore OpenAI agent to respond to requests.
The client that sends `XMLHttpRequest` to the server and displays the result.

The server loads the database and creates an agent:

```ts
const llm = new OpenAI({temperature: 0.1, verbose: false});
const vectorStore = await HNSWLib.load(vectorStoreSource, ew OpenAIEmbeddings());
const vectorStoreInfo = {
    name: 'pdf',
    description: 'pdf documents',
    vectorStore,
};
const vectorStoreToolkit = new VectorStoreToolkit(
    vectorStoreInfo,
    llm
);
const agent = createVectorStoreAgent(llm, vectorStoreToolkit);
```

When a request is received, the agent is used to answer the question:

```ts
const result = await this._agent.invoke({ input: question });
const answer = result.output;
```

## Resources

- [LangChain](https://js.langchain.com/docs/get_started/introduction)
- [LLMs OpenAI](https://js.langchain.com/docs/integrations/llms/openai)
- [File Loaders - PDF files](https://js.langchain.com/docs/integrations/document_loaders/file_loaders/pdf)
- [VectorStore Agent Toolkit](https://js.langchain.com/docs/integrations/toolkits/vectorstore)
- [Vector stores](https://js.langchain.com/docs/integrations/vectorstores)
- [HNSWLib](https://js.langchain.com/docs/integrations/vectorstores/hnswlib)
- [USearch](https://js.langchain.com/docs/integrations/vectorstores/usearch)
- [Vector Stores - Chroma](https://js.langchain.com/docs/integrations/vectorstores/chroma)

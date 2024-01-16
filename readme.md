# LangChain OpenAI Chatbot for PDFs with Node.js

**An OpenAI key is required for this application (see [Create an OpenAI API key](https://gptforwork.com/help/gpt-for-docs/setup/create-openai-api-key)).
The OpenAI key must be set in the environment variable `OPENAI_API_KEY`.**

The application consists of two scripts.
The first generates a database from a given set of PDFs or adds documents to an existing database.
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

## Start the chatbot server

```none
npm run start
```

## Resources

- [LLMs OpenAI](https://js.langchain.com/docs/integrations/llms/openai)
- [File Loaders - PDF files](https://js.langchain.com/docs/integrations/document_loaders/file_loaders/pdf)
- [VectorStore Agent Toolkit](https://js.langchain.com/docs/integrations/toolkits/vectorstore)
- [HNSWLib](https://js.langchain.com/docs/integrations/vectorstores/hnswlib)
- [USearch](https://js.langchain.com/docs/integrations/vectorstores/usearch)
- [Vector Stores - Chroma](https://js.langchain.com/docs/integrations/vectorstores/chroma)

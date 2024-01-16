import process from 'process';
import * as fs from 'fs';
import { OpenAIEmbeddings } from '@langchain/openai';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import type { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { USearch } from '@langchain/community/vectorstores/usearch';

export const addToHnswVectorStore = async (
  docs: Document[],
  embeddings: OpenAIEmbeddings
) => {
  const vectorStoreSource = 'data/vectorstore.hnsw';
  if (fs.existsSync(vectorStoreSource)) {
    const vectorStore = await HNSWLib.load(vectorStoreSource, embeddings);
    await vectorStore.addDocuments(docs);
    await vectorStore.save(vectorStoreSource);
  } else {
    const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
    await vectorStore.save(vectorStoreSource);
  }
};

export const addToUSearchVectorStore = async (
  docs: Document[],
  embeddings: OpenAIEmbeddings
) => {
  const vectorStoreSource = 'data/vectorstore.usql';
  if (fs.existsSync(vectorStoreSource)) {
    const vectorStore = await USearch.load(vectorStoreSource, embeddings);
    await vectorStore.addDocuments(docs);
    await vectorStore.save(vectorStoreSource);
  } else {
    const vectorStore = await USearch.fromDocuments(docs, embeddings);
    await vectorStore.save(vectorStoreSource);
  }
};

const commands: string[] = process.argv.slice(2);
if (commands.length < 1) {
  console.error('No document directory specified.');
  process.exit(1);
}
const documentDirectory: string = commands[0];

const addDocumentsToVectorStore = async (directory: string) => {
  const embeddings = new OpenAIEmbeddings();

  const directoryLoader = new DirectoryLoader(directory, {
    '.pdf': (path) => new PDFLoader(path),
  });
  const docs = await directoryLoader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);
  await addToHnswVectorStore(splitDocs, embeddings);
};

void addDocumentsToVectorStore(documentDirectory);

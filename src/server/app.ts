import express from 'express';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import type { AgentExecutor } from 'langchain/agents';
import { VectorStoreToolkit, createVectorStoreAgent } from 'langchain/agents';

const port: number = 8080;
const hostname: string = 'localhost';
const vectorStoreSource = 'data/vectorstore.hnsw';

interface RequestData {
  message: string;
}

interface ResponseData {
  message: string;
}

class App {
  private _server: http.Server;
  private _port: number;
  private _llm: OpenAI;
  private _embeddings: OpenAIEmbeddings;
  private _vectorStore?: HNSWLib;
  private _vectorStoreToolkit?: VectorStoreToolkit;
  private _agent?: AgentExecutor;

  constructor(portNumber: number) {
    this._port = portNumber;

    this._llm = new OpenAI({
      temperature: 0.1,
      verbose: false,
    });
    this._embeddings = new OpenAIEmbeddings();

    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../../dist/client')));

    app.post('/test', (req, res) => {
      console.log('Request received:', req.body);
      try {
        const requestData = req.body as RequestData;
        void this._createResponse(requestData).then((responseData) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.send(responseData);
        });
      } catch (error) {
        console.error('Error processing request:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.send({ message: 'Error processing request:', error });
      }
    });

    this._server = new http.Server(app);
  }

  public async startServer() {
    await this._loadVectorStoreAndCreateAgent();
    this._server.listen(this._port, () => {
      console.log(`Example app listening on port ${this._port}`);
      console.log(`http://${hostname}:${this._port}/`);
    });
  }

  private async _loadVectorStoreAndCreateAgent() {
    this._vectorStore = await HNSWLib.load(vectorStoreSource, this._embeddings);
    const vectorStoreInfo = {
      name: 'pdf',
      description: 'pd documents',
      vectorStore: this._vectorStore,
    };
    this._vectorStoreToolkit = new VectorStoreToolkit(
      vectorStoreInfo,
      this._llm
    );
    this._agent = createVectorStoreAgent(this._llm, this._vectorStoreToolkit);
  }

  private async _createResponse(request: RequestData): Promise<ResponseData> {
    if (this._agent) {
      const result = await this._agent.invoke({ input: request.message });
      console.log('result:', result.output);
      return { message: result.output as string };
    }
    return { message: 'no agent' };
  }
}

void new App(port).startServer();

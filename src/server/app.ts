import express from 'express';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';

const port: number = 8080;
const hostname: string = 'localhost';

interface RequestData {
  message: string;
}

class App {
  private server: http.Server;
  private port: number;

  constructor(portNumber: number) {
    this.port = portNumber;
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../../dist/client')));

    app.post('/test', (req, res) => {
      console.log('Request received:', req.body);
      try {
        const data = req.body as RequestData;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send({ message: `response: ${data.message}` });
      } catch (error) {
        console.error('Error processing request:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.send({ message: 'Error processing request:', error });
      }
    });

    this.server = new http.Server(app);
  }

  public Start() {
    this.server.listen(this.port, () => {
      console.log(`Example app listening on port ${port}`);
      console.log(`http://${hostname}:${port}/`);
    });
  }
}

new App(port).Start();

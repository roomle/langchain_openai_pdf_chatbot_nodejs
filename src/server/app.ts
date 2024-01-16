import express from 'express';
import path from 'path';
import http from 'http';

const port: number = 8080;
const hostname: string = '127.0.0.1';

class App {
  private server: http.Server;
  private port: number;

  constructor(portNumber: number) {
    this.port = portNumber;
    const app = express();
    app.use(express.static(path.join(__dirname, '../client')));
    this.server = new http.Server(app);
  }

  public Start() {
    this.server.listen(this.port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }
}

new App(port).Start();

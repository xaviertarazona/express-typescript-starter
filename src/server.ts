import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import logger from './config/logger.ts';
import { ServerMessages } from './constants/server-messages.ts';
import { HttpStatusCodes } from './constants/http-status-codes.ts';
import { HttpMessages } from './constants/http-messages.ts';
import healthRouter from './routes/health.ts';

export class Server {
  public app: express.Express;
  private server?: http.Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();

    this.configureMiddlewares();
    this.registerRoutes();
    this.registerNotFoundHandler();
    this.registerErrorHandler();
  }

  private configureMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      morgan('dev', {
        stream: { write: message => logger.http(message.trim()) }
      })
    );
  }

  private registerRoutes(): void {
    this.app.use('/health', healthRouter);
    
  }

  private registerNotFoundHandler(): void {
    this.app.use((req: Request, res: Response) => {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        message: HttpMessages.NOT_FOUND,
        path: req.originalUrl
      });
    });
  }

  private registerErrorHandler(): void {
    this.app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
      logger.error(err.stack ?? err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message ?? HttpMessages.INTERNAL_SERVER_ERROR,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });
  }

  public async listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = this.app
        .listen(this.port, () => {
          logger.info(`${ServerMessages.SERVER_LISTENING} ${this.port} (${this.app.get('env')})`);
          resolve();
        })
        .on('error', err => {
          reject(err);
        });
    });
  }

  public async stop(): Promise<void> {
    if (!this.server) return;
    this.server.close(err => {
      if (err) logger.error(ServerMessages.SERVER_STOP_FAILED, { err });
    });
  }
}

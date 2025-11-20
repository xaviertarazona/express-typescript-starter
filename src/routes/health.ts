import { Router, Request, Response } from 'express';
import { HttpStatusCodes } from '../constants/http-status-codes.ts';

const healthRouter = Router();
healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(HttpStatusCodes.OK).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default healthRouter;
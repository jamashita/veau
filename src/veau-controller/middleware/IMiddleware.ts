import * as express from 'express';

export interface IMiddleware {

  apply(): express.RequestHandler | express.ErrorRequestHandler;
}

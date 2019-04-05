import * as express from 'express';

export interface IMiddleware {

  apply(...args: Array<any>): express.RequestHandler | express.ErrorRequestHandler;
}

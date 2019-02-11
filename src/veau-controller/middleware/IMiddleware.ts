import * as express from 'express';

export interface IMiddleware {

  middleware(req: express.Request, res: express.Response, next: express.NextFunction): any;
}

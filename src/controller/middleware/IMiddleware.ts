import { Peek } from '@jamashita/anden-type';
import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

export interface IMiddleware extends NestMiddleware<Request, Response> {
  use(req: Request, res: Response, next: Peek): unknown;
}

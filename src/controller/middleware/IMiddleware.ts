import { Peek } from '@jamashita/anden-type';
import { NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface IMiddleware extends NestMiddleware<FastifyRequest, FastifyReply> {
  use(req: FastifyRequest, res: FastifyReply, next: Peek): unknown;
}

import { Peek, Whatever } from '@jamashita/anden-type';
import { NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface IMiddleware extends NestMiddleware<FastifyRequest, FastifyReply> {
  use(request: FastifyRequest, reply: FastifyReply, next: Peek): Whatever;
}

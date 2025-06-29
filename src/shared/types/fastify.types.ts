import { FastifyRequest as OriginalFastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    startTime?: number;
  }
}

export type FastifyRequest = OriginalFastifyRequest;

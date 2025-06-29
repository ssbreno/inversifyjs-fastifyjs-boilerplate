declare module 'dotenv' {
  export function config(options?: {
    path?: string;
    encoding?: string;
    debug?: boolean;
    override?: boolean;
  }): void;
  export function parse(src: string | Buffer): Record<string, string>;
}

declare module '@fastify/cors' {
  import { FastifyPluginCallback } from 'fastify';
  const fastifyCors: FastifyPluginCallback<{
    origin?:
      | boolean
      | string
      | RegExp
      | (string | RegExp)[]
      | ((origin: string, cb: (err: Error | null, allow: boolean) => void) => void);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
    preflight?: boolean;
    strictPreflight?: boolean;
    hideOptionsRoute?: boolean;
  }>;
  export default fastifyCors;
}

declare module '@fastify/swagger' {
  import { FastifyPluginCallback } from 'fastify';
  const fastifySwagger: FastifyPluginCallback<{
    swagger?: Record<string, any>;
    openapi?: Record<string, any>;
    hideUntagged?: boolean;
    exposeRoute?: boolean;
    transform?: (schema: any) => any;
  }>;
  export default fastifySwagger;
}

declare module '@fastify/swagger-ui' {
  import { FastifyPluginCallback } from 'fastify';
  const fastifySwaggerUi: FastifyPluginCallback<{
    routePrefix?: string;
    uiConfig?: Record<string, any>;
    staticCSP?: boolean;
    transformSpecification?: (swaggerObject: any) => any;
    transformSpecificationClone?: boolean;
  }>;
  export default fastifySwaggerUi;
}

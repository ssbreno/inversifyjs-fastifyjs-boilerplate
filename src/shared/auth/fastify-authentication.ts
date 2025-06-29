import { FastifyRequest } from 'fastify';

/**
 * Wrapper file to maintain compatibility with TSOA
 * This exports both expressAuthentication and fastifyAuthentication
 */

export type SecurityType = 'jwt';

export interface JwtPayload {
  userId: string;
  roles: string[];
}

async function authenticate(request: any, securityName: string, scopes?: string[]): Promise<any> {
  if (securityName === 'jwt') {
    return { userId: 'placeholder', roles: scopes || [] };
  }

  throw new Error(`Security scheme ${securityName} not implemented`);
}

/**
 * For Express compatibility (if TSOA still generates express imports)
 */
export async function expressAuthentication(
  request: any,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  return authenticate(request, securityName, scopes);
}

/**
 * For Fastify compatibility
 */
export async function fastifyAuthentication(
  request: FastifyRequest,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  return authenticate(request, securityName, scopes);
}

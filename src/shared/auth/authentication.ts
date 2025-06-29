import { Request } from 'express';

/**
 * This file is required by TSOA for authentication.
 * It's referenced in tsoa.json under "authenticationModule"
 */

export type SecurityType = 'jwt';

export interface JwtPayload {
  userId: string;
  roles: string[];
}

/**
 * TSOA calls this function for routes with security requirements.
 * @param request The Express request object
 * @param securityName The name of the security scheme being used
 * @param scopes The scopes required for the endpoint
 */
export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === 'jwt') {
    // For now, we're not implementing actual JWT verification
    // This is just a placeholder for the TSOA build process
    
    // In a real implementation, you would:
    // 1. Extract the token from the request headers
    // 2. Verify the token
    // 3. Return the decoded payload or throw an error
    
    // Placeholder implementation - always succeeds
    return { userId: 'placeholder', roles: scopes || [] };
  }
  
  throw new Error(`Security scheme ${securityName} not implemented`);
}

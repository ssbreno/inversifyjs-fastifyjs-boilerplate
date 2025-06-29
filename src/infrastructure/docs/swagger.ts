import { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerSwaggerDocs(fastify: FastifyInstance) {
  const openapiPath = path.resolve(__dirname, '../../../src/generated/openapi.json');

  try {
    const swaggerSpec = JSON.parse(readFileSync(openapiPath, 'utf8'));

    const swaggerHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.10.0/swagger-ui.css">
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.10.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              spec: ${JSON.stringify(swaggerSpec)},
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
              layout: "BaseLayout",
              docExpansion: 'list',
              defaultModelsExpandDepth: 1
            });
            window.ui = ui;
          };
        </script>
      </body>
      </html>
    `;

    fastify.get('/docs', (request, reply) => {
      reply.type('text/html').send(swaggerHtml);
    });

    fastify.get('/docs/swagger.json', (request, reply) => {
      reply.type('application/json').send(swaggerSpec);
    });

    return true;
  } catch (error) {
    console.error('Error setting up Swagger documentation:', error);
    return false;
  }
}

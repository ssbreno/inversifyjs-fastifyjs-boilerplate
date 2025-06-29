import 'reflect-metadata';
import { TYPES } from './shared/types/types.js';
import { container } from './infrastructure/config/inversify.config.js';
import { Server } from './infrastructure/server/server.js';
import { PrismaService } from './infrastructure/prisma/prisma.service.js';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  try {
    const prismaService = container.get<PrismaService>(TYPES.PrismaService);
    await prismaService.onModuleInit();

    const server = container.get<Server>(TYPES.Server);
    await server.setup();
    await server.start();

    const shutdown = async () => {
      console.log('Shutting down application gracefully...');
      await prismaService.onModuleDestroy();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Unhandled error during bootstrap:', error);
  process.exit(1);
});

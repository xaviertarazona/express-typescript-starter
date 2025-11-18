import { Server } from './server.ts';
import logger from './config/logger.ts';
import { ServerMessages } from './constants/server-messages.ts';

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  const server = new Server(PORT);
  try {
    await server.listen();
  } catch (error: unknown) {
    logger.error(ServerMessages.SERVER_START_FAILED, { error });
    process.exit(1);
  }
}

main();

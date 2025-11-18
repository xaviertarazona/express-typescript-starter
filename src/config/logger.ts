import { createLogger, format, transports } from 'winston';

const { combine, timestamp, colorize, printf, errors } = format;
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    errors({ stack: true }),
    printf(({ timestamp, level, message, stack, ...metadata }) => {
      let meta = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
      return stack
        ? `${timestamp} [${level}]: ${message}\n${stack}${meta ? ' ' + meta : ''}`
        : `${timestamp} [${level}]: ${message}${meta ? ' ' + meta : ''}`;
    })
  ),
  transports: [new transports.Console()]
});

export default logger;

import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDatabase } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import groqRoutes from './routes/groq.routes.js';
import mediaRoutes from './routes/media.routes.js';
import renderRoutes from './routes/render.routes.js';
import aiRoutes from './routes/ai.routes.js';
import stabilityRoutes from './routes/stability.routes.js';
import { renderTest } from './controllers/render.controller.js';
import { errorHandler } from './middlewares/error.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/groq', groqRoutes);
app.use('/media', mediaRoutes);
// Public test endpoint for quick render verification
app.get('/render/test', renderTest);
app.use('/render', renderRoutes);
app.use('/ai', aiRoutes);
app.use('/stability', stabilityRoutes);

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.use(errorHandler);

// Serve generated temp files (renders, images, audio)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/temp', express.static(path.join(__dirname, 'temp')));
const DEFAULT_PORT = Number(process.env.PORT) || 4000;

async function startServer(desiredPort = DEFAULT_PORT, maxAttempts = 5) {
  try {
    await connectDatabase();

    let attempt = 0;
    let port = desiredPort;

    while (attempt < maxAttempts) {
      attempt += 1;
      const server = http.createServer(app);

      try {
        await new Promise((resolve, reject) => {
          server.once('error', (err) => reject(err));
          server.once('listening', () => resolve(server));
          server.listen(port);
        });

        console.log(`Server listening on ${port}`);
        return; // successfully bound
      } catch (err) {
        if (err && err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} in use, trying ${port + 1}...`);
          port += 1;
          // try next port
        } else {
          console.error('Failed to start server:', err);
          process.exit(1);
        }
      }
    }

    console.error(`Failed to bind to a port after ${maxAttempts} attempts.`);
    process.exit(1);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

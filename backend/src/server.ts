import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// cors configuration - allows frontend to make requests
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// middleware setup
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // parse json requests
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // parse url-encoded data

// request logging middleware for dev environment
if (NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    success: true,
    message: 'Welcome to HasthiyaAuth API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      health: '/health'
    }
  });
});

// health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// api routes
app.use('/api/auth', authRoutes); // public auth endpoints
app.use('/api/user', userRoutes); // protected user endpoints

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// server startup function
const startServer = async (): Promise<void> => {
  try {
    // test database connection before starting server
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }
    
    // start listening for requests
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(` Server running on port ${PORT}`);
      console.log(` Environment: ${NODE_ENV}`);
      console.log(` CORS enabled for: ${corsOptions.origin}`);
      console.log(` API URL: http://localhost:${PORT}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

// handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});

// start the server
startServer();

export default app;

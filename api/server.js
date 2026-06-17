import express from 'express';
import mongoose from 'mongoose';
import user_DB from '../config/user_DB.js';
import router from '../routes/user_routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { check_worker } from '../auth/middleware.js';
import dotenv from 'dotenv';
dotenv.config();



const app = express();

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await user_DB();
    } catch (err) {
      console.error('Database not ready for request:', err);
      return res.status(503).json({
        message: 'Database connection is not ready yet. Please try again in a moment.',
        success: false,
      });
    }
  }
  next();
});
const corsOptions = {
  origin: ['https://wrkrbnc.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Authorization'],
  maxAge: 86400
};

app.use(cors(corsOptions));

// Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);

  next();
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/checkworker", check_worker)
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WorkerBNC API</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f3f4f6;
          color: #1f2937;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          background-color: white;
          padding: 2rem 3rem;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h1 { color: #4F46E5; margin-bottom: 0.5rem; }
        p { color: #6b7280; font-size: 1.1rem; }
        .status {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #dcfce7;
          color: #166534;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>WorkerBNC Backend API</h1>
        <p>The server is up and running!</p>
        <div class="status">🟢 Active</div>
      </div>
    </body>
    </html>
  `);
});
// Routes
app.use("/", router);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test successful' });
});


export default app;

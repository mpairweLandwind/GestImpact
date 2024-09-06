import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth.route.mjs';
import { residencyRoute } from './routes/residencyRoute.js';
import emailRoutes from './routes/emailRoute.mjs';
import maintenanceRoute from './routes/maintenance.route.mjs';
import { getUserRoleMonthlyCounts } from './controllers/user.controller.mjs';
import paypalRoutes from './routes/paypalRoutes.mjs';
import listingRouter from './routes/listing.route.mjs';
import connectDB from './config/db.mjs';
import bodyParser from 'body-parser';
import { userRouter } from './routes/user.route.mjs';
import { transactionRoutes } from './routes/transaction.route.mjs';

dotenv.config();

connectDB();

const app = express();

const __dirname = path.resolve();

// Middleware for logging requests and tokens (for debugging)
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log(`Token: ${req.headers.authorization}`);
  }
  next();
});

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure CORS to allow requests from your frontend
const allowedOrigins = ['http://localhost:3000','http://localhost:5173', 'https://gestimpact.vercel.app']; // Adjust as needed
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Allow cookies to be sent with requests
}));

app.get('/api/user/count', getUserRoleMonthlyCounts);
app.use("/api/residency", residencyRoute);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);
app.use('/api/paypal', paypalRoutes);
app.use('/api/maintenance', maintenanceRoute);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRouter);
app.use('/api/email', emailRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../Client/dist')));

// The "catchall" handler: for any request that doesn't match one above, send back the React index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/dist', 'index.html'));
});

// Serve the index.html file on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
//import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';
import maintenanceRoute from './routes/maintenance.route.mjs';
//import { updateMaintenance } from './controllers/maintenanceController.mjs';
import paypalRoutes from './routes/paypalRoutes.mjs';
import listingRouter from './routes/listing.route.mjs';
import connectDB from './config/db.mjs';
import bodyParser from 'body-parser';
import {userRouter }from './routes/user.route.mjs';

dotenv.config()

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

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies (form data)
app.use(cookieParser());



app.use("/api/residency", residencyRoute)
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);
app.use('/api/paypal', paypalRoutes);
app.use('/api/maintenance', maintenanceRoute);


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

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});


import express from 'express';
import { getSalesData } from '../controllers/transactionController.mjs';

const router = express.Router();

// Route to get sales data
router.get('/salesdata', getSalesData);

export {router as transactionRoutes};

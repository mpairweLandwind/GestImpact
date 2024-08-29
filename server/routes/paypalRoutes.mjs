import express from 'express';
import { createOrder,getAllTransactionsWithListings  } from '../controllers/paypalController.mjs';

const router = express.Router();

router.post('/create-order', createOrder);
router.get('/transactions', getAllTransactionsWithListings);
//router.post('/capture-order', captureOrder);

export default router;

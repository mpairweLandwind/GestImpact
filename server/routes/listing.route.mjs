import express from 'express';
import {
  createListing,
  deleteListing,
  updateListing,
  updateProperty ,
  getAllResidencies,
  getListing,
  getListings,
  getPropertyStatusPercentages  
} from '../controllers/listing.controller.mjs';
import jwtCheck from "../config/auth0Config.js";
import { verifyToken } from '../utils/verifyUser.mjs';

// Middleware to check if the user has the required role
const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).send('Access Denied');
  }
  next();
};

const router = express.Router();

// Routes with verifyToken middleware
router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.put('/update/:id', verifyToken, updateProperty);
router.get('/property-status-percentages', getPropertyStatusPercentages);
router.get("/listings", getAllResidencies);
router.get('/:id', getListing);
router.get('/get/', getListings);

export default router;

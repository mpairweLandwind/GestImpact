import express from 'express';
import {
  createListing,
  deleteListing,
  updateListing,
  getAllResidencies,
  getListing,
  getListings,
  getPropertyStatusPercentages  
} from '../controllers/listing.controller.mjs';
import jwtCheck from "../config/auth0Config.js";

// Middleware to check if the user has the required role
const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).send('Access Denied');
  }
  next();
};

const router = express.Router();

// Routes with verifyToken middleware
router.post('/create', jwtCheck, createListing);
router.delete('/delete/:id', jwtCheck, deleteListing);
router.post('/update/:id', jwtCheck, updateListing);
router.get('/property-status-percentages', getPropertyStatusPercentages);
router.get("/listings", getAllResidencies);
router.get('/:id', getListing);
router.get('/get/', getListings);

export default router;

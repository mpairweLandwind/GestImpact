// routes/maintenanceRoutes.js
import express from 'express';
import {
  createMaintenance,
  getMaintenance,  
  deleteMaintenance,getAllMaintenance
} from '../controllers/maintenanceController.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';
//import jwtCheck from "../config/auth0Config.js";

const router = express.Router();

router.post('/create', verifyToken,createMaintenance);
router.get('/get/:id', getMaintenance);
//router.post('/update/:id',verifyToken, updateMaintenance);
router.delete('/delete/:id',verifyToken, deleteMaintenance);
router.get('/allmaintenance', getAllMaintenance);

export default router;

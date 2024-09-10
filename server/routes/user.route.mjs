import express from 'express';
// import { deleteUser, updateUser,  getUserListings, getUser, checkEmail
//    } from '../controllers/user.controller.mjs';
import { verifyToken } from '../utils/verifyUser.mjs';
//import { getNotificationNumber } from '../controllers/user.controller.mjs';

import {
    bookVisit,
    cancelBooking,
    createUser,
    getAllBookings,
    getAllFavorites,
    toFav,
  } from "../controllers/user.controller.mjs";
 // import jwtCheck from '../config/auth0Config.js';


const router = express.Router();

router.post("/register",verifyToken,createUser);
router.post("/bookVisit/:id", verifyToken, bookVisit);
router.post("/allBookings",verifyToken, getAllBookings);
router.post("/removeBooking/:id", verifyToken, cancelBooking);
router.post("/toFav/:rid",  toFav);
router.post("/allFav/", verifyToken, getAllFavorites);


// router.get('/check-email/:email', checkEmail);
// router.post('/update/:id', verifyToken, updateUser)
// router.delete('/delete/:id', verifyToken, deleteUser)
// router.get('/listings/', verifyToken, getUserListings)
// router.get('/:id', verifyToken, getUser)



//router.get('/user-role-monthly-counts',verifyToken, getUserRoleMonthlyCounts);

//router.get("/notification", verifyToken, getNotificationNumber);


export {router as userRouter};
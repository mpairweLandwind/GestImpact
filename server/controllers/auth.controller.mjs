import asyncHandler from "express-async-handler";
import prisma from '../lib/prisma.mjs';
import bcrypt from 'bcryptjs';
import { errorHandler } from "../utils/error.mjs";
import jwt from 'jsonwebtoken';

// User Signup
export const signup = asyncHandler(async (req, res, next) => {
  console.log("Creating a user");

  const { email, image, password } = req.body;

  // Check if the user already exists
  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    console.log("User already exists");
    return res.status(409).send({ message: "User already registered" });
  }


  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      email,
      image,
      password: hashedPassword,
    },
  });

  // Create JWT token
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '3h' });

  // Send response with user data and token
  res.status(200).send({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      image: newUser.image,
    },
    token,
  });
});

// signin code

export const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Incoming request:', req.body);

  const validUser = await prisma.user.findUnique({ where: { email } });

  if (!validUser) {
    console.error('user not found');
    return next(errorHandler(404, 'User not found!'));
  }

  console.log('User found:', validUser);

  if (typeof validUser.password !== 'string') {
    return next(errorHandler(500, 'Invalid password format!'));
  }

  const validPassword = await bcrypt.compare(password, validUser.password);
  if (!validPassword) {
    return next(errorHandler(401, 'Wrong credentials!'));
  }

  const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const { password: pass, ...rest } = validUser;
  console.log('successful login');
  
  // Log the user data to ensure the image is included
  console.log('User data to be returned:', rest);

  res.status(200).json({
    success: true,
    token,
    user: rest,
  });
});


// Google Authentication
export const google = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (user) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { password: pass, ...rest } = user;
    res.status(200).json({
      success: true,
      token,
      user: rest,
    });
  } else {
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const newUser = await prisma.user.create({
      data: {
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        role: req.body.role,
        password: hashedPassword,
        avatar: req.body.photo,
      }
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { password: pass, ...rest } = newUser;
    res.status(200).json({
      success: true,
      token,
      user: rest,
    });
  }
});

// User SignOut
export const signOut = asyncHandler(async (req, res, next) => {
  res.status(200).json('User has been logged out!');
});

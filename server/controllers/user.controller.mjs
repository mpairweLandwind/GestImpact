import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.mjs';
import prisma from '../lib/prisma.mjs';
import { ObjectId } from 'mongodb';
import asyncHandler from "express-async-handler";



export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");

  let { email } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else res.status(201).send({ message: "User already registered" });
});

// function to book a visit to resd
export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.send("your visit is booked successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    // Attempt to find bookings in the 'transaction' table
    const transactionBookings = await prisma.transaction.findMany({
      where: { userId: email },
      include: {
        // Include related data if needed, e.g., related listing or maintenance
        listing: true,
        maintenance: true,
      },
    });

    // Attempt to find bookings in the 'listing' table using `userEmail`
    const listingBookings = await prisma.listing.findMany({
      where: { userEmail: email }, // Use the correct field name
    });

    // Attempt to find bookings in the 'maintenance' table using `userEmail`
    const maintenanceBookings = await prisma.maintenance.findMany({
      where: { userEmail: email }, // Use the correct field name
    });

    // Combine all the bookings found
    const combinedBookings = [
      ...transactionBookings,
      ...listingBookings,
      ...maintenanceBookings,
    ];

    if (combinedBookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
  console.log(combinedBookings);
    res.status(200).json(combinedBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





// function to cancel the booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });

    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });

      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to add a resd in favourite list of a user
export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });

      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to get all favorites
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const favResd = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });
    res.status(200).send(favResd);
  } catch (err) {
    throw new Error(err.message);
  }
});










export const updateUser = async (req, res, next) => {
  // Log the received data
  console.log('Received data:', req.body);

  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    // Ensure role is provided in the request body
    if (!req.body.role) {
      return next(errorHandler(400, 'Role is required'));
    }

    let dataToUpdate = {};

    // Add fields to dataToUpdate if they exist in req.body
    if (req.body.username) {
      dataToUpdate.username = req.body.username;
    }
    if (req.body.email) {
      dataToUpdate.email = req.body.email;
    }
    if (req.body.role) {
      dataToUpdate.role = req.body.role;
    }
    if (req.body.avatar) {
      dataToUpdate.avatar = req.body.avatar;
    }
    if (req.body.password) {
      dataToUpdate.password = await bcrypt.hash(req.body.password, 10);
    }

    // Check if dataToUpdate is empty
    if (Object.keys(dataToUpdate).length === 0) {
      return next(errorHandler(400, 'No valid fields to update'));
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id }, // Treat id as a string
      data: dataToUpdate,
    });

    const { password, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));

  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res) => {
  const requestedUserId = req.query.id; // Accessing the user ID from query parameters

  try {
    // Find the user by ID to ensure the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: requestedUserId, // Ensure this is a string that matches your user ID type
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve all listings where userRef matches the requestedUserId
    const userListings = await prisma.listing.findMany({
      where: {
        userRef: requestedUserId, // Assuming userRef is the field that references the user in the listings table
      },
    });

    res.status(200).json({ listings: userListings }); // Structured response
  } catch (error) {
    console.error('Error retrieving user listings:', error);
    res.status(500).json({ message: 'Failed to get user listings' }); // Structured error response
  }
};




export const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return next(errorHandler(404, 'User not found!'));

    const { password, ...rest } = user;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



export const checkEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const exists = !!user;

    res.json({ exists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// userController.js
export const getNotificationNumber = async (req, res) => {
  try {
    const tokenUserId = req.userRef // Hardcoded valid ObjectId for testing
    console.log('user id:',tokenUserId)
    if (!ObjectId.isValid(tokenUserId)) {
      console.error("Invalid user ID format");
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const number = await prisma.chat.count({
      where: {
        userRefs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });

    console.log('Query successful, count:', number);
    res.status(200).json({ count: number });
  } catch (err) {
    console.error('Error in getNotificationNumber:', err.message);
    res.status(500).json({ message: "Failed to get notification count!" });
  }
};

export const getUserRoleMonthlyCounts = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // January 1st of current year
    const endDate = new Date(currentYear, 11, 31); // December 31st of current year

    // Assuming you want to count by role and month without raw SQL
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        NOT: {
          role: 'admin'
        }
      },
      select: {
        createdAt: true,
        role: true
      }
    });

    // Processing data in JavaScript to group by month and role
    const counts = users.reduce((acc, user) => {
      const month = user.createdAt.getMonth();
      const role = user.role;
      if (!acc[month]) acc[month] = { landlord: 0, user: 0 };
      if (role === 'landlord' || role === 'user') {
        acc[month][role]++;
      }
      return acc;
    }, {});

    // Transform counts into the desired array format
    const result = Object.keys(counts).map(month => ({
      month: new Date(0, month).toLocaleString('default', { month: 'short' }),
      ...counts[month]
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching monthly user role counts:", error);
    res.status(500).send("Failed to fetch data.");
  }
};


export const getUserMaintenances = async (req, res) => {
  const requestedUserId = req.query.id; // Accessing the user ID from query parameters

  try {
    // Find the user by ID to ensure the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: requestedUserId, // Ensure this is a string that matches your user ID type
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve all listings where userRef matches the requestedUserId
    const userMaintenances = await prisma.maintenance.findMany({
      where: {
        userRef: requestedUserId, // Assuming userRef is the field that references the user in the listings table
      },
    });

    res.status(200).json({ maintenances: userMaintenances }); // Structured response
  } catch (error) {
    console.error('Error retrieving user listings:', error);
    res.status(500).json({ message: 'Failed to get user listings' }); // Structured error response
  }
};


export const getAdminEmailController = async (req, res) => {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' },
      select: { email: true },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    res.json({ data: { email: admin.email } });
    console.log('Admin email:', admin.email);
  } catch (error) {
    console.error('Error fetching admin email:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};
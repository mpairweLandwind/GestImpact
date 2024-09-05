import prisma from '../lib/prisma.mjs';
import asyncHandler from "express-async-handler";


export const createOrder = async (req, res) => {
  try {
    const { userId, propertyId, propertyType, amount, orderId } = req.body;

    // Create a new transaction in the database using Prisma
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        propertyId,
        propertyType,
        amount,
        orderId,
        status: 'completed',
      },
    });

    // Update the status of the listing to 'occupied'
    const updatedListing = await prisma.listing.update({
      where: {
        id: propertyId,
      },
      data: {
        status: 'occupied',
      },
    });

    // Respond with the created transaction and updated listing
    res.status(201).json({ message: 'Transaction completed successfully', transaction, updatedListing });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
};


// Function to get all transactions and maintenance records
export const getAllTransactionsWithListings = asyncHandler(async (req, res) => {
  try {
    // Fetch all transactions along with their associated listing details
    const transactions = await prisma.transaction.findMany({
      include: {
        listing: true, // Include the related listing data
      },
    });

    // Fetch all maintenance records along with the user's email
    const maintenanceRecords = await prisma.maintenance.findMany({
      include: {       
        user: {
          select: {          
            email: true,  // Include the user's email
          },
        },
      },
    });

    // If no records found for either, respond accordingly
    if (transactions.length === 0 && maintenanceRecords.length === 0) {
      return res.status(404).json({ message: 'No transactions or maintenance records found' });
    }

    // Respond with both transactions and maintenance records
    res.status(200).json({
      transactions,
      maintenanceRecords,
    });
  } catch (error) {
    console.error('Error retrieving transactions and maintenance records:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});
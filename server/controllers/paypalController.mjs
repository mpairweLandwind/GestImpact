import prisma from '../lib/prisma.mjs';

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



export const getAllTransactionsWithListings = async (req, res) => {
  try {
    // Retrieve all transactions along with their associated listing details
    const transactions = await prisma.transaction.findMany({
      include: {
        listing: true, // Include the related listing data
      },
    });

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    // Respond with all transactions and their associated listing details
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({ message: 'Error retrieving transactions', error });
  }
};

// controllers/transactionController.mjs

import prisma from '../lib/prisma.mjs'; // Adjust the path to your Prisma client
import dayjs from 'dayjs';

export const createTransaction = async (req, res) => {
  const { amount, orderId, propertyId, propertyType, userId } = req.body;

  try {
    // Validate required fields
    if (!amount || !orderId || !propertyId || !propertyType || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        paypalOrderId: orderId,
        propertyId,
        userId,
        status: 'Pending',
        ...(propertyType === 'listing' ? { listing: { connect: { id: propertyId } } } : {}),
        ...(propertyType === 'maintenance' ? { maintenance: { connect: { id: propertyId } } } : {}),
      },
    });

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
};



// Controller to get sales data
export const getSalesData = async (req, res) => {
  try {
    const now = dayjs();

    const monthStart = now.subtract(1, 'month').toISOString();
    const monthlySales = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: monthStart,
        },
      },
    });
    const monthlySalesAmount = monthlySales.reduce((total, transaction) => total + transaction.amount, 0);
    const monthlySalesCount = monthlySales.length;

    const halfYearStart = now.subtract(6, 'months').toISOString();
    const halfYearSales = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: halfYearStart,
        },
      },
    });
    const halfYearSalesAmount = halfYearSales.reduce((total, transaction) => total + transaction.amount, 0);
    const halfYearSalesCount = halfYearSales.length;

    const yearStart = now.subtract(1, 'year').toISOString();
    const yearlySales = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: yearStart,
        },
      },
    });
    const yearlySalesAmount = yearlySales.reduce((total, transaction) => total + transaction.amount, 0);
    const yearlySalesCount = yearlySales.length;

    res.json({
      monthlySales: { amount: monthlySalesAmount, count: monthlySalesCount },
      halfYearSales: { amount: halfYearSalesAmount, count: halfYearSalesCount },
      yearlySales: { amount: yearlySalesAmount, count: yearlySalesCount },
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


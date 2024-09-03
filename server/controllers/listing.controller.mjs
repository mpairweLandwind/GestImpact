import prisma from '../lib/prisma.mjs';
import { errorHandler } from '../utils/error.mjs';
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";


export const createListing = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      regularPrice, 
      discountPrice, 
      type, 
      property, 
      status, 
      country, 
      city, 
      address, 
      facilities, 
      userEmail, 
      images 
    } = req.body.data;

    // Creating the listing
    const listing = await prisma.listing.create({
      data: {
        name,
        description,
        regularPrice,
        discountPrice,
        type,
        property,
        status,
        country,
        city,
        address,
        facilities,
        user: {
          connect: {
            email: userEmail,
          },
        },
        image: images || [], // Ensure images is an array, or default to an empty array if null
      },
      select: {
        id: true,
      },
    });

    res.send({ message: "Residency created successfully", listing });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Edit a Listing
export const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    description, 
    regularPrice, 
    discountPrice, 
    type, 
    property, 
    status, 
    country, 
    city, 
    address, 
    facilities, 
    images 
  } = req.body.data;

  try {
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        name,
        description,
        regularPrice,
        discountPrice,
        type,
        property,
        status,
        country,
        city,
        address,
        facilities,
        image: images || [], // Ensure images is an array, or default to an empty array if null
      },
    });

    res.send({ message: "Listing updated successfully", listing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a Listing
export const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.listing.delete({
      where: { id },
    });

    res.send({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// function to get a specific document/residency
export const getListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
    });
    res.send(listing);
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to get all the documents/residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
  const listings = await prisma.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(listings);
});



// export const deleteListing = async (req, res) => {
//   try {
//     const listing = await prisma.listing.findUnique({
//       where: { id: req.params.id },
//     });

//     if (!listing) {
//       return res.status(404).json({ message: 'Listing not found!' });
//     }

//     if (req.user.id !== listing.userRef) {
//       return res.status(401).json({ message: 'You can only delete your own listings!' });
//     }

//     await prisma.listing.delete({
//       where: { id: req.params.id },
//     });
//     res.status(200).json({ message: 'Listing has been deleted!' });
//     console.log("listing deleted successfully!")
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to delete listing' });
//   }
// };


// export const updateListing = async (req, res) => {
//   try {
//     // Log the received data for debugging
//     console.log('Received data:', req.body);

//     // Find the listing by its ID
//     const listing = await prisma.listing.findUnique({
//       where: { id: req.params.id },
//     });

//     // Check if the listing exists
//     if (!listing) {
//       return res.status(404).json({ message: 'Listing not found!' });
//     }

//     // Verify that the user is authorized to update the listing
//     if (req.user.id !== listing.userRef) {
//       return res.status(401).json({ message: 'You can only update your own listings!' });
//     }

//     // Destructure req.body to exclude nested objects and immutable fields
//     const { id, postDetail, user, createdAt, approvalStatus, isSaved, ...updateData } = req.body;

//     // Convert string fields to appropriate types if necessary
//     if (updateData.latitude) {
//       updateData.latitude = parseFloat(updateData.latitude);
//     }
//     if (updateData.longitude) {
//       updateData.longitude = parseFloat(updateData.longitude);
//     }
//     if (updateData.regularPrice) {
//       updateData.regularPrice = parseFloat(updateData.regularPrice);
//     }
//     if (updateData.discountPrice) {
//       updateData.discountPrice = parseFloat(updateData.discountPrice);
//     }
//     if (updateData.bathrooms) {
//       updateData.bathrooms = parseInt(updateData.bathrooms, 10);
//     }
//     if (updateData.bedrooms) {
//       updateData.bedrooms = parseInt(updateData.bedrooms, 10);
//     }

//     // Log the update data for debugging
//     console.log('Update data:', updateData);

//     // Update the listing with the non-nested data provided
//     const updatedListing = await prisma.listing.update({
//       where: { id: req.params.id },
//       data: updateData,
//     });

//     // Log the updated listing ID for debugging
//     console.log('Updated listing:', updatedListing.id);
//     console.log('Updated successfully');

//     // Return the id of the updated listing and a success message
//     res.status(200).json({ id: updatedListing.id, message: 'Updated successfully' });
//   } catch (error) {
//     // Log the error for debugging
//     console.error('Error updating listing:', error);

//     // Handle errors and return a 500 status code
//     res.status(500).json({ message: error.message });
//   }
// };





// Get multiple listings with filters
export const getListings = async (req, res, next) => {
  try {
    const { searchTerm, offer, furnished, parking, type, sort, order, limit, startIndex, city, property, bedrooms, minPrice, maxPrice } = req.query;
    const parsedLimit = parseInt(limit, 10) || 9;
    const parsedStartIndex = parseInt(startIndex, 10) || 0;

    const whereClause = {
      name: {
        contains: searchTerm || '',
        mode: 'insensitive',
      },
      ...(offer !== undefined && { offer: offer === 'true' }),
      ...(furnished !== undefined && { furnished: furnished === 'true' }),
      ...(parking !== undefined && { parking: parking === 'true' }),
      ...(city && { city }),
      ...(property && { property }),
      ...(bedrooms && { bedrooms: parseInt(bedrooms) }),
      ...(minPrice && maxPrice && {
        regularPrice: {
          gte: parseFloat(minPrice),
          lte: parseFloat(maxPrice),
        },
      }),
    };

    // Check if type is defined and not 'all'
    if (type !== undefined && type !== 'all') {
      whereClause.type = type;
    }

    console.log('Query parameters:', req.query);
    console.log('Where clause:', whereClause);

    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: {
        user: true,  // Include user details in the result
      },
      orderBy: {
        [sort || 'createdAt']: order || 'desc',
      },
      skip: parsedStartIndex,
      take: parsedLimit,
    });

    console.log('Listings found:', listings);

    res.status(200).json(listings.map(listing => ({
      ...listing,
      user: {
        id: listing.user.id,
        username: listing.user.username,
        email: listing.user.email,
        status: listing.user.status
      }
    })));
  } catch (error) {
    console.error('Error occurred:', error);
    next(errorHandler(500, 'Failed to get listings'));
  }
};



// calculating percentage
export const getPropertyStatusPercentages = async (req, res) => {
  try {
    // Fetch total number of listings
    const totalListings = await prisma.listing.count();

    // Fetch count of listings by status
    const statusCounts = await prisma.listing.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Calculate percentage for each status
    const statusPercentages = statusCounts.map(item => ({
      name: item.status,
      percentValues: totalListings > 0 ? (item._count.status / totalListings) * 100 : 0,
    }));

    res.json(statusPercentages);
  } catch (error) {
    console.error("Error fetching property status percentages:", error);
    res.status(500).send("Failed to fetch data.");
  }
};
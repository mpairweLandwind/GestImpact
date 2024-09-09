import axios from "axios";
import { toast } from "react-toastify";


export const api = axios.create({
  baseURL: "https://gestimpact-server.vercel.app/api",
  //"http://localhost:3000/api"
  // "https://gestimpact-server.vercel.app/api",
});

// Fetch all properties
export const getAllProperties = async () => {
  try {
    const response = await api.get("/listing/listings", { timeout: 10 * 1000 });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }

    return {
      listings: response.data.listings || [],
      maintenanceRecords: response.data.maintenanceRecords || [],
    };
  } catch (error) {
    toast.error("Failed to fetch properties. Please try again.");
    throw error;
  }
};

// logout function
export const logout = async () => {
 

  try {
    // Optional: Call the server to notify the logout
    await api.post('/auth/signout');

    // Clear local storage and reset state
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userImage");
    localStorage.clear();

  
  

    console.log('User successfully logged out');
  } catch (error) {
  
    console.error('Error during logout:', error);
  }
};


// Sign-In API Function
export const signInUser = async (formData) => {
  try {
    const response = await api.post('/auth/signin', formData, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      toast.success("Signed in successfully!");
      return response.data;
    } else {
      throw new Error(response.data.message || "Authentication failed");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to sign in. Please check your credentials.");
    throw error;
  }
};

// Sign-Up API Function
export const signUpUser = async (formData) => {
  try {
    const response = await api.post("/auth/signup", formData, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.data.success) {
      toast.error(response.data.message || "Sign-up failed");
      return { success: false, message: response.data.message };
    }

    toast.success("Successfully signed up!");
    return { success: true };
  } catch (error) {
    toast.error("Sign-up error. Please try again.");
    return { success: false, message: error.message };
  }
};

// Update a Property
export const updateProperty = async (id, updatedData, token) => {
  try {
    const response = await api.put(`/listing/update/${id}`, { ...updatedData }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      toast.success("Property updated successfully!");
      return response.data;
    } else {
      toast.error("Failed to update property.");
    }
  } catch (error) {
  //  toast.error("Error updating property. Please try again.");
    throw error;
  }
};

// Send an Email
export const sendEmail = async (emailData, token) => {
  try {
    const response = await api.post('/email/send', emailData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    toast.success('Email sent successfully!');
    return response.data;
  } catch (error) {
  //  toast.error('Failed to send email. Please try again.');
    throw error;
  }
};

// Fetch all maintenance records
export const getAllMaintenances = async () => {
  try {
    const response = await api.get("/maintenance/allmaintenance", { timeout: 10 * 1000 });

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }

    return response.data;
  } catch (error) {
    //@ts-expect-errortoast.error("Failed to fetch maintenance records. Please try again.");
    throw error;
  }
};

// Fetch a specific property
export const getProperty = async (id) => {
  try {
    const response = await api.get(`/listing/${id}`, { timeout: 10 * 1000 });
    return response.data;
  } catch (error) {
    //toast.error("Failed to fetch property details. Please try again.");
    throw error;
  }
};

// Edit a Property
export const editProperty = async (id, updatedData, token) => {
  try {
    const response = await api.put(`/listing/${id}`, { ...updatedData }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      toast.success("Property updated successfully!");
    } else {
      //toast.error("Failed to update property.");
    }

    return response.data;
  } catch (error) {
    //toast.error("Error editing property. Please try again.");
    throw error;
  }
};

// Delete a Property
export const deleteProperty = async (id, token) => {
  try {
    const response = await api.delete(`/listing/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      toast.success("Property deleted successfully!");
    } else {
     // toast.error("Failed to delete property.");
    }

    return response.data;
  } catch (error) {
    //toast.error("Error deleting property. Please try again.");
    throw error;
  }
};

// Create a Residency
export const createResidency = async (data, token) => {
  try {
    const response = await api.post("/listing/create", { data }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Residency created successfully!");
    return response.data;
  } catch (error) {
    //toast.error("Failed to create residency. Please try again.");
    throw error;
  }
};

// Create a Maintenance record
export const createMaintenance = async (data, token) => {
  try {
    const response = await api.post("/maintenance/create", { data }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Maintenance record created successfully!");
    return response.data;
  } catch (error) {
    //toast.error("Failed to create maintenance record. Please try again.");
    throw error;
  }
};

// Handle favorites and bookings similarly...



export const createUser = async (email, token) => {
  try {
    await api.post(
      `/user/register`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
   // toast.error("Something went wrong while registering user, Please try again");
    throw error;
  }
};




export const toFav = async (id, email, token) => {
  try {
    await api.post(
      `/user/toFav/${id}`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (e) {
   // toast.error("Something went wrong while posting favs");
    throw e;
  }
};


export const getAllFav = async (email, token) => {
  if(!token) return 
  try{

    const res = await api.post(
      `/user/allFav`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      
    return res.data["favResidenciesID"]

  }catch(e)
  {
   // toast.error("Something went wrong while fetching favs");
    throw e
  }
} 


export const getAllBookings = async (email, token) => {
  
  if(!token) return 
  try {
    const res = await api.post(
      `/user/allBookings`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data);
    return res.data;
 
    
  } catch (error) {
    //toast.error("Something went wrong while fetching bookings");
    throw error
  }
}



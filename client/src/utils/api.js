import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "https://gestimpact-server.vercel.app/api",
  //"http://localhost:3000/api"
  // "https://gestimpact-server.vercel.app/api",
});

export const getAllProperties = async () => {
  try {
    const response = await api.get("/listing/listings", {
      timeout: 10 * 1000,
    });
    console.log(response.data);

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }

    // Assuming response.data contains both listings and maintenance records
    return {
      listings: response.data.listings || [], // Ensure this is an array
      maintenanceRecords: response.data.maintenanceRecords || [], // Ensure this is an array
    };
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};


// Sign-In API Function
export const signInUser = async (formData) => {
  try {
    const response = await api.post('/auth/signin', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Authentication failed");
    }
  } catch (error) {
    console.error("Sign-In failed:", error);
    toast.error(error.response?.data?.message || "Failed to connect to the server");
    throw error;
  }
};

// Sign Up API
export const signUpUser = async (formData) => {
  try {
    const response = await api.post("/auth/signup", formData, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.data.success) {
      toast.error(response.data.message);
      return { success: false, message: response.data.message };
    }

    toast.success("Successfully signed up!");
    return { success: true };
  } catch (error) {
    toast.error("Error signing up");
    return { success: false, message: error.message };
  }
};

// Update a Property
export const updateProperty = async (id, updatedData, token) => {
  try {
    const response = await api.put(
      `/listing/update/${id}`,
      { ...updatedData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      toast.success("Property updated successfully");
    } else {
      toast.error("Failed to update property");
    }

    return response.data;
  } catch (error) {
    toast.error("Error updating property");
    throw error;
  }
};

export const sendEmail = async (emailData, token) => {
  try {
    const response = await api.post('/email/send', emailData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Axios automatically throws an error for non-2xx responses
    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }

    toast.success('Email sent successfully');
    return response.data;
  } catch (error) {
    console.error('Failed to send email:', error);
    toast.error('Failed to send email');
    throw error;
  }
};





export const getAllMaintences = async () => {
  try {
    const response = await api.get("/maintenance/allmantenance", {
      timeout: 10 * 1000,
    });

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const response = await api.get(`/listing/${id}`, {
      timeout: 10 * 1000,
    });
console.log(response.data);
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

// Edit a Property
export const editProperty = async (id, updatedData, token) => {
  try {
    const response = await api.put(
      `/listing/${id}`,
      { ...updatedData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      toast.success("Property updated successfully");
    } else {
      toast.error("Failed to update property");
    }

    return response.data;
  } catch (error) {
    toast.error("Something went wrong, Please try again");
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
      toast.success("Property deleted successfully");
    } else {
      toast.error("Failed to delete property");
    }

    return response.data;
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};



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
    toast.error("Something went wrong, Please try again");
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
    toast.error("Something went wrong while fetching favs");
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
    toast.error("Something went wrong while fetching bookings");
    throw error
  }
}


export const createResidency = async (data, token) => {
  console.log(data)
  try{
    const res = await api.post(
      `/listing/create`,
      {
        data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }catch(error)
  {
    throw error
  }
}

export const createMaintenance = async (data, token) => {
  try {
    console.log("Data to be sent:", data);
    console.log("Token used:", token);

    const response = await api.post(
      `/maintenance/create`, // Ensure the route is unique
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error('Error creating maintenance:', error);
    throw error;
  }
};
import { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import UserDetailContext from "../../context/UserDetailContext"; // Import the context, not as a function
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";

const Layout = () => {
  useFavourites();
  useBookings();

  const [isLoading, setIsLoading] = useState(true);

  // Use useContext to get the values from UserDetailContext
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const { email: userEmail, token } = userDetails; // Extract the user email and token from userDetails

  // Mutation to create a user
  const { mutate } = useMutation({
    mutationKey: [userEmail],
    mutationFn: (token) => createUser(userEmail, token),
  });

  useEffect(() => {
    const registerUser = async () => {
      try {
        if (userEmail && token) {
          // Set user details in context (already done in SignIn)
          setUserDetails((prev) => ({
            ...prev,
            token,
            email: userEmail,
          }));

          // Mutate to create the user in the backend using the token
          mutate(token);
        } else {
          console.log("User email or token is missing.");
        }
      } catch (error) {
        console.error("Error during user registration:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Proceed if token and email are available
    if (userEmail && token) {
      registerUser();
    } else {
      setIsLoading(false);  // No user logged in, stop loading
    }
  }, [userEmail, token, mutate, setUserDetails]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={{ background: "var(--black)", overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

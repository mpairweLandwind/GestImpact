import { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";

const Layout = () => {
  useFavourites();
  useBookings();

  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token),
  });

  useEffect(() => {
    const handleAuthentication = async () => {
      if (isAuthenticated) {
        // If user is authenticated, try to get the token silently
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: "http://localhost:3000",
              scope: "openid profile email",
            },
          });

          console.log("Access Token:", token);

          // Set both token and email in UserDetailContext
          setUserDetails((prev) => ({
            ...prev,
            token,
            email: user?.email,
          }));

          mutate(token);
        } catch (error) {
          console.error("Error during silent token retrieval:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // If user is not authenticated, redirect to login
        loginWithRedirect();
      }
    };

    handleAuthentication();
  }, [isAuthenticated, getAccessTokenSilently, loginWithRedirect, mutate, setUserDetails, user?.email]);

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

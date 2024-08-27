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
  const { isAuthenticated, user, getAccessTokenWithPopup } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token),
  });

  useEffect(() => {
    const getTokenAndRegister = async () => {
      try {
        const res = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: "https://gest-impact.vercel.app",
            scope: "openid profile email",
          },
        });
        console.log("Access Token:", res);

        // Set both token and email in UserDetailContext
        setUserDetails((prev) => ({
          ...prev,
          token: res,
          email: user?.email,
        }));
        
        mutate(res);
      } catch (error) {
        console.error("Error during token retrieval:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isAuthenticated) {
      getTokenAndRegister();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, getAccessTokenWithPopup, mutate, setUserDetails, user?.email]);
  
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
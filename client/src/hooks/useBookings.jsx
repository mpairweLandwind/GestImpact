import  { useContext, useEffect } from "react";
import UserDetailContext from "../context/UserDetailContext";
import { useQuery } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllBookings } from "../utils/api";

const useBookings = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailContext); 
  const { user } = useAuth0();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: "allBookings",
    queryFn: () => getAllBookings(user?.email, userDetails?.token),
    onSuccess: (data) => {
      console.log("Fetched data:", data); 
      setUserDetails((prev) => ({ ...prev, bookings: data }));
    },
    enabled: user !== undefined,
    staleTime: 30000,
  });

  useEffect(() => {
    if (userDetails?.token) {
      refetch();
    }
  }, [userDetails?.token, refetch]);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      console.log("Fetched data in useEffect:", data);
    }
  }, [isLoading, isError, data]);

  return { data, isError, isLoading };
};

export default useBookings;

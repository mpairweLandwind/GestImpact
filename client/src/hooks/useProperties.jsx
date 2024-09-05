import { useQuery } from "react-query";
import { getAllProperties } from "../utils/api";

const useProperties = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allProperties",
    getAllProperties,
    { refetchOnWindowFocus: false }
  );

  return {
    data: data || {}, // Ensure data is an object
    isError,
    isLoading,
    refetch,
  };
};

export default useProperties;

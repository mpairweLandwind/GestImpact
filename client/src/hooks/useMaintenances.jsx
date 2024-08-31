import React from "react";
import { useQuery } from "react-query";
import { getAllMaintenances } from "../utils/api";

const useMaintenances = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allMaintenances",
    getAllMainances,
    { refetchOnWindowFocus: false }
  );

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useMaintenances;

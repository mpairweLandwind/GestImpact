import React, { useContext, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";

const Favourites = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const {
    userDetails: { favourites = [] },
  } = useContext(UserDetailContext);

  // Log the properties and favourites data to the console
  console.log(data);  // Logs the data object containing listings and maintenanceRecords
  console.log(favourites); // Logs the favourite property IDs

  // Combine listings and maintenanceRecords (if you want both)
  const properties = [...(data?.listings || []), ...(data?.maintenanceRecords || [])];

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {properties
            .filter((property) => favourites.includes(property.id)) // Filter favourites
            .filter(
              (property) =>
                property.name.toLowerCase().includes(filter.toLowerCase()) ||
                property.city.toLowerCase().includes(filter.toLowerCase()) ||
                property.country.toLowerCase().includes(filter.toLowerCase()) ||
                property.address.toLowerCase().includes(filter.toLowerCase()) ||
                property.status.toLowerCase().includes(filter.toLowerCase())
            )
            .map((card, i) => (
              <PropertyCard card={card} key={i} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Favourites;

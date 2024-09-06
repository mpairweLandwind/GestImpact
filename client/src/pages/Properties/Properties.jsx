import React, { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState(""); // filter state to manage search input

  console.log(data);

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

  // Extract listings and maintenanceRecords from the data object
  const listings = data.listings || [];
  const maintenanceRecords = data.maintenanceRecords || [];

  // Combine listings and maintenanceRecords into a single array
  const combinedData = [...listings, ...maintenanceRecords];

  // Filter the combined data based on the user's input
  const filteredData = combinedData.filter(
    (property) =>
      property.name.toLowerCase().includes(filter.toLowerCase()) ||
      property.city.toLowerCase().includes(filter.toLowerCase()) ||
      property.type.toLowerCase().includes(filter.toLowerCase()) ||
      property.status.toLowerCase().includes(filter.toLowerCase()) ||
      property.country.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        {/* Pass filter and setFilter to SearchBar */}
        <SearchBar filter={filter} setFilter={setFilter} onSearchClick={() => {/* Perform search action if needed */}} />

        <div className="paddings flexCenter properties">
          {filteredData.map((card, i) => (
            <PropertyCard card={card} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;

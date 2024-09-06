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
  const filteredData = combinedData.filter((property) => {
    const lowerCaseFilter = filter.toLowerCase();

    // Check if any relevant field includes the filter
    return (
      (property.name && property.name.toLowerCase().includes(lowerCaseFilter)) ||
      (property.city && property.city.toLowerCase().includes(lowerCaseFilter)) ||
      (property.type && property.type.toLowerCase().includes(lowerCaseFilter)) ||
      (property.status && property.status.toLowerCase().includes(lowerCaseFilter)) ||
      (property.state && property.state.toLowerCase().includes(lowerCaseFilter)) ||
      (property.property && property.property.toLowerCase().includes(lowerCaseFilter)) ||
      (property.country && property.country.toLowerCase().includes(lowerCaseFilter))
    );
  });

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

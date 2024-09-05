import React, { useContext, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";

const Bookings = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const {
    userDetails: { bookings = [] },
  } = useContext(UserDetailContext);

  // logging properties and bookings
  console.log(data);
  console.log(bookings);

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

  // Filter bookings based on name, city, or country fields
  const filteredBookings = bookings.filter((booking) =>
    [booking.name, booking.city, booking.country]
      .filter(Boolean) // Ensure the field is defined and not null
      .some((field) =>
        field.toLowerCase().includes(filter.toLowerCase())
      )
  );
  
  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {bookings.length > 0 ? (
            filteredBookings.length > 0 ? (
              filteredBookings.map((booking, i) => (
                <PropertyCard card={booking} key={i} />
              ))
            ) : (
              <span>No properties match the filter</span>
            )
          ) : (
            <span>No properties found</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;

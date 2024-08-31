// src/pages/Property/Property.jsx

import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { Button } from "@mantine/core"; // Import Mantine Button
import "./Property.css";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar, AiFillCheckCircle } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import Map from "../../components/Map/Map";
import useAuthCheck from "../../hooks/useAuthCheck";
import UserDetailContext from "../../context/UserDetailContext";
import Heart from "../../components/Heart/Heart";
import PaypalButton from "../../components/paypalButton";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Property = () => {
  const { t } = useTranslation("property"); // Initialize translation
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );

  const { validateLogin } = useAuthCheck();
  const { userDetails } = useContext(UserDetailContext);

  console.log("User email from context:", userDetails.email);

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <PuffLoader />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <span>{t('property.errors.fetch_details')}</span>
        </div>
      </div>
    );
  }

  // Function to get status icon based on property status
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <AiFillCheckCircle size={20} color="#1F3E72" />;
      case 'occupied':
        return <AiFillCheckCircle size={20} color="#FF0000" />;
      case 'under_contract':
        return <AiFillCheckCircle size={20} color="#FFA500" />;
        case 'for_sale':
          return <AiFillCheckCircle size={20} color="#FFA500" />;
      
      default:
        return <AiFillCheckCircle size={20} color="#1F3E72" />;
    }
  };

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        {/* Like button */}
        <div className="like">
          <Heart id={id} />
        </div>

        {/* Image */}
        <img src={data?.image[0]} alt="home image" />

        <div className="flexCenter property-details">
          {/* Left Side */}
          <div className="flexColStart left">
            {/* Header */}
            <div className="flexStart head">
              <span className="primaryText">{data?.name}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                $ {data?.regularPrice}
              </span>
            </div>

            {/* Facilities */}
            <div className="flexStart facilities">
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} {t('property.facilities.bathrooms')}</span>
              </div>
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities?.parkings} {t('property.facilities.parkings')}</span>
              </div>
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities?.bedrooms} {t('property.facilities.bedrooms')}</span>
              </div>
            </div>

            {/* Status */}
            <div className="flexStart facilities">
              <div className="flexStart facility">
                {getStatusIcon(data?.status)}
                <span className="secondaryText" style={{ textAlign: "justify" }}>
                  <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                    {t(`property.status.${data?.status.toLowerCase()}`)}
                  </span>
                </span>
              </div>
            </div>

            {/* Description */}
            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>

            {/* Location */}
            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data?.address} {data?.city} {data?.country}
              </span>
            </div>

            {/* Payment Button */}
            {validateLogin() ? (
              <PaypalButton
                amount={data?.regularPrice}
                userId={userDetails.email} // using email from userDetails
                propertyId={id}
                propertyType={data?.type}
              />
            ) : (
              <Button
                variant="filled"
                color="blue"
                style={{
                  width: '60%',
                  padding: '0.5rem', // Adjust padding for height
                  fontSize: '1rem', // Adjust font size
                }}
                onClick={() => console.log('Please log in to proceed')}
              >
                {t('property.buttons.pay')}
              </Button>
            )}
          </div>

          {/* Right Side - Map */}
          <div className="map">
            <Map address={data?.address} city={data?.city} country={data?.country} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;

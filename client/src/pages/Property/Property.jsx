import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getProperty, deleteProperty } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { Button, Slider } from "@mantine/core";
import "./Property.css";
import { FaShower, FaExpand } from "react-icons/fa";
import { AiTwotoneCar, AiFillCheckCircle } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import Map from "../../components/Map/Map";
import useAuthCheck from "../../hooks/useAuthCheck";
import UserDetailContext from "../../context/UserDetailContext";
import Heart from "../../components/Heart/Heart";
import PaypalButton from "../../components/paypalButton";
import { useTranslation } from 'react-i18next';
import EditPropertyForm from "../../components/EditPropertyForm/EditPropertyForm.jsx";
import MContact from "../../components/Contact/MContact.jsx";

const Property = () => {
  const { t } = useTranslation("property");
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { data, isLoading, isError } = useQuery(["resd", id], () => getProperty(id));
  
  const { validateLogin } = useAuthCheck();
  const { userDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (data?.image && data.image.length > 0) {
      const interval = setInterval(() => {
        setCurrentImage((prevImage) =>
          prevImage === data.image.length - 1 ? 0 : prevImage + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [data?.image]);

  const handleNext = () => {
    setCurrentImage((prevImage) =>
      prevImage === data?.image.length - 1 ? 0 : prevImage + 1
    );
  };

  const handlePrevious = () => {
    setCurrentImage((prevImage) =>
      prevImage === 0 ? data?.image.length - 1 : prevImage - 1
    );
  };

  const handleEdit = () => {
    // Set the initial data for the form and switch to the editing state
    setInitialData(data);
    setIsEditing(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(id, userDetails.token);
      navigate("/properties"); // Redirect to properties list after deletion
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

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

  const getStatusIcon = (status, state) => {
    if (!status && !state) return null;
    const statusOrState = status || state;
    switch (statusOrState) {
      case 'available':
      case 'UNOCCUPIED':
        return <AiFillCheckCircle size={20} color="#1F3E72" />;
      case 'occupied':
      case 'RENTED':
        return <AiFillCheckCircle size={20} color="#FF0000" />;
      case 'under_contract':
      case 'UNDER_MAINTENANCE':
      case 'for_sale':
      case 'UNDER_SALE':
        return <AiFillCheckCircle size={20} color="#FFA500" />;
      default:
        return <AiFillCheckCircle size={20} color="#1F3E72" />;
    }
  };

  // If in editing mode, show the edit form and pass the initial data
  if (isEditing) {
    return <EditPropertyForm propertyData={initialData} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        <div className="like">
          <Heart id={id} />
        </div>

        {data?.image && data.image.length > 0 ? (
          <>
            <img
              src={data.image[currentImage]}
              alt={`Property image ${currentImage + 1}`}
              style={{
                width: "100%",
                maxHeight: "35rem",
                borderRadius: "1rem",
                objectFit: "cover",
                marginBottom: "1rem",
              }}
            />

            <div className="image-controls">
              <Button onClick={handlePrevious} variant="default">
                Previous
              </Button>
              <Slider
                value={currentImage}
                onChange={setCurrentImage}
                marks={data.image.map((_, index) => ({ value: index }))}
                min={0}
                max={data.image.length - 1}
                step={1}
                label={(value) => `${value + 1} / ${data.image.length}`}
                style={{ flexGrow: 1, margin: '0 10px' }}
              />
              <Button onClick={handleNext} variant="default">
                Next
              </Button>
              {userDetails.email === data.userEmail && (
                <>
                  <Button
                    onClick={handleEdit}
                    variant="filled"
                    color="blue"
                    style={{ marginLeft: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="filled"
                    color="red"
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <span>No images available</span>
        )}

        <div className="flexCenter property-details">
          <div className="flexColStart left">
            <div className="flexStart head">
              <span className="primaryText">{data?.name}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                $ {data?.regularPrice || data?.maintenanceCharge}
              </span>
            </div>

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

            <div className="flexStart facilities">
              <div className="flexStart facility">
                {getStatusIcon(data?.status, data?.state)}
                <span className="secondaryText" style={{ textAlign: "justify" }}>
                  <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                    {data?.status ? t(`property.status.${data.status}`) : t(`${data?.state}`)}
                  </span>
                </span>
              </div>
              {data?.size && (
                <div className="flexStart facility">
                  <FaExpand size={20} color="#1F3E72" />
                  <span className="secondaryText" style={{ textAlign: "justify" }}>
                    {data.size} sqft
                  </span>
                </div>
              )}
            </div>

            <span className="secondaryText" style={{ textAlign: "justify" }}>
              {data?.description}
            </span>

            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className="secondaryText">
                {data?.address} {data?.city} {data?.country}
              </span>
            </div>

            {/* Conditionally render MContact if data.state is defined, else show PayPal/Pay buttons */}
            {data?.state ? (
              <MContact maintenance={data} />
            ) : validateLogin() ? (
              <PaypalButton
                amount={data?.regularPrice}
                userId={userDetails.email}
                propertyId={id}
                propertyType={data?.type}
              />
            ) : (
              <Button
                variant="filled"
                color="blue"
                style={{
                  width: '60%',
                  padding: '0.5rem',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                }}
                onClick={validateLogin}
              >               
               {t("property.buttons.pay")}
              </Button>
            )}
          </div>
          <div className="right">
            <Map data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;

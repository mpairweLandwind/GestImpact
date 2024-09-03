import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getProperty, deleteProperty } from "../../utils/api";
import { PuffLoader } from "react-spinners";
import { Button, Slider } from "@mantine/core";
import "./Property.css";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar, AiFillCheckCircle } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import Map from "../../components/Map/Map";
import useAuthCheck from "../../hooks/useAuthCheck";
import UserDetailContext from "../../context/UserDetailContext";
import Heart from "../../components/Heart/Heart";
import PaypalButton from "../../components/paypalButton";
import { useTranslation } from 'react-i18next';
import EditPropertyForm from "../../components/EditPropertyForm/EditPropertyForm.jsx";

const Property = () => {
  const { t } = useTranslation("property");
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];
  const { data, isLoading, isError } = useQuery(["resd", id], () =>
    getProperty(id)
  );

  const { validateLogin } = useAuthCheck();
  const { userDetails } = useContext(UserDetailContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const [currentImage, setCurrentImage] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // State for toggling edit mode

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) =>
        prevImage === data?.image.length - 1 ? 0 : prevImage + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [data?.image.length]);

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
    navigate(`/properties/${id}/edit`); // Navigate to the edit route
  };


  const handleDelete = async () => {
    try {
      await deleteProperty(id, userDetails.token);
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

  if (isEditing) {
    return <EditPropertyForm propertyData={data} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="wrapper">
      <div className="flexColStart paddings innerWidth property-container">
        <div className="like">
          <Heart id={id} />
        </div>

        {data && data.image && (
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
        )}

        <div className="flexCenter property-details">
          <div className="flexColStart left">
            <div className="flexStart head">
              <span className="primaryText">{data?.name}</span>
              <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                $ {data?.regularPrice}
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
              {getStatusIcon(data?.status)}
                <span className="secondaryText" style={{ textAlign: "justify" }}>
                  <span className="orangeText" style={{ fontSize: "1.5rem" }}>
                    {t(`property.status.${data?.status.toLowerCase()}`)}
                  </span>
                </span>
              </div>
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

            {validateLogin() ? (
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
                  fontSize: '1rem',
                }}
                onClick={() => console.log('Please log in to proceed')}
              >
                {t('property.buttons.pay')}
              </Button>
            )}
          </div>

          <div className="map">
            <Map address={data?.address} city={data?.city} country={data?.country} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;

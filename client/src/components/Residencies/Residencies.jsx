import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSwiper } from 'swiper/react';

// Import Swiper styles
import "swiper/css";
import "./Residencies.css";
import { sliderSettings } from "../../utils/common";
import PropertyCard from "../PropertyCard/PropertyCard";
import useProperties from "../../hooks/useProperties";
import {PuffLoader} from 'react-spinners'

const Residencies = ({ t }) => {
  const { data, isError, isLoading } = useProperties();

  if (isError) {
    return (
      <div className="wrapper">
        <span>{t('error')}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader height="80" width="80" radius={1} color="#4066ff" aria-label="puff-loading" />
      </div>
    );
  }

  // Extract listings and maintenanceRecords from the data object
  const listings = data.listings || [];
  const maintenanceRecords = data.maintenanceRecords || [];

  // Combine listings and maintenanceRecords into a single array
  const combinedData = [...listings, ...maintenanceRecords];

  return (
    <div id="residencies" className="r-wrapper">
      <div className="paddings innerWidth r-container">
        <div className="flexColStart r-head">
          <span className="orangeText">{t('home.residencies.best_choices')}</span>
          <span className="primaryText">{t('home.residencies.popular_residencies')}</span>
        </div>
        <Swiper {...sliderSettings}>
          <SlideNextButton />
          {/* slider */}
          {combinedData.slice(0, 8).map((card, i) => (
            <SwiperSlide key={i}>
              <PropertyCard card={card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};


export default Residencies;

const SlideNextButton = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter r-buttons">
      <button onClick={() => swiper.slidePrev()} className="r-prevButton">
        &lt;
      </button>
      <button onClick={() => swiper.slideNext()} className="r-nextButton">
        &gt;
      </button>
    </div>
  );
};

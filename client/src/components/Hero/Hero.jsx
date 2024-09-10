import React, { useState } from "react";
import "./Hero.css";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation("hero");

  const handleSearchClick = () => {
    // Trigger navigation to properties page when search is clicked
    navigate('/properties');
  };

  return (
    <section className="hero-wrapper">
      <div className="paddings innerWidth flexCenter hero-container">
        {/* left side */}
        <div className="flexColStart hero-left">
          <div className="hero-title">
            <div className="orange-circle" />
            <motion.h1
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 3 }}
              transition={{
                duration: 2,
                type: "ease-in",
              }}
            >
 {t('hero.explore')}<br />
{t('hero.properties')}<br /> {t('hero.and')} <br />
{t('hero.premier')} <br />

            </motion.h1>
          </div>
          <div className="flexColStart secondaryText flexhero-des">
            <span>{t('hero.find_variety')}</span>
            <span>{t('hero.forget_difficulties')}</span>
          </div>

         {/* Wrap SearchBar with click handler for navigation */}
         <div
            style={{ cursor: 'pointer' }}
            className="searchbar"
            onClick={handleSearchClick}
          >
            <SearchBar filter={filter} setFilter={setFilter} />
          </div>


          <div className="flexCenter stats">
            <div className="flexColCenter stat">
              <span>
                <CountUp start={8800} end={9000} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">{t('hero.premium_product')}</span>
            </div>

            <div className="flexColCenter stat">
              <span>
                <CountUp start={1950} end={2000} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">{t('hero.happy_customer')}</span>
            </div>

            <div className="flexColCenter stat">
              <span>
                <CountUp end={28} /> <span>+</span>
              </span>
              <span className="secondaryText">{t('hero.awards_winning')}</span>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flexCenter hero-right">
          <motion.div
            initial={{ x: "7rem", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 2,
              type: "ease-in",
            }}
            className="image-container"
          >
            <img src="./bg3.png" alt={t('hero.houses_alt')} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};



export default Hero;

import React, { useRef } from 'react';
import Companies from "../components/Companies/Companies";
import Contact from "../components/Contact/Contact";
import GetStarted from "../components/GetStarted/GetStarted";
import Hero from "../components/Hero/Hero";
import Residencies from "../components/Residencies/Residencies";
import Value from "../components/Value/Value";
import { useTranslation } from "react-i18next";



const Website = () => {
  const { t } = useTranslation(["home"]);
  const contactRef = useRef(null);
  return (
    <div className="App">
    <div>
      <div className="white-gradient" />
      <Hero />
    </div>
    <Companies t={t} />
    <Residencies t={t} />
    <Value t={t} />
    <Contact t={t} contactRef={contactRef} />
    <GetStarted t={t} />
  </div>
  )
}

export default Website
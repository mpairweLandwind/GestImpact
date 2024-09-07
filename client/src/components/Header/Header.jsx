import { useState, useEffect, useContext } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OutsideClickHandler from "react-outside-click-handler";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AddPropertyModal from "../AddPropertyModal/AddPropertyModal";
import AddMaintenanceModal from "../AddMaintenanceModal/AddMaintenanceModal";
import useHeaderColor from "../../hooks/useHeaderColor";
import { getMenuStyles } from "../../utils/common";
import { logout } from "../../utils/api";
import i18next from "i18next";
import "./Header.css";
import UserDetailContext from "../../context/UserDetailContext"; // Import the context


const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [propertyModalOpened, setPropertyModalOpened] = useState(false);
  const [maintenanceModalOpened, setMaintenanceModalOpened] = useState(false);
  const headerColor = useHeaderColor();
  const { i18n, t } = useTranslation(["common"]); // Translation hook
  const navigate = useNavigate(); // Hook for navigating routes

  // Access user details and authentication state from the context
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const isAuthenticated = !!userDetails.token;
  const user = {
    email: userDetails.email,
    image: userDetails.image,
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage && savedLanguage.length > 2) {
      i18next.changeLanguage("en");
    }

    // Check if the user is already authenticated from localStorage
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const image = localStorage.getItem("userImage");

    if (token) {
      // Update the userDetails in the context
      setUserDetails({
        token,
        email,
        image,
      });
    }
  }, [setUserDetails]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("i18nextLng", newLanguage);
  };

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      setPropertyModalOpened(true);
    } else {
      navigate("/sign-in");
    }
  };

  const handleAddMaintenanceClick = () => {
    if (isAuthenticated) {
      setMaintenanceModalOpened(true);
    } else {
      navigate("/sign-in");
      //navigate("/sign-in");
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout function from util.api.js
      await logout();

      // Clear user details in the context and localStorage
      setUserDetails({
        favourites: [],
        bookings: [],
        token: null,
        email: "",
      });

      // Navigate to the sign-in page
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Scroll to the Contact section
  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contact-us");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* Logo */}
        <Link to="/">
          <img src="./logo.png" alt="logo" width={100} />
        </Link>

        {/* Menu */}
        <OutsideClickHandler onOutsideClick={() => setMenuOpened(false)}>
          <div className="flexCenter h-menu" style={getMenuStyles(menuOpened)}>
            <NavLink to="/properties">{t("Properties")}</NavLink>
           {/* Link for Contact Us */}
           <div onClick={handleScrollToContact} className="menu-link">
              {t("Contact Us")}
            </div>

            {/* Add Maintenance */}
            <div onClick={handleAddMaintenanceClick}>{t("Maintenance")}</div>
            <AddMaintenanceModal opened={maintenanceModalOpened} setOpened={setMaintenanceModalOpened} />

            {/* Add Property */}
            <div onClick={handleAddPropertyClick}>{t("Add Property")}</div>
            <AddPropertyModal opened={propertyModalOpened} setOpened={setPropertyModalOpened} />

            {/* Language Translation */}
            <select
              className="nav-link bg-white border-0 ml-1 mr-2"
              value={localStorage.getItem("i18nextLng") || "en"}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>

            {/* Login/Logout Button */}
            {!isAuthenticated ? (
              <button className="button" onClick={() => navigate("/sign-in")}>
                {t("Login")}
              </button>
            ) : (
              <ProfileMenu user={user} logout={handleLogout} /> // Pass the user to ProfileMenu
            )}
          </div>
        </OutsideClickHandler>

        {/* Menu Icon for Smaller Screens */}
        <div className="menu-icon" onClick={() => setMenuOpened((prev) => !prev)}>
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  );
};

export default Header;

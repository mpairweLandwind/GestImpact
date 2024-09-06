import { useState, useEffect } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AddPropertyModal from "../AddPropertyModal/AddPropertyModal";
import AddMaintenanceModal from "../AddMaintenanceModal/AddMaintenanceModal";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import "./Header.css";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [propertyModalOpened, setPropertyModalOpened] = useState(false);
  const [maintenanceModalOpened, setMaintenanceModalOpened] = useState(false);
  const headerColor = useHeaderColor();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { i18n, t } = useTranslation(["common"]);
  const navigate = useNavigate(); // Hook for navigating routes

  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage && savedLanguage.length > 2) {
      i18next.changeLanguage("en");
    }

    // Check if the user is already authenticated (e.g., token exists)
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }
  }, []);

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
    }
  };

  // Custom login function
  const login = async (credentials) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token and user in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        navigate("/"); // Redirect to homepage after login
      } else {
        console.error("Login failed.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/sign-in"); // Redirect to login page after logout
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
            <a href="mailto:alienyuyen@gmail.com">{t("Contact Us")} </a>

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
              <ProfileMenu user={user} logout={logout} />
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

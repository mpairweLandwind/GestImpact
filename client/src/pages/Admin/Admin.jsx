import { useContext, useEffect } from "react";
import "./admin.scss";
import { ThemeContext } from "../../context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../../constants/themeConstants";
import { Routes, Route } from "react-router-dom";
import MoonIcon from "../../assets/icons/moon.svg";
import SunIcon from "../../assets/icons/sun.svg";
import BaseLayout from "../../layout/BaseLayout";
import Dashboard from "../../screens/dashboard/DashboardScreen";
import PageNotFound from "../../screens/error/PageNotFound";
import Transactions from "../../screens/dashboard/Transactions";
import Payments from "../../screens/dashboard/Payments";
import ECustomers from "../../screens/dashboard/ECustomers";
import MCustomers from "../../screens/dashboard/MCustomers";

const Admin = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <div className="admin">
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="payments" element={<Payments />} />
          <Route path="MaintenanceCustomers" element={<MCustomers />} />
          <Route path="EstateCustomers" element={<ECustomers />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>

      <button className="theme-toggle-btn" onClick={toggleTheme}>
        <img
          className="theme-icon"
          src={theme === LIGHT_THEME ? MoonIcon : SunIcon}
          alt="theme icon"
        />
      </button>
    </div>
  );
};

export default Admin;

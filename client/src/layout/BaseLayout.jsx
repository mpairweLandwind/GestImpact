import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/Header/Header";
//import "./BaseLayout.css"; // Import your CSS file
import { ThemeProvider } from "../context/ThemeContext";

const BaseLayout = () => {
  return (
    <ThemeProvider>
      {/* Fixed header */}
      <Header /> 
   
     
      <main className="page-wrapper">
        {/* Sidebar and content area */}
        <Sidebar />
        <div className="content-wrapper">
      
          <Outlet />
        </div>
      </main>
    </ThemeProvider>
  );
};

export default BaseLayout;

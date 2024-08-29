

import AreaTop from "../../components/dashboard/areaTop/AreaTop";
import AreaTable from "../../components/dashboard/areaTable/AreaTable";

import './dashboard.scss'
const Customers = () => {
  return (
    <div className="content-area">
      <AreaTop />     
      <AreaTable />
    
    </div>
  );
};

export default Customers;

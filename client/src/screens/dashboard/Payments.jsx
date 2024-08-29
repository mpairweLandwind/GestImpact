
import AreaCards from "../../components/dashboard/areaCards/AreaCards";
import AreaTop from "../../components/dashboard/areaTop/AreaTop";
import AreaTableP from "../../components/dashboard/areaTable/AreaTableP";
import './dashboard.scss'
const Payments = () => {
  return (
    <div className="content-area">
      <AreaTop />
      <AreaCards />
     <AreaTableP />
    
    </div>
  );
};

export default Payments;

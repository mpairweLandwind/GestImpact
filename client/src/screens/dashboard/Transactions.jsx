
import AreaCards from "../../components/dashboard/areaCards/AreaCards";
import AreaTop from "../../components/dashboard/areaTop/AreaTop";
import AreaTableT from "../../components/dashboard/areaTable/AreaTableT";
import AreaCharts from "../../components/dashboard/areaCharts/AreaCharts";
import './dashboard.scss'
const Transactions = () => {
  return (
    <div className="content-area">
      <AreaTop />
      <AreaCards />
      <AreaTableT />
    
    </div>
  );
};

export default Transactions;

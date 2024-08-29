import { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import axios from "axios";

const AreaCards = () => {
  const [salesData, setSalesData] = useState({
    monthlySales: { amount: 0, count: 0 },
    halfYearSales: { amount: 0, count: 0 },
    yearlySales: { amount: 0, count: 0 },
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/transactions/salesdata");
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const calculatePercentFill = (amount) => {
    // Placeholder calculation logic, adjust as needed
    return Math.min((amount / 25000) * 100, 100);
  };

  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={calculatePercentFill(salesData.monthlySales.amount)}
        cardInfo={{
          title: "Monthly Income",
          value: `$${salesData.monthlySales.amount.toLocaleString()}`,
          text: `${salesData.monthlySales.count} sales`,
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={calculatePercentFill(salesData.halfYearSales.amount)}
        cardInfo={{
          title: "6 Months Revenue",
          value: `$${salesData.halfYearSales.amount.toLocaleString()}`,
          text: `${salesData.halfYearSales.count} sales`,
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={calculatePercentFill(salesData.yearlySales.amount)}
        cardInfo={{
          title: "Annual Income",
          value: `$${salesData.yearlySales.amount.toLocaleString()}`,
          text: `${salesData.yearlySales.count} sales`,
        }}
      />
    </section>
  );
};

export default AreaCards;

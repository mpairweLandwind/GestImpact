import { useState, useEffect } from 'react';
import axios from 'axios';
import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Property Name",
  "City",
  "Address",
  "Owner Email",
  "Client Email", 
  "Regular Price", 
  "Paid Price", 
  "Action",
];

const fetchData = async (setter) => {
  try {
    const response = await axios.get('http://localhost:3000/api/paypal/transactions');
    setter(response.data.transactions); // Adjusted to match the expected data structure
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    setter([]);
  }
};

const AreaTableT = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData(setTransactions);
  }, []);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Transactions Management</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.listing?.name || "N/A"}</td>
                <td>{transaction.listing?.city || "Not specified"}</td>
                <td>{transaction.listing?.address || "N/A"}</td>
                <td>{transaction.listing?.userEmail || "N/A"}</td>
                <td>{transaction.userId}</td>
                <td>${transaction.listing?.regularPrice?.toFixed(2) || "0.00"}</td> 
                <td>${transaction.amount.toFixed(2)}</td>               
                <td className="dt-cell-action">
                  <AreaTableAction transactionId={transaction.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTableT;

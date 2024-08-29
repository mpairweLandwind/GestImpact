import { useState, useEffect } from 'react';
import axios from 'axios';
import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Maintenance Name",
  "City",
  "Address",
  "Condition",
  "Estimated Value",
  "Maintenance Charge",
  "Owner Email",
  "Action",
];

const fetchData = async (setter) => {
  try {
    const response = await axios.get('http://localhost:3000/api/maintenance/allmaintenance');
    setter(response.data.maintenanceRecords);
  } catch (error) {
    console.error("Failed to fetch maintenance data:", error);
    setter([]);
  }
};

const AreaTableM = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  useEffect(() => {
    fetchData(setMaintenanceRecords);
  }, []);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Maintenance Management</h4>
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
            {maintenanceRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.name}</td>
                <td>{record.city || "Not specified"}</td>
                <td>{record.address}</td>
                <td>{record.condition}</td>
                <td>${record.estimatedValue?.toFixed(2) || "N/A"}</td>
                <td>${record.maintenanceCharge.toFixed(2)}</td>
                <td>{record.userEmail}</td>
                <td className="dt-cell-action">
                  <AreaTableAction maintenanceId={record.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTableM;

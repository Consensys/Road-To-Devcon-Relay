import React, { useState } from "react";
import "./Dashboard.css";

function DashboardCard({ children }) {
  return (
    <div className="dashboard-card w-100 d-flex flex-column p-4 mb-4">
      <div className="mt-2 dash-content">
        <div className="d-flex flex-column">{children}</div>
      </div>
    </div>
  );
}

export default DashboardCard;

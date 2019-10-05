import React from "react";
import "./Dashboard.css";

function DashboardItem({ title, value }) {
  return (
    <div className="d-flex flex-column mx-1 dash-item">
      <div className="info-title">{title}</div>
      <div className="info-value">{value}</div>
    </div>
  );
}

export default DashboardItem;

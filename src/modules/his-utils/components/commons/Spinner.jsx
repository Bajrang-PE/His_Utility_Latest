import React from "react";
import { Spinner } from "react-bootstrap";

const SpinLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="custom-loader">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default SpinLoader;

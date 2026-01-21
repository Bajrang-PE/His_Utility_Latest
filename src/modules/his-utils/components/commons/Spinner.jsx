import React from "react";
import { Spinner } from "react-bootstrap";

const SpinLoader = ({ message }) => {
  return (
    <div className="loader-overlay">
      <div className="custom-loader">
        <Spinner animation="border" variant="primary" />
        <p>{message ? message : "Loading..."}</p>
      </div>
    </div>
  );
};

export default SpinLoader;

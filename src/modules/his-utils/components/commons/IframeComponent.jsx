import React, { useState } from "react";

const IframeComponent = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <iframe
        src={url}
        title="iframe-viewer"
        width="100%"
        height="600px"
        style={{ border: "none", visibility: isLoading ? "hidden" : "visible" }}
        onLoad={() => setIsLoading(false)}
      />

      {isLoading && (
        <div
         style={{
          position: "block",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          backgroundColor: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          fontWeight: "bold",
        }}>
          Loading...
        </div>
      )}
    </>
  );
};

export default IframeComponent;

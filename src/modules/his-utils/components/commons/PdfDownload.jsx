import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const PdfDownload = ({ docJsonString }) => {
  const [pdfFiles, setPdfFiles] = useState([]);

  useEffect(() => {
    if (docJsonString) {
      try {
        const parsedData = JSON.parse(docJsonString);
        setPdfFiles(parsedData);
      } catch (error) {
        console.error("Error parsing docJsonString:", error);
      }
    }
  }, [docJsonString]);

  const downloadPdf = (pdf) => {
    const fileUrl = `/path-to-pdfs/${pdf.fileNameForManualDocument}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${pdf.downloadFileNameForManualDocument}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dropdown">
      {pdfFiles.length === 1 ? (
        <button
          type="button"
          className="small-box-btn-dwn"
          onClick={() => downloadPdf(pdfFiles[0])}
        >
          <FontAwesomeIcon icon={faFile} className="dropdown-gear-icon me-2" />
          HelpDocs
        </button>
      ) : (
        <>
          <button
            type="button"
            className="small-box-btn-dwn"
            aria-expanded="false"
            data-bs-toggle="dropdown"
          >
            <FontAwesomeIcon icon={faFile} className="dropdown-gear-icon me-2" />
            HelpDocs
          </button>
          <ul className="dropdown-menu p-2">
            {pdfFiles.map((pdf, index) => (
              <li
                key={index}
                className="p-1 dropdown-item text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => downloadPdf(pdf)}
              >
                <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon me-2" />
                {pdf.displayNameForManualDocument}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PdfDownload;

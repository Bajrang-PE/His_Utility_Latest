import React, { useEffect, useState } from "react";
import InputField from "../../commons/InputField";
import InputSelect from "../../commons/InputSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const HelpDocs = (props) => {

  const { values, setValues, errors, setErrors, dt } = props;

  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({ fileNameForManualDocument: "", displayNameForManualDocument: "", downloadFileNameForManualDocument: "" });
  const [isEditing, setIsEditing] = useState(null);

  const handleInputChange = (field, value) => {
    const err = field + 'Err'
    setNewRow({ ...newRow, [field]: value });
    setErrors(prev => ({ ...prev, [err]: "" }));
  };

  useEffect(() => {
    if (values?.helpDocs?.length > 0) {
      setRows(values?.helpDocs)
    }
  }, [values?.helpDocs])


  const handleAddRow = () => {
    if (!newRow?.fileNameForManualDocument?.trim() || !newRow?.displayNameForManualDocument?.trim()) {
      if (!newRow?.fileNameForManualDocument?.trim()) {
        setErrors(prev => ({ ...prev, 'fileNameForManualDocumentErr': "required" }));
      } else {
        setErrors(prev => ({ ...prev, 'displayNameForManualDocumentErr': "required" }));
      }
    } else {
      if (isEditing !== null) {
        const updatedRows = [...rows];
        updatedRows[isEditing] = newRow;
        setRows(updatedRows);
        setValues({ ...values, ['helpDocs']: updatedRows })
        setIsEditing(null);
      } else {
        let oldDt = values?.helpDocs?.length > 0 ? values?.helpDocs : [];
        setRows([...rows, newRow]);
        oldDt?.push(newRow)
        setValues({ ...values, ['helpDocs']: oldDt })
      }
      setNewRow({ fileNameForManualDocument: "", displayNameForManualDocument: "", downloadFileNameForManualDocument: "" });
      setErrors(prev => ({ ...prev, 'displayNameForManualDocumentErr': "", 'fileNameForManualDocumentErr': "" }));
    }
  };

  const handleEditRow = (index) => {
    setIsEditing(index);
    setNewRow(rows[index]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    setValues({ ...values, ['helpDocs']: updatedRows })
  };

  return (
    <div>
      <b>
        <h6 className="header-devider my-1">{dt("Attach Help Docs")}</h6>
      </b>

      {/* SECTION DIVIDER */}
      <div className="table-responsive row my-1 mx-0">
        <table className="table table-borderless mb-0">
          <thead className="text-white">
            <tr className="table-row-form">
              <th className="p-0" style={{ width: "25%", fontSize: "smaller" }}>
                {dt("Help Doc. File Name")}
              </th>
              <th className="p-0" style={{ width: "25%", fontSize: "smaller" }}>
                {dt("Display Name For Manual Document")}
              </th>
              <th className="p-0" style={{ width: "25%", fontSize: "smaller" }}>
                {dt("Download File Name")}
              </th>
              <th className="p-0"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <InputSelect
                  className="backcolorinput"
                  name="fileNameForManualDocument"
                  id="fileNameForManualDocument"
                  placeholder={dt("Select File")}
                  options={[{ value: 1, label: "pdf file" }]}
                  onChange={(e) => handleInputChange("fileNameForManualDocument", e.target.value)}
                  value={newRow.fileNameForManualDocument}
                  errorMessage={errors?.fileNameForManualDocumentErr}
                />
              </td>
              <td>
                <InputField
                  type="text"
                  className="backcolorinput"
                  name="displayNameForManualDocument"
                  id="displayNameForManualDocument"
                  onChange={(e) => handleInputChange("displayNameForManualDocument", e.target.value)}
                  value={newRow.displayNameForManualDocument}
                  errorMessage={errors?.displayNameForManualDocumentErr}
                />
              </td>
              <td>
                <InputField
                  type="text"
                  className="backcolorinput"
                  name="downloadFileNameForManualDocument"
                  id="downloadFileNameForManualDocument"
                  onChange={(e) => handleInputChange("downloadFileNameForManualDocument", e.target.value)}
                  value={newRow.downloadFileNameForManualDocument}
                />
              </td>
              <td className="px-0 action-buttons text-center">
                <button
                  className="btn btn-sm me-1 py-0 px-0"
                  style={{ background: "#34495e", color: "white" }}
                  onClick={() => handleAddRow()}
                >
                  <FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size="sm" />{" "}
                  {isEditing !== null ? dt("Save") : dt("Add")}
                </button>
              </td>
            </tr>
            {rows.map((row, index) => (
              <tr className="table-row-form text-start" key={index}>
                <td>{row.fileNameForManualDocument || "---"}</td>
                <td>{row.displayNameForManualDocument || "---"}</td>
                <td>{row.downloadFileNameForManualDocument || "---"}</td>
                <td className="">
                  <div className="text-center">
                    <button
                      className="btn btn-outline-secondary btn-sm me-1 py-0 px-1"
                      onClick={() => handleEditRow(index)}
                    >
                      {dt("Edit")}
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm ms-1 py-0 px-1"
                      onClick={() => handleRemoveRow(index)}
                    >
                      {dt("Delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default HelpDocs;

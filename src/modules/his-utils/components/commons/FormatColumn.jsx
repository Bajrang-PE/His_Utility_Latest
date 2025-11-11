import React, { useContext, useEffect, useState } from 'react';
import { HISContext } from '../../contextApi/HISContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faMinus } from '@fortawesome/free-solid-svg-icons';
import InputField from './InputField';
import InputSelect from './InputSelect';
import { Modal } from 'react-bootstrap';
import { ToastAlert } from '../../utils/commonFunction';

const FormatColumn = (props) => {
    const { showDataTable, setShowDataTable, dt } = useContext(HISContext);
    const { title, onClose, values, setValues, tableIndex } = props;

    const [rows, setRows] = useState([
        { columnNo: 1, columnForReport: "", columnAlignment: "", columnWidth: "" }
    ]);

    const [totalWidth, setTotalWidth] = useState(0);

    useEffect(() => {
        const existingData = values?.mpFormatColumn?.[tableIndex]?.lstFormatColumn || [];
        if (existingData.length > 0) {
            const updated = existingData.map((item, index) => ({
                columnNo: item?.columnNo || index + 1,
                columnForReport: item?.columnForReport || "",
                columnAlignment: item?.columnAlignment || "",
                columnWidth: item?.columnWidth || ""
            }));
            setRows(updated);
            calculateWidthFromRows(updated);
        }
    }, [values?.mpFormatColumn, tableIndex]);

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
        calculateWidthFromRows(updatedRows);
    };

    const handleAddRow = () => {
        const newRow = {
            columnNo: rows.length + 1,
            columnForReport: "",
            columnAlignment: "",
            columnWidth: ""
        };
        setRows([...rows, newRow]);
    };

    const handleRemoveRow = (index) => {
        if (rows.length > 1) {
            const updatedRows = rows
                .filter((_, i) => i !== index)
                .map((r, i) => ({ ...r, columnNo: i + 1 }));
            setRows(updatedRows);
            calculateWidthFromRows(updatedRows);
        } else {
            ToastAlert("One row must be there!", "warning");
        }
    };

    const handleClose = () => {
        setShowDataTable(false);
        onClose();
        setTotalWidth(0);
    };

    const onSaveSession = () => {
        const formattedRows = rows.map((row, index) => ({
            columnNo: String(index + 1),
            columnForReport: row.columnForReport,
            columnAlignment: row.columnAlignment,
            columnWidth: row.columnWidth
        }));

        // Preserve existing data for all tables
        const updatedFormatColumn = {
            ...(values?.mpFormatColumn || {}),
            [tableIndex]: {
                lstFormatColumn: formattedRows
            }
        };

        setValues({
            ...values,
            mpFormatColumn: updatedFormatColumn
        });

        onClose();
    };

    const calculateWidthFromRows = (rowsData) => {
        const width = rowsData?.reduce((sum, row) => {
            const val = parseInt(row?.columnWidth || 0);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);
        setTotalWidth(width);
    };

    const alignmentOptions = [
        { value: "Left", label: "Left" },
        { value: "Center", label: "Center" },
        { value: "Right", label: "Right" }
    ];


    return (
        <div>
            <Modal show={showDataTable} onHide={handleClose} size='xl'>
                <Modal.Header closeButton className='p-2'></Modal.Header>
                <b><h6 className='datatable-header mx-3 py-1 mt-1 px-1'>{dt(title)}</h6></b>
                <Modal.Body className='px-3 pb-3 pt-0'>
                    <div className="table-responsive" style={{ maxHeight: "65vh" }}>
                        <table className="table text-center mb-0 table-bordered">
                            <thead className="text-white">
                                <tr className='m-0' style={{ fontSize: "smaller" }}>
                                    <th style={{ width: "15%" }}>{dt('Displayed Column No.')}</th>
                                    <th style={{ width: "20%" }}>{dt('Column Viewed In')}</th>
                                    <th style={{ width: "20%" }}>{dt('columnAlignment')}</th>
                                    <th style={{ width: "20%" }}>{dt('Column Width(in Percentage)')}</th>
                                    <th style={{ width: "10%" }}>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={handleAddRow}
                                            style={{ padding: "0 4px" }}
                                        >
                                            <FontAwesomeIcon icon={faAdd} size='sm' />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <InputField
                                                type="text"
                                                className="backcolorinput m-auto w-50"
                                                name='columnNo'
                                                value={index + 1}
                                                readOnly={true}
                                            />
                                        </td>
                                        <td>
                                            <InputSelect
                                                id={`columnForReport-${index}`}
                                                name="columnForReport"
                                                placeholder="Select..."
                                                options={[{ value: "tabularReport", label: "Tabular Report Only" }]}
                                                className="backcolorinput"
                                                value={row.columnForReport}
                                                onChange={(e) => handleInputChange(index, 'columnForReport', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <InputSelect
                                                id={`columnAlignment-${index}`}
                                                name="columnAlignment"
                                                placeholder="Select..."
                                                options={alignmentOptions}
                                                className="backcolorinput"
                                                value={row.columnAlignment}
                                                onChange={(e) => handleInputChange(index, 'columnAlignment', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="number"
                                                className="backcolorinput m-auto w-50"
                                                name='columnWidth'
                                                value={row.columnWidth}
                                                onChange={(e) => handleInputChange(index, "columnWidth", e.target.value)}
                                            />
                                        </td>
                                        <td className='px-0'>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => handleRemoveRow(index)}
                                                style={{ padding: "0 4px" }}
                                            >
                                                <FontAwesomeIcon icon={faMinus} size='sm' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <b><h6 className='header-devider mt-2'></h6></b> <div className="d-flex justify-content-center align-items-center mb-1">
                            <label className="col-form-label me-2 ">{dt('Total Of Width')} :</label> <div className=''>
                                <InputField type="text" id="totalWidth" name="totalWidth"
                                    placeholder="Enter"
                                    className="backcolorinput "
                                    onChange={null}
                                    value={totalWidth}
                                    readOnly={true} />
                            </div> <div className='pre-nxt-btn '>
                                <button className='btn btn-sm ms-2 mt-sm-0' onClick={() => onSaveSession()} > {dt('OK')} </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default FormatColumn;

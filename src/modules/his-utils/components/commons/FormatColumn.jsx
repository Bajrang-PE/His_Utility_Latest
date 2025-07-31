import React, { useContext, useState } from 'react'
import { HISContext } from '../../contextApi/HISContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faMinus } from '@fortawesome/free-solid-svg-icons';
import InputField from './InputField';
import InputSelect from './InputSelect';
import { Modal } from 'react-bootstrap';
import { ToastAlert } from '../../utils/commonFunction';

const FormatColumn = (props) => {
    const { showDataTable, setShowDataTable,dt } = useContext(HISContext);
    const { title, onClose } = props;

    const [rows, setRows] = useState([{ displayedClmNo: "", clmViewedIn: "", alignment: "", clmWidth: "" }]);

    const [totalWidth, setTotalWidth] = useState()

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    // Add a new row
    const handleAddRow = () => {
        setRows([...rows, { displayedClmNo: "", clmViewedIn: "", alignment: "", clmWidth: "" }]);
    };

    // Remove a row
    const handleRemoveRow = (index) => {
        if (rows?.length > 1) {
            const updatedRows = rows.filter((_, i) => i !== index);
            setRows(updatedRows);
            calculateWidth(index);
        } else {
            ToastAlert('One row must be there!', 'warning')
        }
    };

    const handleClose = () => {
        setShowDataTable(false);
        onClose();
        setTotalWidth(0);
    }

    const onSaveSession = () => {
        alert('not handled yet')
    }

    const calculateWidth = (index) => {
        if (index || index === 0) {
            let currentWidth = totalWidth;
            currentWidth -= parseInt(rows[index]?.clmWidth !== '' ? rows[index]?.clmWidth : 0);
            setTotalWidth(currentWidth)
        } else {
            let width = 0;
            for (let i = 0; i < rows?.length; i++) {
                width += parseInt(rows[i]?.clmWidth !== '' ? rows[i]?.clmWidth : 0)
            }
            setTotalWidth(width);
        }
    }

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
                                    <th style={{ width: "15%" }}>
                                        <span className='required-label'>
                                            {dt('Displayed Column No.')}
                                        </span>
                                    </th>
                                    <th style={{ width: "20%" }}>
                                        <span className='required-label'>
                                            {dt('Column Viewed In')}
                                        </span>
                                    </th>
                                    <th style={{ width: "20%" }}>
                                        <span className='required-label'>
                                            {dt('Alignment')}
                                        </span>
                                    </th>
                                    <th style={{ width: "20%" }}>
                                        <span className='required-label'>
                                            {dt('Column Width(in Percentage)')}
                                        </span>
                                    </th>
                                    <th style={{ width: "10%" }}>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={()=>handleAddRow()}
                                            style={{ padding: "0 4px" }}
                                        >
                                            <FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size='sm' />
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
                                                name='displayedClmNo'
                                                id='displayedClmNo'
                                                value={index + 1}
                                                onChange={(e) => handleInputChange(index, "displayedClmNo", e.target.value)}
                                                readOnly={true}
                                            />
                                        </td>
                                        <td>
                                            <InputSelect
                                                id={`clmViewedIn-${index}`}
                                                name="clmViewedIn"
                                                placeholder="Select widget..."
                                                options={[{ value: 1, label: "Widget" }]}
                                                className="backcolorinput"
                                                value={row.clmViewedIn}
                                                onChange={(e) => handleInputChange(index, 'clmViewedIn', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <InputSelect
                                                id={`alignment-${index}`}
                                                name="alignment"
                                                placeholder="Select widget..."
                                                options={[{ value: 1, label: "right" }]}
                                                className="backcolorinput"
                                                value={row.alignment}
                                                onChange={(e) => handleInputChange(index, 'alignment', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="number"
                                                className="backcolorinput m-auto w-50"
                                                name='clmWidth'
                                                id='clmWidth'
                                                value={row?.clmWidth}
                                                onChange={(e) => { handleInputChange(index, "clmWidth", e.target.value); calculateWidth(); }}
                                            />
                                        </td>
                                        <td className='px-0'>
                                            {rows.length > 0 && (
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => { handleRemoveRow(index); }}
                                                    style={{ padding: "0 4px" }}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} className="dropdown-gear-icon" size='sm' />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <b><h6 className='header-devider mt-2'></h6></b>
                        <div className="d-flex justify-content-center align-items-center mb-1">
                            <label className="col-form-label me-2 ">{dt('Total Of Width')} :</label>
                            <div className=''>
                                <InputField
                                    type="text"
                                    id="totalWidth"
                                    name="totalWidth"
                                    // placeholder="Enter"
                                    className="backcolorinput "
                                    onChange={null}
                                    value={totalWidth}
                                    readOnly={true}
                                />
                            </div>
                            <div className='pre-nxt-btn '>
                                <button className='btn btn-sm ms-2 mt-sm-0'
                                    onClick={()=>onSaveSession()}
                                >
                                    {dt('OK')}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default FormatColumn

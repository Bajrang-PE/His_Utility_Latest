import React, { useContext, useEffect, useState } from 'react'
import GlobalDataTable from '../../commons/GlobalDataTable'
import { HISContext } from '../../../contextApi/HISContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import InputField from '../../commons/InputField';
import DataTable from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import InputSelect from '../../commons/InputSelect';

const DataServiceTable = (props) => {
    const { data, onModify, onDelete, onClose, isShowBtn, } = props;
    const { selectedOption, setSelectedOption, showDataTable, setShowDataTable, serviceCategoryDrpData, getServiceCategoryDrpData,dt } = useContext(HISContext);
    const [searchInput, setSearchInput] = useState('');
    const [filterData, setFilterData] = useState(data);
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (!category) {
            setFilterData(data);
        } else {
            const newFilteredData = data.filter(row => {
                const paramCat = row?.jsonData?.serviceCategory || "";
                return paramCat === category;
            });
            setFilterData(newFilteredData);
        }
    }, [category])

    // console.log(data, 'bg')
    // console.log(category, 'bgcat')

    useEffect(() => {
        if (!searchInput) {
            setFilterData(data);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = data.filter(row => {
                const paramId = row?.id?.toString() || "";
                const paramName = row?.jsonData?.serviceInternalName?.toLowerCase() || "";
                const paramDisplayName = row?.jsonData?.serviceName?.toLowerCase() || "";
                const paramCategory = row?.jsonData?.serviceCategory?.toLowerCase() || "";

                return paramId?.includes(lowercasedText) || paramName.includes(lowercasedText) || paramDisplayName.includes(lowercasedText) || paramCategory?.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, data]);

    const webServiceColumn = [
        {
            name: <input
                type="checkbox"
                // checked={selectAll}
                // onChange={(e) => handleSelectAll(e.target.checked, "gnumUserId")}
                disabled={true}
                className="form-check-input log-select"
            />,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedOption[0]?.id === row?.id}
                            onChange={(e) => { setSelectedOption([row]) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: dt('Service ID'),
            selector: row => row.id,
            sortable: true,
            width: "10%"
        },
        {
            name: dt('Service Name'),
            selector: row => row?.jsonData?.serviceInternalName,
            sortable: true,
        },
        {
            name: dt('Service Display Name'),
            selector: row => row?.jsonData?.serviceName,
            sortable: true,
        },
        {
            name: dt('Service Category'),
            selector: row => row?.jsonData?.serviceCategory || "---",
            sortable: true,
        },
    ]

    const handleClose = () => { setShowDataTable(false); onClose(); }

    useEffect(() => {
        if (serviceCategoryDrpData?.length === 0) { getServiceCategoryDrpData(); }
    }, [])

    const tableCustomStyles = {
        headRow: {
            style: {
                color: '#ffffff',
                backgroundColor: '#05396c ',
                borderBottomColor: '#FFFFFF'
            },
        },
    }

    return (
        <div>
            <Modal show={showDataTable} onHide={handleClose} size='xl'>
                <Modal.Header closeButton className='p-2'></Modal.Header>
                <b><h4 className='datatable-header mx-3 py-1 mt-1 px-1'>{dt('Data Service List')}</h4></b>

                <div className="d-flex align-items-center p-0 mx-3">
                    <label className="me-2">{dt('Search Service Category')} :</label>
                    <div className=''>
                        <InputSelect
                            id="serviceCategory"
                            name="serviceCategory"
                            placeholder="Select category"
                            options={serviceCategoryDrpData}
                            className="backcolorinput "
                            value={category}
                            onChange={(e) => { setCategory(e.target.value) }}
                        />
                    </div>
                </div>

                <div className='datatable-btns-his row mx-3 my-1 '>
                    <div className='col-6 m-0 p-0 align-content-center'>
                        {isShowBtn &&
                            <>
                                <button className='btn btn-sm me-1' onClick={()=>onModify()}><FontAwesomeIcon icon={faEdit}
                                    className="dropdown-gear-icon me-1" />{dt('Modify')}</button>
                                <button className='btn btn-sm ms-1' onClick={()=>onDelete()}><FontAwesomeIcon icon={faRemove}
                                    className="dropdown-gear-icon me-1" />{dt('Delete')}</button>
                            </>
                        }
                    </div>
                    <div className="col-6 d-flex justify-content-end align-items-center p-0">
                        <label className="col-form-label me-2">{dt('Search')} :</label>
                        <div className=''>
                            <InputField
                                type="search"
                                id="customMsgForNoData"
                                name="customMsgForNoData"
                                placeholder="Search"
                                className="backcolorinput"
                                onChange={(e) => { setSearchInput(e?.target?.value); }}
                            // value={values?.customMsgForNoData}
                            />
                        </div>
                    </div>

                </div>
                <Modal.Body className='px-3 py-0'>
                    <DataTable
                        // title="User Data"
                        dense
                        striped
                        fixedHeader
                        persistTableHead={true}
                        selectableRowsHighlight
                        highlightOnHover
                        responsive
                        fixedHeaderScrollHeight='65vh'
                        columns={webServiceColumn}
                        data={filterData}
                        pagination
                        pointerOnHover
                        customStyles={tableCustomStyles}
                    />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DataServiceTable

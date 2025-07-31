import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import InputField from './InputField';
import { HISContext } from '../../contextApi/HISContext';
import InputSelect from './InputSelect';


const GlobalDataTable = (props) => {
    const { showDataTable, setShowDataTable, dt } = useContext(HISContext);
    const { title, column, data, onModify, onDelete, onClose, setSearchInput, isShowBtn } = props;

    const handleClose = () => { setShowDataTable(false); onClose(); }

    const tableCustomStyles = {
        headRow: {
            style: {
                color: '#ffffff',
                backgroundColor: '#05396c ',
                borderBottomColor: '#FFFFFF',
                // outline: '1px solid #FFFFFF',
            },
        },
    }

    return (
        <div>
            <Modal show={showDataTable} onHide={handleClose} size='xl'>
                <Modal.Header closeButton className='p-2'></Modal.Header>
                <b><h4 className='datatable-header mx-3 py-1 mt-1 px-1'>{dt(title)}</h4></b>
                <div className='datatable-btns-his row mx-3 my-1 '>
                    <div className='col-6 m-0 p-0 align-content-center'>
                        {isShowBtn &&
                            <>
                                <button className='btn btn-sm me-1' onClick={() => onModify()}><FontAwesomeIcon icon={faEdit}
                                    className="dropdown-gear-icon me-1" />{dt('Modify')}</button>
                                <button className='btn btn-sm ms-1' onClick={() => onDelete()}><FontAwesomeIcon icon={faRemove}
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
                                placeholder="Enter"
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
                        columns={column}
                        data={data}
                        pagination
                        // pointerOnHover
                        customStyles={tableCustomStyles}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GlobalDataTable;

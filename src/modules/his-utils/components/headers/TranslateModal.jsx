import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { fetchPostData } from '../../../../utils/HisApiHooks';
import { ToastAlert } from '../../utils/commonFunction';
import axios from 'axios';


const TranslateModal = (props) => {

    const { data, onClose, title, fetchTranslations } = props;

    const [records, setRecords] = useState([
        {
            "keyName": "",
            "english": "",
            "hindi": "",
            "marathi": "",
            "gujarati": "",
            "sanskrit": "",
            "entryBy": 1
        }
    ]);

    useEffect(() => {
        if (data?.length > 0) {
            // const modefiedData = data?.map((dt, index) => (
            //     {
            //         "keyName": dt,
            //         "english": "",
            //         "hindi": "",
            //         "entryBy": 1
            //     }
            // ))
            setRecords(data)
        }
    }, [data])

    const handleInputChange = (e, index) => {
        const { value, name } = e?.target;

        if (value && name) {

            setRecords((prev) => {
                const prevRec = [...prev];
                const newrec = { ...prevRec[index], [name]: value }
                prevRec[index] = newrec;
                return prevRec;
            })
        }
    }


    const saveGroupData = () => {
        axios.post("/usm/translations/addTranslatedData", { "translations": records }).then((data) => {
            if (data?.data?.status === 1) {
                ToastAlert('Record Added Successfully', 'success');
                onClose()
                setRecords([{ "keyName": "", "english": "", "hindi": "", "marathi": "", "gujarati": "", "sanskrit": "", "entryBy": 1 }])
                fetchTranslations();
            } else {
                ToastAlert(data?.data?.message, 'error');
            }
        })
    }

    const handleRemoveRecord = (indexToRemove) => {
        setRecords((prevRecords) => prevRecords.filter((_, index) => index !== indexToRemove));
    };

    const handleAddRecord = () => {
        setRecords(prev => [
            ...prev,
            {
                "keyName": '',
                "english": '',
                "hindi": '',
                "marathi": "",
                "gujarati": "",
                "sanskrit": "",
                "entryBy": 1,
            },
        ]);
    };


    return (
        <Modal show={true} onHide={onClose} size={'xl'} dialogClassName="">
            <Modal.Header closeButton className='py-1 px-2'>

                <b><h6 className='m-1 p-0' style={{ color: "#b68508" }}>
                    {`${title}`}</h6></b>

            </Modal.Header>
            <Modal.Body className='py-1'>
                <div className="table-responsive row pt-1">
                    <table className="table table-borderless text-center mb-0">
                        <thead className="text-white">
                            <tr className='m-0'>
                                <th style={{ width: "17%" }}>Key Name</th>
                                <th style={{ width: "16%" }}>English</th>
                                <th style={{ width: "16%" }}>Hindi</th>
                                <th style={{ width: "16%" }}>Marathi</th>
                                <th style={{ width: "16%" }}>Gujarati</th>
                                <th style={{ width: "16%" }}>Sanskrit</th>
                                <th style={{ width: "3%" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records?.length > 0 && records?.map((dt, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name='keyName'
                                            id={`keyName-${index}`}
                                            value={dt?.keyName}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name='english'
                                            id={`english-${index}`}
                                            value={dt?.english}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="hindi"
                                            id={`hindi-${index}`}
                                            value={dt?.hindi}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="marathi"
                                            id={`marathi-${index}`}
                                            value={dt?.marathi}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="gujarati"
                                            id={`gujarati-${index}`}
                                            value={dt?.gujarati}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="sanskrit"
                                            id={`sanskrit-${index}`}
                                            value={dt?.sanskrit}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </td>

                                    <td>
                                        <button className='btn btn-sm header-image-his' onClick={() => handleRemoveRecord(index)} style={{ padding: "1px 5px" }}>
                                            <i className="fa fa-close"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <hr className='my-2' />
                <div className='text-center'>
                    <button className='btn btn-sm me-1 header-image-his' onClick={onClose}>
                        <i className="fa fa-close me-1"></i> Close
                    </button>
                    <button className='btn btn-sm me-1 header-image-his' onClick={saveGroupData}>
                        <i className="fa fa-save me-1"></i> Save
                    </button>
                    <button className='btn btn-sm me-1 header-image-his' onClick={handleAddRecord}>
                        <i className="fa fa-plus me-1"></i> Add Key
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default TranslateModal

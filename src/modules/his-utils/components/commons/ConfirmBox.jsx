import React, { useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import { HISContext } from '../../contextApi/HISContext';


const ConfirmBox = (props) => {
    const { message } = props
    const { showConfirmSave, setShowConfirmSave, confirmSave, setConfirmSave,dt } = useContext(HISContext)

    return (
        <>
            {showConfirmSave &&
                <Modal show={true} className="input-box">
                    <Modal.Body>
                        <h6 className='text-center'>{message}</h6>
                        <div className="box text-center">
                            <button type="button" className="btn btn-sm btn-success text-white me-1" data-dismiss="modal" onClick={() => { setConfirmSave(true); setShowConfirmSave(false); }}>{dt('Ok')}</button>
                            <button type="button" className="btn btn-sm btn-danger text-white ms-2" data-dismiss="modal" onClick={() => { setShowConfirmSave(false); setConfirmSave(false); }}> {dt('Cancel')}</button>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}

export default ConfirmBox

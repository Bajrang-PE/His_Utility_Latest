import React, { Suspense, useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { HISContext } from '../../contextApi/HISContext';

const IframeComponent = React.lazy(() => import('./IframeComponent'));

const GlobalModal = (props) => {

    const { linkData, onClose } = props;
     const { dt } = useContext(HISContext);

    return (
        <Modal show={true} onHide={onClose} size={'xl'} dialogClassName="dialog-big">
            <Modal.Header closeButton className='py-1 px-2'>

                <b><h6 className='m-1 p-0'>
                    {`${linkData?.otherLinkName}`}</h6></b>

            </Modal.Header>
            <Modal.Body className='px-3 py-1'>
                <Suspense
                    fallback={
                        <div className="pt-3 text-center">
                            {dt('Loading')}...
                        </div>
                    }
                >
                    <IframeComponent url={linkData?.otherLinkURL} />
                </Suspense>
                <hr className='my-2' />
                <div className='text-center'>
                    <button className='btn cms-login-btn m-1 btn-sm' onClick={onClose}>
                        <i className="fa fa-broom me-1"></i> {dt('Close')}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default GlobalModal

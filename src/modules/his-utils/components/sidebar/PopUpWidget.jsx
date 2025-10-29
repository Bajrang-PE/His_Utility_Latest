import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { fetchData } from '../../../../utils/HisApiHooks';
import { ToastAlert } from '../../utils/commonFunction';
import WidgetDash from './WidgetDash';
import { useSearchParams } from 'react-router-dom';

const PopUpWidget = (props) => {
    const { showPopUpWidget, closePopup, popupConfig, presentWidgets } = props;

    const [widgetData, setWidgetData] = useState([]);
    const [searchParams] = useSearchParams();
    const groupId = atob(searchParams.get("groupId"));
    const dashboardFor = atob(searchParams.get("dashboardFor"));
     const isGlobal = searchParams.get("isGlobal") || 0;

    const getWidgetData = (widid) => {
        fetchData(`/hisutils/getWdgtSnglData?id=${widid}&dashboardFor=${dashboardFor}&masterName=DashboardWidgetMst&isGlobal=${isGlobal || 0}`).then(data => {
            if (data?.status === 1) {
                setWidgetData(data?.data);
            } else {
                ToastAlert(data?.message, 'error');
            }
        })
    }

    useEffect(() => {
        if (popupConfig && popupConfig?.widgetId && dashboardFor) {
            getWidgetData(popupConfig?.widgetId)
        }
    }, [popupConfig, dashboardFor])


    return (
        <>
            <Modal show={showPopUpWidget} onHide={closePopup} size='xl'>
                <Modal.Header closeButton className='p-2'></Modal.Header>
                <Modal.Body className='px-3 py-0'>
                    <WidgetDash widgetDetail={widgetData?.jsonData} pk={popupConfig || ''} isPopup={true}/>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default PopUpWidget

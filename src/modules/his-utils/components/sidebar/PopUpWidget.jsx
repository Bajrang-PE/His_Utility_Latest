import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { fetchData } from '../../../../utils/HisApiHooks';
import { ToastAlert } from '../../utils/commonFunction';
import WidgetDash from './WidgetDash';
import { useSearchParams } from 'react-router-dom';
import { decryptData } from '../../../../utils/SecurityConfig';
import { getEncryptedParamValue } from '../../../../utils/Security';

const PopUpWidget = (props) => {
    const { showPopUpWidget, closePopup, popupConfig, presentWidgets } = props;

    const [widgetData, setWidgetData] = useState([]);
    const [searchParams] = useSearchParams();
    //    const dashboardFor = atob(searchParams.get("dashboardFor"));
    // const encIFUrl = searchParams.get("dbfhttf");
    // const groupId = encIFUrl ? atob(getEncryptedParamValue(encIFUrl, "groupId")) : '';
    // const dashboardFor = encIFUrl ? atob(getEncryptedParamValue(encIFUrl, "dashboardFor")) : '';

    let groupId = ''
    let dashboardFor = ''

    useEffect(() => {
        if (searchParams.get("groupId") && searchParams.get("dashboardFor")) {
            groupId = atob(searchParams.get("groupId"));
            dashboardFor = atob(searchParams.get("dashboardFor"));
        } else if (searchParams.get("dbfhttf")) {
            const encIFUrl = searchParams.get("dbfhttf");
            groupId = encIFUrl ? atob(getEncryptedParamValue(encIFUrl, "groupId")) : '';
            dashboardFor = encIFUrl ? atob(getEncryptedParamValue(encIFUrl, "dashboardFor")) : '';
        }
    }, [])

    const getWidgetData = (widid) => {
        fetchData(`/hisutils/getWdgtSnglData?id=${widid}&dashboardFor=${dashboardFor}&masterName=DashboardWidgetMst`).then(data => {
            if (data?.status === 1) {
                setWidgetData(data?.data);
            } else {
                ToastAlert(data?.message, 'error');
            }
        })
    }

    useEffect(() => {
        if (popupConfig && popupConfig?.widgetId) {
            getWidgetData(popupConfig?.widgetId)
        }
    }, [popupConfig])


    return (
        <>
            <Modal show={showPopUpWidget} onHide={closePopup} size='xl'>
                <Modal.Header closeButton className='p-2'></Modal.Header>
                {/* <b><h4  className='datatable-header mx-3 py-1 mt-1 px-1'>{"this is modal view"}</h4></b> */}
                <Modal.Body className='px-3 py-0'>
                    <WidgetDash widgetDetail={widgetData?.jsonData} pk={popupConfig?.pkValue || ''} />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default PopUpWidget

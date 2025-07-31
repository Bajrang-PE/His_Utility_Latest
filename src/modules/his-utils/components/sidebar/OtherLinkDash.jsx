import React, { Suspense, useContext, useState } from 'react'
import { HISContext } from '../../contextApi/HISContext';

const GlobalModal = React.lazy(() => import('../commons/GlobalModal'));

const OtherLinkDash = ({ widgetData }) => {
    const { theme, setLoading,dt } = useContext(HISContext);

    const [currentLink, setCurrentLink] = useState({});
    const [isShowModal, setIsShowModal] = useState(false);

    const linkData = widgetData?.lstOtherLink && widgetData?.lstOtherLink?.length > 0 ? widgetData?.lstOtherLink : [];

    const onCloseModal = () => {
        setCurrentLink({});
        setIsShowModal(false);
    }
    const onLinkClicked = (link) => {
        setCurrentLink(link);
        setIsShowModal(true);
    }
    return (
        <div className={`tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border tabular-box-border`} style={{ border: `1px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>

            <div className="row px-2 py-2 border-bottom" >
                <div className={`col-md-12 fw-medium fs-6`} >{dt(widgetData?.rptDisplayName)} : {widgetData?.rptId}</div>

            </div>

            <ul class="list-group m-1">
                {linkData?.map((link, index) =>
                    <li class="list-group-item list-group-item-primary list-group-item-action p-1 pointer" key={index} onClick={() => onLinkClicked(link)}>{dt(link?.otherLinkName)}</li>
                )}
            </ul>
            <b><h6 className='header-devider mt-2'></h6></b>

            {widgetData?.footerText !== '' &&
                <div className="px-2 py-2">
                    <span>{widgetData?.footerText}</span>
                </div>
            }
            {isShowModal &&
                <Suspense
                    fallback={
                        <div className="pt-3 text-center">
                           {dt('Loading')}...
                        </div>
                    }
                >
                    <GlobalModal linkData={currentLink} onClose={onCloseModal} />
                </Suspense>
            }
        </div>
    )
}

export default OtherLinkDash

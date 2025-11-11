import React, { Suspense, useContext } from 'react'
import { HISContext } from '../../contextApi/HISContext';

const IframeComponent = React.lazy(() => import('../commons/IframeComponent'));

const IframeDash = ({ widgetData }) => {
    const { theme, setLoading,dt } = useContext(HISContext);
    return (
        <div className={`tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border tabular-box-border`} style={{ border: `1px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>

            <div className="row px-2 py-2 border-bottom" >
                {/* {headingReq && */}
                <div className={`col-md-12 fw-medium fs-6`} >{widgetData?.rptDisplayName} : {widgetData?.rptId}</div>
                {/* } */}

            </div>
            <Suspense
                fallback={
                    <div className="pt-3 text-center">
                       {dt('Loading')}...
                    </div>
                }
            >
                <IframeComponent url={widgetData?.iframeURL || ''} />
            </Suspense>

            {widgetData?.footerText !== '' &&
                <div className="px-2 py-2">
                    <span>{widgetData?.footerText}</span>
                </div>
            }
        </div>
    )
}

export default IframeDash

import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useEffect, useState } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { HISContext } from '../../contextApi/HISContext';
import { fetchProcedureData, fetchQueryData, formatDateFullYear, formatParams, getOrderedParamValues, ToastAlert } from '../../utils/commonFunction';
import PopUpWidget from './PopUpWidget';

const KpiDash = ({ widgetData, presentTabs }) => {
    const { setActiveTab, setLoading, paramsValues, searchScope, isSearchQuery, setIsSearchQuery, setSearchScope, setPrevKpiTab, activeTab, dt, presentTabsDash } = useContext(HISContext);
    const [kpiData, setKpiData] = useState([]);
    const [kpiLoading, setKpiLoading] = useState(false);
    const [popupConfig, setPopupConfig] = useState(null);
    const [showPopUpWidget, setShowPopUpWidget] = useState(false);

    const formatData = (rawData = []) => {
        return rawData.map((item) => {
            const formattedItem = {};
            Object.entries(item).forEach(([key, value]) => {

                const formattedKey = key.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

                formattedItem[formattedKey] = formattedKey.includes("State") ? value : value;
            });
            return formattedItem;
        });
    };
    const fetchData = async (widget) => {
        if (widget?.modeOfQuery === "Procedure") {
            if (!widget?.procedureMode) return;
            try {
                setKpiLoading(true);
                const paramVal = formatParams(paramsValues ? paramsValues : null, widgetData?.rptId || '');

                const params = [
                    getAuthUserData('hospitalCode')?.toString(), //hospital code===
                    "10001", //user id===
                    "", //primary key
                    paramVal.paramsId || "", //parameter ids
                    paramVal.paramsValue || "", //parameter values
                    isPaginationReq?.toString(), //is pagination required===
                    initialRecord?.toString(), //initial record no.===
                    finalRecord?.toString(), //final record no.===
                    "", //date options
                    formatDateFullYear(new Date()),//from values
                    formatDateFullYear(new Date()) // to values
                ]
                const response = await fetchProcedureData(widget?.procedureMode, params, widget?.JNDIid);
                const formattedData = formatData(response.data || []);
                // const generatedColumns = generateColumns(formattedData);
                setKpiData(formattedData);
                setIsSearchQuery(false)
                setKpiLoading(false);
                setSearchScope({ scope: "", id: "" })
            } catch (error) {
                console.error("Error loading query data:", error);
                setKpiData([]);

            }
        } else if (widget?.modeOfQuery === "Query") {
            if (!widget?.queryVO?.length > 0) return;
            setKpiLoading(true);
            const params = getOrderedParamValues(widget?.queryVO[0]?.mainQuery, paramsValues, widget?.rptId);
            try {

                const data = await fetchQueryData(widget?.queryVO, widgetData?.JNDIid, params);
                if (data?.length > 0) {
                    const firstItem = data[0];
                    const dynamicKey = Object.keys(firstItem)[0];
                    const dynamicValue = firstItem[dynamicKey];

                    setKpiData(dynamicValue);
                    setIsSearchQuery(false);
                    setKpiLoading(false);
                    setSearchScope({ scope: "", id: "" })
                } else {
                    setKpiData([])
                    setKpiLoading(false);
                }
            } catch (error) {
                console.error("Error loading query data:", error);
                setKpiLoading(false);
                setKpiData([]);
            }
        } else if (widget?.modeOfQuery === "HTMLText") {
            setKpiData(widget?.htmlText ? widget?.htmlText : "")

        }
    }

    useEffect(() => {
        if (widgetData && !isSearchQuery) {
            setKpiData([]);
            fetchData(widgetData);
        }
    }, [paramsValues, widgetData]);

    useEffect(() => {
        if (isSearchQuery && searchScope?.scope === "widgetParams" && searchScope?.id == widgetData?.rptId) {
            setKpiData([]);
            fetchData(widgetData);
        } else if (isSearchQuery && searchScope?.scope !== "" && searchScope?.scope !== "widgetParams") {
            setKpiData([]);
            fetchData(widgetData);
        }
    }, [isSearchQuery]);


    const getDynamicIcon = (iconName) => {
        if (!iconName) return SolidIcons.faMedkit;

        let formattedIconName = "fa" + iconName
            .replace("fa-", "")
            .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
        let iconKey = Object.keys(SolidIcons).find(key => key.toLowerCase() === formattedIconName.toLowerCase());
        if (!iconKey) {
            iconKey = Object.keys(SolidIcons).find(key => key.toLowerCase().includes(formattedIconName.toLowerCase().replace(/[^a-zA-Z]/g, "")));
        }
        return iconKey ? SolidIcons[iconKey] : SolidIcons.faMedkit;
    };

    const onHover = (e) => {
        e.currentTarget.style.backgroundColor = widgetData?.widgetHoverBackground || widgetData?.widgetBackgroundColour
    }
    const onMouseLeave = (e) => {
        e.currentTarget.style.backgroundColor = widgetData?.widgetBackgroundColour
    }

    const onKpiClickDetails = (id) => {
        const tabdt = presentTabsDash?.filter(tab => tab?.jsonData?.dashboardId == id)
        if (tabdt?.length > 0) {
            setActiveTab(tabdt[0]);
            setPrevKpiTab([activeTab]);
        } else {
            ToastAlert('Tab Not Found', 'warning')
        }

    }

    const onWidgetClickDetails = (id) => {
        if (id) {
            setPopupConfig({
                widgetId: id,
            })
            setShowPopUpWidget(true);
        }
    }

    const closePopup = () => {
        setPopupConfig(null);
        setShowPopUpWidget(false);
    };

    const widheight = presentTabs?.length > 0 && presentTabs?.filter(dt => dt?.rptId == widgetData?.rptId)[0]?.widgetHeight;



    return (
        <>
            <div className={`${widgetData?.kpiType === "isKpiACircle" ? 'small-box-kpi-circle' : 'small-box-kpi'}`} style={{
                backgroundColor: widgetData?.widgetBackgroundColour,
                color: widgetData?.widgetFontColour,
                // borderWidth: widgetData?.kpiBorderWidth,
                // borderColor: widgetData?.kpiBorderColor,

                borderTop: `${widgetData?.kpiBorderWidth}px solid ${widgetData?.kpiBorderColor}`,
                borderBottom: `${widgetData?.kpiBorderWidth}px solid ${widgetData?.kpiBorderColor}`,
                borderLeft: widgetData?.kpiType === "isWidgetForCustomDesignLeft" ? `20px solid ${widgetData?.kpiBorderColor}` : `${widgetData?.kpiBorderWidth}px solid ${widgetData?.kpiBorderColor}`,
                borderRight: widgetData?.kpiType === "isWidgetForCustomDesign" ? `20px solid ${widgetData?.kpiBorderColor}` : `${widgetData?.kpiBorderWidth}px solid ${widgetData?.kpiBorderColor}`,
                // borderRadius: "50%",
                // borderStyle: 'solid',
                boxShadow: widgetData?.isWidgetShadowRequired === 'Yes' ? '5px 5px 10px rgba(0,0,0,0.2)' : 'none',
                height: !widheight || widheight === "0" ? 'auto' : `${widheight}px`,
                width:"100%"
            }} onMouseEnter={onHover} onMouseLeave={onMouseLeave}>

                {widgetData?.downloadDataFromKPI === 'Yes' && (
                    <div>
                        <button
                            aria-expanded="false"
                            data-bs-toggle="dropdown"
                            type="button"
                            className="small-box-btn-dwn dropdown-toggle"
                        // style={{ marginTop: '5px', marginRight: '10px', float: 'right', zIndex: 1040 }}
                        >
                            <FontAwesomeIcon icon={faDownload} className="me-2 dropdown-gear-icon" />
                        </button>

                        <ul className="dropdown-menu" style={{ position: 'absolute', left: '50px', top: '0', margin: '2px 100px 0px' }}>
                            <li>
                                <a
                                    className="text-decoration-none"
                                    style={{ cursor: 'pointer', color: '#000000', textShadow: 'none' }}
                                // id={`KPI_PDF_${widgetData.rptId}`} 
                                // onClick={() => downloadWidgetDataWithoutHTML(widgetData.rptId, 'PDF')}
                                >
                                    <i className="fa fa-file-pdf"></i> &nbsp; {dt('Download PDF')}
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-decoration-none"
                                    style={{ cursor: 'pointer', color: '#000000', textShadow: 'none' }}
                                // id={`KPI_Excel_${widgetData.rptId}`} 
                                // onClick={() => downloadWidgetDataWithoutHTML(widgetData.rptId, 'EXCEL')}
                                >
                                    <i className="fa fa-file-excel"></i> &nbsp; {dt('Download Excel')}
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
                <div className={`kpi-details-box ${widgetData?.kpiType === "isKpiACircle" ? 'text-center' : "cirbox"}`}
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                >
                    {kpiLoading ?
                        <>
                            <span style={{ textAlign: "center", color: "white" }}>{dt('Loading')}...</span> </>
                        :
                        <>
                            <div
                                className='inner'
                                dangerouslySetInnerHTML={{ __html: kpiData || "" }}
                            />
                            {/* widgetData?.onClickOfKPITabId !== '0' && widgetData?.onClickOfKPITabId !== '' && */}

                            {(widgetData?.onClickKPITypeOption !== "0" && widgetData?.onClickOfKPITabId && widgetData?.onClickOfKPITabId !== '0') &&
                                <div className='small-box-kpi-link-dtl' style={{ color: widgetData?.kpiLinkFontColor }} onClick={() => onKpiClickDetails(widgetData?.onClickOfKPITabId)}>
                                    <span>{dt(widgetData?.linkTab || 'Click For Details')}</span>
                                    <b><FontAwesomeIcon icon={faSearch} /></b>
                                </div>
                            }
                            {(widgetData?.onClickKPITypeOption !== "0" && widgetData?.onClickOfKPIWidgetId && widgetData?.onClickOfKPIWidgetId !== '0') &&
                                <div className='small-box-kpi-link-dtl' style={{ color: widgetData?.kpiLinkFontColor }} onClick={() => onWidgetClickDetails(widgetData?.onClickOfKPIWidgetId)}>
                                    <span>{dt(widgetData?.linkWidget || 'Click For Details')}</span>
                                    <b><FontAwesomeIcon icon={faSearch} /></b>
                                </div>
                            }
                        </>
                    }

                </div>
                {(widgetData?.iconType !== 'NO_ICON' && widgetData?.kpiType !== "isKpiACircle") &&
                    <div className="small-box-icon kpi-icon-img">
                        {widgetData?.iconType === 'IMAGE' ?
                            <img src="https://uatcdash.dcservices.in/HISUtilities/dashboard/images/Icon_images/default-icon.png" alt="image" className='dropdown-gear-icon' />
                            :
                            <FontAwesomeIcon icon={getDynamicIcon(widgetData?.iconName)} color={widgetData?.widgetIconColour} />
                        }
                        {/* <i className='fa fa-balance-scale'></i> */}
                    </div>
                }
                <a href="#" className="small-box-footer" style={{ display: 'none' }}>
                    {dt('More info')} <i className="fa fa-search"></i>
                </a>
            </div>
            {(popupConfig && showPopUpWidget) && (
                <PopUpWidget {...{ showPopUpWidget, popupConfig, closePopup }} />
            )}
        </>
    )
}

export default KpiDash

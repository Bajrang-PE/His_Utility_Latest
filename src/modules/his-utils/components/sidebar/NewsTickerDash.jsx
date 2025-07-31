import React, { useContext, useEffect, useMemo, useState } from 'react'; // Added useMemo
import { HISContext } from '../../contextApi/HISContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faFileExcel, faFilePdf, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { generateCSV, generatePDF } from '../commons/advancedPdf';
import { fetchProcedureData, fetchQueryData, formatDateFullYear } from '../../utils/commonFunction';

const NewsTickerDash = ({ widgetData }) => {
    const { theme, mainDashData, singleConfigData, paramsValues, setLoading, dt } = useContext(HISContext);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitionActive, setIsTransitionActive] = useState(true);
    const [newsData, setNewsData] = useState([]);

    const borderReq = useMemo(() => widgetData?.isWidgetBorderRequired || '', [widgetData?.isWidgetBorderRequired]);
    const headingAlign = useMemo(() => widgetData?.widgetHeadingAlignment || '', [widgetData?.widgetHeadingAlignment]);
    const widgetHeadingColor = useMemo(() => widgetData?.widgetHeadingColor || '', [widgetData?.widgetHeadingColor]);
    const isWidgetNameVisible = useMemo(() => widgetData?.isWidgetNameVisible || '', [widgetData?.isWidgetNameVisible]);
    const isDirectDownloadRequired = useMemo(() => widgetData?.isDirectDownloadRequired || 'No', [widgetData?.isDirectDownloadRequired]);
    const widgetTopMargin = useMemo(() => widgetData.widgetTopMargin || "", [widgetData.widgetTopMargin]);
    const footerText = useMemo(() => widgetData.footerText || "", [widgetData.footerText]);
    const rptDisplayName = useMemo(() => widgetData?.rptDisplayName, [widgetData?.rptDisplayName]);
    const initialRecord = widgetData?.initialRecordNo;
    const finalRecord = widgetData?.finalRecordNo;

    const widgetLimit = useMemo(() => widgetData?.limitHTMLFromDb || '', [widgetData?.limitHTMLFromDb]);
    const mainQuery = useMemo(() => widgetData?.query && widgetData?.query?.length > 0 ? widgetData?.query[0]?.mainQuery : widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : '', [widgetData?.query, widgetData?.queryVO]);

    const rptId = useMemo(() => widgetData?.rptId, [widgetData?.rptId]);
    const modeOfQuery = useMemo(() => widgetData?.modeOfQuery, [widgetData?.modeOfQuery]);
    const procedureMode = useMemo(() => widgetData?.procedureMode, [widgetData?.procedureMode]);

    const defLimit = useMemo(() => singleConfigData?.databaseConfigVO?.setDefaultLimit || '', [singleConfigData]);
    const parsedLimit = useMemo(() => parseInt(defLimit, 10), [defLimit]);
    const safeLimit = useMemo(() => isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit, [parsedLimit]);

    const formatParams = (paramsObj) => {
        if (typeof paramsObj !== 'object' || paramsObj === null || Array.isArray(paramsObj)) {
            return {
                paramsId: "",
                paramsValue: ""
            };
        }

        return {
            paramsId: Object.keys(paramsObj).join(','),
            paramsValue: Object.values(paramsObj).join(',')
        };
    };

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
                const paramVal = formatParams(paramsValues ? paramsValues : null);

                const params = [
                    getAuthUserData('hospitalCode')?.toString(), //hospital code===
                    "10001", //user id===
                    "", //primary key
                    paramVal.paramsId || "", //parameter ids
                    paramVal.paramsValue || "", //parameter values
                    'No', //is pagination required===
                    initialRecord?.toString(), //initial record no.===
                    finalRecord?.toString(), //final record no.===
                    "", //date options
                    formatDateFullYear(new Date()),//from values
                    formatDateFullYear(new Date()) // to values
                ]
                const response = await fetchProcedureData(widget?.procedureMode, params, widget?.JNDIid);
                const formattedData = formatData(response.data || []);
                setNewsData(formattedData);
            } catch (error) {
                console.error("Error loading query data:", error);
                setNewsData([]);
            }
        } else if (widget?.modeOfQuery === "Query") {
            try {
                const data = await fetchQueryData(widget?.queryVO, widget?.JNDIid);
                if (data?.length > 0) {
                    const formattedData = formatData(data);
                    setNewsData(formattedData);
                } else {
                    setNewsData([]);
                }
            } catch (error) {
                console.error("Error loading query data:", error);
            }
        }
    }

    useEffect(() => {
        if (widgetData) {
            fetchData(widgetData)
        }
    }, [widgetData])

    const newsList = useMemo(() => [
        "PM launches new health scheme",
        "Budget 2025 to focus on AI in healthcare",
        "COVID-19 booster drive begins nationwide",
        "Medical devices to get QR-based authentication",
        "Union Health Ministry releases new SOPs"
    ], []);

    const itemHeight = 40;

    const parsedInterval = useMemo(() => parseInt(widgetData?.newsTimeInterval, 10) || 3000, [widgetData?.newsTimeInterval]);
    const effectiveVisibleCount = useMemo(() => Math.max(1, parseInt(widgetData?.newsVisible, 10) || 3), [widgetData?.newsVisible]);
    const speedSetting = useMemo(() => widgetData?.newsSpeed || 'normal', [widgetData?.newsSpeed]);

    const speedDurations = useMemo(() => ({
        slow: '1s',
        normal: '0.5s',
        fast: '0.2s'
    }), []);
    const animationDurationString = useMemo(() => speedDurations[speedSetting] || '0.5s', [speedDurations, speedSetting]);

    const animationDurationMs = useMemo(() => parseFloat(animationDurationString.replace('s', '')) * 1000, [animationDurationString]);

    const canAnimate = useMemo(() => newsList.length > 0 && newsList.length > effectiveVisibleCount, [newsList, effectiveVisibleCount]);

    const itemsToDisplay = useMemo(() => canAnimate
        ? [...newsList, ...newsList.slice(0, effectiveVisibleCount)]
        : newsList, [canAnimate, newsList, effectiveVisibleCount]);

    // Effect to advance the ticker
    useEffect(() => {
        if (!canAnimate) {
            setCurrentIndex(0);
            return;
        }
        const timerId = setTimeout(() => {
            if (!isTransitionActive) {
                setIsTransitionActive(true);
            }
            setCurrentIndex(prevIndex => prevIndex + 1);
        }, parsedInterval);

        return () => clearTimeout(timerId);
    }, [currentIndex, parsedInterval, canAnimate, isTransitionActive]);

    // Effect to handle the "snap back" for a seamless loop
    useEffect(() => {
        if (!canAnimate) return;
        if (currentIndex >= newsList.length) {
            const snapTimerId = setTimeout(() => {
                setIsTransitionActive(false);
                setCurrentIndex(currentIndex % newsList.length);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setIsTransitionActive(true);
                    });
                });
            }, animationDurationMs);
            return () => clearTimeout(snapTimerId);
        }
    }, [currentIndex, newsList, animationDurationMs, canAnimate]);

    return (
        <div className={`tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border ${borderReq === 'No' ? '' : 'tabular-box-border'}`} style={{ border: `1px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>
            <div className="row px-2 py-2 border-bottom" style={{ textAlign: headingAlign, color: widgetHeadingColor }} >
                {isWidgetNameVisible === "Yes" &&
                    <div className={` ${isDirectDownloadRequired === 'Yes' ? 'col-md-7' : 'col-md-12'} fw-medium fs-6`} >{dt(rptDisplayName)}</div>
                }
                {isDirectDownloadRequired === 'Yes' &&
                    <div className="col-md-5 text-end">
                        <button
                            type="button"
                            className="small-box-btn-dwn"
                            aria-expanded="false"
                            data-bs-toggle="dropdown"
                        >
                            <FontAwesomeIcon icon={faCog} className="dropdown-gear-icon" />
                        </button>
                        <ul className="dropdown-menu p-2">
                            <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => fetchData(widgetData)}>
                                <FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon me-2" />{dt('Refresh Data')}
                            </li>
                            <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => generatePDF(widgetData, widgetLimit ? newsData.slice(0, parseInt(widgetLimit)) : safeLimit ? newsData.slice(0, safeLimit) : newsData, singleConfigData?.databaseConfigVO)} title="pdf">
                                <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon me-2" />{dt('Download PDF')}
                            </li>
                            <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => generateCSV(widgetData, widgetLimit ? newsData.slice(0, parseInt(widgetLimit)) : safeLimit ? newsData.slice(0, safeLimit) : newsData, singleConfigData?.databaseConfigVO)}>
                                <FontAwesomeIcon icon={faFileExcel} className="dropdown-gear-icon me-2" />{dt('Download CSV')}
                            </li>
                        </ul>
                        <button className="small-box-btn-dwn ms-1" onClick={() => generatePDF(widgetData, newsList, singleConfigData?.databaseConfigVO)} title="PDF">
                            <FontAwesomeIcon icon={faFilePdf} />
                        </button>
                        <button className="small-box-btn-dwn ms-1" onClick={() => generateCSV(widgetData, newsData, singleConfigData?.databaseConfigVO)}>
                            <FontAwesomeIcon icon={faFileExcel} />
                        </button>
                    </div>
                }
            </div>

            <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>
                <h4 style={{ fontWeight: "500", fontSize: "20px" }}>{dt('Query')} : {rptId}</h4>
                {modeOfQuery === 'Query' &&
                    <span>{mainQuery}</span>
                }
                {modeOfQuery === "Procedure" &&
                    <span>{procedureMode}</span>
                }
            </div>

            <div
                className="ticker-wrapper"
                style={{
                    height: `${effectiveVisibleCount * itemHeight}px`,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <div
                    className="ticker-content"
                    style={{
                        transform: `translateY(-${currentIndex * itemHeight}px)`,
                        transition: isTransitionActive ? `transform ${animationDurationString} ease-in-out` : 'none',
                    }}
                >
                    {itemsToDisplay.map((news, idx) => (
                        <div
                            className="ticker-item"
                            key={idx}
                            style={{
                                height: `${itemHeight}px`,
                                lineHeight: `${itemHeight}px`,
                                padding: '0 5px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                            title={news}
                        >
                            {dt(news)}
                        </div>
                    ))}
                </div>
            </div>

            {footerText && footerText.trim() !== '' && (
                <>
                    <h6 className='header-devider mt-2 mb-0'></h6>
                    <div className="px-2 py-2">
                        <span style={{ fontSize: '12px' }}>{footerText}</span>
                    </div>
                </>
            )}
        </div>
    )
}

export default NewsTickerDash;
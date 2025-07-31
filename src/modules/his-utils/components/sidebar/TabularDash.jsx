import React, { lazy, useContext, useEffect, useState } from "react";
import Tabular from "./Tabular";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faCog, faFileExcel, faFilePdf, faRefresh, faSortAmountDesc, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { fetchProcedureData, fetchQueryData, formatDateFullYear, formatParams, getOrderedParamValues, ToastAlert } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import InputField from "../commons/InputField";
import { generateCSV, generatePDF } from "../commons/advancedPdf";
import { getAuthUserData } from "../../../../utils/CommonFunction";
import { useSearchParams } from "react-router-dom";
import PopUpWidget from "./PopUpWidget";
import { fetchPostData } from "../../../../utils/HisApiHooks";
import { jsPDF } from 'jspdf';
import axios from "axios";

const Parameters = lazy(() => import('./Parameters'));

const TabularDash = (props) => {

  const { widgetData, setWidgetData, levelData, setLevelData, pkColumn, setPkColumn } = props;

  const { theme, singleConfigData, paramsValues, setLoading, presentWidgets, isSearchQuery, setIsSearchQuery, setSearchScope, searchScope, dt } = useContext(HISContext);


  const [tableData, setTableData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [filterData, setFilterData] = useState(tableData)
  const [columns, setColumns] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [popupConfig, setPopupConfig] = useState(null);
  const [showPopUpWidget, setShowPopUpWidget] = useState(false);

  const [queryParams] = useSearchParams();
  const isPrev = queryParams.get('isPreview');

  const isChildPresent = widgetData?.children && widgetData?.children?.length > 0;
  const childId = widgetData?.children?.length > 0 ? widgetData?.children[0] : '';

  useEffect(() => {
    setTableData([])
  }, [widgetData])

  //parameter search
  useEffect(() => {
    if (!searchInput) {
      setFilterData(tableData);
    } else {
      const lowercasedText = searchInput.toLowerCase();

      const newFilteredData = tableData?.length > 0 && tableData?.filter(row => {
        return Object.values(row)?.some(val =>
          val?.toString()?.toLowerCase()?.includes(lowercasedText)
        );
      });

      setFilterData(newFilteredData);
    }
  }, [searchInput, tableData]);


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


  const getPopupConfig = (widgetIndicator) => {
    try {
      if (widgetData?.drillDownJsonString) {
        const drillDownConfig = JSON.parse(widgetData?.drillDownJsonString || []);
        const config = drillDownConfig.find(
          item => item.modeForOpeningPopup === String(widgetIndicator)
        );
        return config || null;
      } else {
        ToastAlert('No widget mapped', 'warning')
      }

    } catch (error) {
      console.error('Error parsing popup config:', error);
      return null;
    }
  };

  const openPopUpWidget = (value) => {
    try {
      if (typeof value !== 'string' || !value.includes('##')) {
        ToastAlert('Invalid data format for popup', 'warning');
        return;
      }

      const parts = value.split('##');
      if (parts.length < 3) {
        ToastAlert('Insufficient data for popup', 'warning');
        return;
      }

      const [displayValue, pkValue, widgetIndicator] = parts;
      const config = getPopupConfig(widgetIndicator);

      if (!config) {
        ToastAlert(`No popup config found for indicator ${widgetIndicator}`, 'warning');
        return;
      }

      setPopupConfig({
        widgetId: config.popupWidgetId,
        pkValue: pkValue,
        title: config.titleMsg,
        mode: config.modeForOpeningPopup,
        widgetName: config?.drillWidgetName
      });
      setShowPopUpWidget(true);

    } catch (error) {
      console.error('Error opening popup:', error);
      setShowPopUpWidget(false);
    }
  };

  const closePopup = () => {
    setPopupConfig(null);
    setShowPopUpWidget(false);
  };

  const FtpClicked = async (e) => {
    e.preventDefault();
    const tag = e.target;

    if (tag.tagName !== 'A') {
      ToastAlert("Invalid FTP link.", 'error');
      return;
    }

    const remoteUrl = tag.getAttribute('data-url');
    const fileName = tag.getAttribute('data-filename');

    const val = {
      "remoteUrl": remoteUrl,
      "fileName": fileName
    }

    fetchPostData("/hisutils/ftp/view", val, { responseType: 'blob' }).then(async (data) => {
      if (data) {
        console.log(data, 'adtata')
        // const contentType = data.headers['content-type'] || data.data.type;

        // if (contentType.includes('application/pdf')) {

          const pdfBlob = new Blob([data?.data], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');

        // } else if (contentType.includes('text/plain')) {

        //   const text = await data.data.text();
        //   const doc = new jsPDF();
        //   doc.text(text?.trim(), 10, 10);
        //   const pdfUrl = URL.createObjectURL(doc.output('blob'));

        //   const pdfWindow = window.open(pdfUrl);
        //   if (!pdfWindow) {
        //     const a = document.createElement('a');
        //     a.href = pdfUrl;
        //     a.download = 'converted.pdf';
        //     a.click();
        //   }
        //   setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
        // }
        // else {
        //   ToastAlert(`Unsupported file type: ${contentType}`, 'error');
        // }
      } else {
        ToastAlert("Internal Error", 'error')
      }
    })
  }

  const getFirstValue = (val) => {
    return typeof val === 'string' && val.includes('##') ? val.split('##')[0] : val;
  };

  const generateColumns = (data, ifDrill = isChildPresent) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]).filter(key => key !== 'pkcolumn');

    let reorderedKeys = [];

    const snoKey = keys.find(k => /^sno$/i.test(k));
    const stateKey = keys.find(k => /state/i.test(k));

    if (snoKey) reorderedKeys.push(snoKey);
    if (stateKey) reorderedKeys.push(stateKey);

    const restKeys = keys.filter(
      k => k !== snoKey && k !== stateKey
    );

    reorderedKeys = [...reorderedKeys, ...restKeys];

    const dynamicColumns = reorderedKeys.map((key) => ({
      name: key,
      selector: row => getFirstValue(row[key]),
      sortable: true,
      wrap: true,
      width: /^sno$/i.test(key) ? '8%' : undefined,
      cell: (row) => {
        const value = row[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          return null;
        }
        const displayValue = getFirstValue(value);

        if (typeof value === 'string' && value.trim().startsWith('<a') && value.includes('data-isSFTP=')) {
          return (
            <span className="pointer" dangerouslySetInnerHTML={{ __html: value }} onClick={(e) => FtpClicked(e, value)} />
          );
        }

        if (typeof value === 'string' && (value.trim().startsWith('<a') || value.trim().startsWith('<div'))) {
          return (
            <span
              dangerouslySetInnerHTML={{ __html: value }}
            />
          );
        }

        return typeof value === 'string' && value.includes("##") ? (
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => openPopUpWidget(value)}
          >
            {displayValue}
          </span>
        ) : (
          <span>{displayValue}</span>
        );
      }
    }));

    if (ifDrill) {
      const drillColumn = {
        name: "Action",
        cell: (row) => (
          <button
            className="rounded-4 border-1"
            onClick={() => onDrillDown(row?.pkcolumn)}
          >
            <FontAwesomeIcon icon={faSortAmountDesc} />
          </button>
        )
      };
      return [drillColumn, ...dynamicColumns];
    }

    return dynamicColumns;
  };

  const fetchData = async (widget) => {
    if (widget?.modeOfQuery === "Procedure") {
      if (!widget?.procedureMode) return;
      try {
        setFetching(true);
        const paramVal = formatParams(paramsValues ? paramsValues : null, widgetData?.rptId || '');
        const params = [
          getAuthUserData('hospitalCode')?.toString(), //hospital code===
          "10001", //user id===
          pkColumn ? pkColumn?.toString() : '', //primary key
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
        const generatedColumns = generateColumns(formattedData, isChildPresent);
        setColumns(generatedColumns);
        setTableData(formattedData);
        setLoading(false)
        setIsSearchQuery(false)
        setFetching(false)
        setSearchScope({ scope: "", id: "" })
      } catch (error) {
        console.error("Error loading query data:", error);
        setLoading(false)
        setFetching(false)
        setIsSearchQuery(false)
      }
    } else {
      if (!widget?.queryVO?.length > 0) return;

      const params = getOrderedParamValues(widget?.queryVO[0]?.mainQuery, paramsValues, widget?.rptId);
      try {
        setFetching(true)
        console.log(params,'params')
        const data = await fetchQueryData(widget?.queryVO?.length > 0 ? widget?.queryVO : [], widget?.JNDIid, params, pkColumn);
        if (data?.length > 0) {
          let filteredData = data;

          if (widget?.isQuerychild && widget?.isQuerychild === "1") {
            const columnIndexes = widget?.columnIndexesParent || [];
            const keys = Object.keys(data[0]);
            filteredData = data.map(row => {
              const filteredRow = {};
              columnIndexes.forEach(idx => {
                const key = keys[idx];
                if (key) filteredRow[key] = row[key];
              });
              return filteredRow;
            });
          }
          const formattedData = formatData(filteredData);
          const generatedColumns = generateColumns(formattedData, isChildPresent);
          setColumns(generatedColumns);
          setTableData(formattedData);
          setLoading(false)
          setIsSearchQuery(false)
          setFetching(false)
          setSearchScope({ scope: "", id: "" })
        } else {
          setColumns([]);
          setTableData([]);
          setFetching(false)
          setIsSearchQuery(false)
        }
      } catch (error) {
        console.error("Error loading query data:", error);
        setFetching(false)
        setIsSearchQuery(false)
      }
    }
  }

  useEffect(() => {
    if (widgetData && !isSearchQuery) {
      fetchData(widgetData);
    }
  }, [widgetData, paramsValues]);

  useEffect(() => {
    if (isSearchQuery && searchScope?.scope === "widgetParams" && searchScope?.id == widgetData?.rptId) {
      fetchData(widgetData);
    } else if (isSearchQuery && searchScope?.scope !== "" && searchScope?.scope !== "widgetParams") {
      fetchData(widgetData);
    }
  }, [isSearchQuery]);

  const headingAlign = widgetData?.headingAlign === '1' ? 'center' : 'left';
  const headingAlignTable = widgetData?.tableHeadingAlignment === '1' ? 'center' : 'left';
  const borderReq = widgetData?.isTableBorderRequired || '';
  const headingReq = widgetData?.tableHeadingRequired === 'yes' || widgetData?.tableHeadingRequired === 'Yes';
  const headingBgClr = widgetData?.headingBackgroundColour || '#000000';
  const headingFontClr = widgetData?.headingFontColour || '#000000';
  const widgetHeadingColor = widgetData?.widgetHeadingColor || '#000000';
  const isPaginationReq = widgetData?.isPaginationReq === 'Yes' ? true : false;
  const isIndexNoReq = widgetData?.isIndexNumberRequired === 'Yes' ? true : false;
  const isDataSearchReq = widgetData?.isDataSearchReq === 'Yes' ? true : false;
  const isHeadingFixed = widgetData?.isHeadingFixed === 'Yes' ? true : false;
  const recordPerPage = widgetData?.recordPerPage || 5;
  const scrollHeight = widgetData?.scrollYValue || "500";
  const isDirectDownloadRequired = widgetData?.isDirectDownloadRequired || 'No';
  const isActionButtonReq = widgetData?.isActionButtonReq || 'No';
  const paramsData = widgetData.selFilterIds || "";
  const footerText = widgetData.footerText || "";
  const widgetTopMargin = widgetData.widgetTopMargin || "";
  const initialRecord = widgetData?.initialRecordNo;
  const finalRecord = widgetData?.finalRecordNo;

  const widgetLimit = widgetData?.limitHTMLFromDb || ''
  const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || ''
  const parsedLimit = parseInt(defLimit, 10);
  const safeLimit = parsedLimit ? parsedLimit : '';

  const mainQuery = widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : ''

  const customMessage = widgetData?.customMessage || "";


  const onDrillDown = (pkCol) => {
    if (isChildPresent && childId) {
      setPkColumn(pkCol)
      setCurrentLevel(currentLevel + 1)
      const widgetDetail = presentWidgets?.length > 0 && presentWidgets?.filter(dt => dt?.rptId == childId)[0]
      setWidgetData(widgetDetail)
      setLevelData(prevLevelData => [
        ...prevLevelData,
        {
          'rptId': widgetDetail?.rptId,
          'rptName': widgetDetail?.rptName,
          'rptLevel': currentLevel + 1,
          'pkclm': pkCol
        }
      ]);
    } else {
      ToastAlert('No child available', 'warning')
    }
  }


  const backToParentWidget = (id) => {
    if (levelData?.length > 1 && currentLevel !== 0) {
      let targetLevel = null;
      let widgetDetail = null;
      let pkClm = '';

      if (id) {
        const targetItem = levelData.find(dt => dt.rptId === id);
        pkClm = targetItem?.pkclm
        if (targetItem) {
          targetLevel = targetItem.rptLevel;
          widgetDetail = presentWidgets?.find(dt => dt?.rptId == id);
        }
      } else {
        targetLevel = currentLevel - 1;
        const parentItem = levelData.find(dt => dt.rptLevel === targetLevel);
        pkClm = parentItem?.pkclm
        widgetDetail = presentWidgets?.find(dt => dt?.rptId == parentItem?.rptId);
      }

      if (widgetDetail && targetLevel !== null) {
        setWidgetData(widgetDetail);
        setCurrentLevel(targetLevel);
        setPkColumn(pkClm)
        const restLevels = levelData.filter(dt => dt.rptLevel <= targetLevel);
        setLevelData(restLevels);
      }
    }
  }

  return (
    <>
      {/* {currentLevel == 0 && */}
      <div className={`tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border ${borderReq === 'No' ? '' : 'tabular-box-border'}`} style={{ border: `1px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>


        <div className="row px-2 py-2 border-bottom" style={{ textAlign: headingAlign, color: widgetHeadingColor }} >
          {headingReq &&
            <div className={` ${isActionButtonReq === 'Yes' || currentLevel !== 0 ? 'col-md-7' : 'col-md-12'} fw-medium fs-6`} >{dt(widgetData?.rptName)}</div>
          }

          <div className="col-md-5">
            {isActionButtonReq === 'Yes' && (<>
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
                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => generatePDF(widgetData, widgetLimit ? filterData.slice(0, parseInt(widgetLimit)) : safeLimit ? filterData.slice(0, safeLimit) : filterData, singleConfigData?.databaseConfigVO)} title="pdf">
                  <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon me-2" />{dt('Download PDF')}
                </li>
                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => generateCSV(widgetData, widgetLimit ? filterData.slice(0, parseInt(widgetLimit)) : safeLimit ? filterData.slice(0, safeLimit) : filterData, singleConfigData?.databaseConfigVO)}>
                  <FontAwesomeIcon icon={faFileExcel} className="dropdown-gear-icon me-2" />{dt('Download CSV')}
                </li>
                {/* <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faBarChart} className="dropdown-gear-icon me-2" />Outliers
              </li> */}
              </ul>

              <button className="small-box-btn-dwn" onClick={() => generatePDF(widgetData, filterData, singleConfigData?.databaseConfigVO)} title="PDF">
                <FontAwesomeIcon icon={faFilePdf} />
              </button>

              <button className="small-box-btn-dwn" onClick={() => generateCSV(widgetData, filterData, singleConfigData?.databaseConfigVO)}>
                <FontAwesomeIcon icon={faFileExcel} />
              </button>
            </>)}

            {currentLevel !== 0 && (
              <>
                <button className="small-box-btn-dwn" onClick={() => backToParentWidget()}>
                  <FontAwesomeIcon icon={faArrowCircleLeft} />
                </button>

                <div className="nav-item dropdown" >
                  <button className="small-box-btn-dwn nav-link" data-bs-toggle="dropdown">
                    <FontAwesomeIcon icon={faTableCells} />
                  </button>

                  <ul className="dropdown-menu dropdown-menu-start" >
                    {levelData?.length > 0 && levelData
                      ?.filter((level, index) => {
                        const maxLevel = Math.max(...levelData.map(l => l.rptLevel));
                        return level.rptLevel !== maxLevel;
                      })
                      ?.map((level, index) => (
                        <li className="dropdown-item pointer text-primary p-1" style={{ whiteSpace: "normal", wordBreak: "break-word" }} key={index} onClick={() => backToParentWidget(level?.rptId)}>
                          {level?.rptName}
                        </li>
                      ))}
                  </ul>
                </div>
              </>
            )}

          </div>


        </div>
        {paramsData && (
          <div className='parameter-box py-1'>
            <Parameters params={paramsData} scope={'widgetParams'} widgetId={widgetData?.rptId} />
          </div>
        )}
        <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>
          <h4 style={{ fontWeight: "500", fontSize: "20px" }}>{dt('Query')} : {widgetData?.rptId}</h4>
          {(widgetData?.modeOfQuery === 'Query' && isPrev == 1) &&
            <span>{mainQuery}</span>
          }
          {(widgetData?.modeOfQuery === "Procedure" && isPrev == 1) &&
            <span>{widgetData?.procedureMode}</span>
          }
          {isDataSearchReq &&
            <div className="d-flex align-items-center">
              <label className="col-form-label me-2">{dt('Search')} :</label>
              <div className=''>
                <InputField
                  type="search"
                  id="customMsgForNoData"
                  name="customMsgForNoData"
                  placeholder="Enter"
                  className={`${theme === 'Dark' ? 'backcolorinput-dark' : 'backcolorinput'}`}
                  onChange={(e) => { setSearchInput(e?.target?.value); }}
                />
              </div>
            </div>
          }
        </div>

        {fetching

          ?
          <>
            <h6 className="text-center">{dt('Data Fetching')}...</h6>
          </>

          :
          <Tabular
            columns={columns}
            data={widgetLimit ? filterData?.slice(0, parseInt(widgetLimit)) : safeLimit ? filterData?.slice(0, safeLimit) : filterData}
            pagination={isPaginationReq}
            recordsPerPage={recordPerPage}
            fixedHeader={isHeadingFixed}
            scrollHeight={scrollHeight}
            headingFontColor={headingFontClr || "#ffffff"}
            headingBgColor={headingBgClr || "#000000"}
            headingAlignment={headingAlignTable}
            recordsPerPageOptions={[recordPerPage, 10, 20, 50]}
            isTableHeadingRequired={!headingReq}
            theme={theme}
            noDataComponent={<div className="text-danger fw-bold fs-13">{dt(customMessage || "There are no records to display")}</div>}
          />

        }

        {footerText && footerText.trim() !== '' && (
          <>
            <h6 className='header-devider mt-2 mb-0'></h6>
            <div className="px-2 py-2">
              <span style={{ fontSize: '12px' }}>{footerText}</span>
            </div>
          </>
        )}

      </div>

      {(popupConfig && showPopUpWidget) && (
        <PopUpWidget {...{ showPopUpWidget, popupConfig, closePopup }} />
      )}
    </>
  );
};
export default TabularDash;

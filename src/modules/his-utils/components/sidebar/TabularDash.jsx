import React, { lazy, useContext, useEffect, useRef, useState } from "react";
import Tabular from "./Tabular";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faCog, faFileExcel, faFilePdf, faPrint, faRefresh, faSliders, faSortAmountDesc, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { fetchProcedureData, fetchQueryData, formatDateFullYear, formatParams, getDisplayQuery, getOrderedParamValues, getWidgetParametersOnly, ToastAlert } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import InputField from "../commons/InputField";
import { generateCSV, generateCSVWorkers, generatePDF, generatePDFWorkers } from "../commons/advancedPdf";
import { getAuthUserData } from "../../../../utils/CommonFunction";
import { useSearchParams } from "react-router-dom";
import PopUpWidget from "./PopUpWidget";
import { fetchPostData } from "../../../../utils/HisApiHooks";
import AdvancedOptionsModal from "./AdvancedOptionsModal";
import PrintComponent from "./PrintComponent";
import { createRoot } from "react-dom/client";
import { AdvancedbtnSvg, ArrowCircleLeftbtnSvg, CsvBtnSvg, ExcelBtnSvg, PdfbtnSvg, PrintbtnSvg, RefreshbtnSvg, SettingbtnSvg, TableCellsbtnSvg } from "../../utils/commonSVG";
import HighchartsGrid from "./HighchartsGrid";


const Parameters = lazy(() => import('./Parameters'));

const TabularDash = (props) => {

  const { widgetData, setWidgetData, levelData, setLevelData, pkColumn, setPkColumn, isLayoutWithPreview, presentTabs, isPopup, pkConfig } = props;

  const { theme, singleConfigData, paramsValues, presentWidgets, isSearchQuery, setIsSearchQuery, setSearchScope, searchScope, dt, presentTabsDash, setActiveTab, activeTab, setPrevKpiTab, tabParams, syncPkValues, setsyncPkValues, selectedPk, setSelectedPk, allDrpDtParams, setAllDrpDtParams } = useContext(HISContext);


  // const [tableData, setTableData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [searchInput, setSearchInput] = useState({});
  // const [filterData, setFilterData] = useState(tableData)
  const [columns, setColumns] = useState([]);
  const [popupConfig, setPopupConfig] = useState(null);
  const [showPopUpWidget, setShowPopUpWidget] = useState(false);
  const [multipleTables, setMultipleTables] = useState([]);
  const [widgetParams, setWidgetParams] = useState([]);
  // const [allDrpDtParams, setAllDrpDtParams] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [jndiName, setJndiName] = useState('');

  const isInitialSyncLoad = useRef({});
  const paramsValuesRef = useRef(paramsValues);

  const getParametersWithValues = (widgetParams, paramsValues, widgetId, allDrpDtParams) => {
    let allParams = [...widgetParams];

    const tabParamsEntries = Object.entries(paramsValues?.tabParams || {});

    tabParamsEntries.forEach(([id, value]) => {
      const exists = allParams.some(p => String(p.id) === String(id));
      if (!exists) {
        // Find the tab parameter data to get the label
        const tabParamData = tabParams.find(tab => String(tab.id) === String(id));

        allParams.push({
          id: parseInt(id),
          disName: tabParamData?.disName || '',
          paraName: tabParamData?.paraName || '',
          value
        });
      }
    });
    if (isPopup) {
      if (pkConfig?.columnToShow?.length > 0) {
        pkConfig?.columnToShow.forEach((column, colIndex) => {

          const levelParamId = `level_${column.value}_${colIndex}`;

          allParams.push({
            id: levelParamId,
            disName: column.label,
            paraName: column.label,
            value: column.value,
            val: column.value,
            isLevelData: true
          });
        });
      }
    } else {
      levelData.forEach((level, index) => {
        if (level?.columnToShow?.length > 0) {
          level.columnToShow.forEach((column, colIndex) => {
            // Create a unique ID for level data parameters
            const levelParamId = `level_${level.rptId}_${index}_${colIndex}`;

            allParams.push({
              id: levelParamId,
              disName: column.label,
              paraName: column.label,
              value: column.value,
              val: column.value,
              isLevelData: true
            });
          });
        }
      });
    }


    const parentWidgetIds = levelData
      .filter(level => level.rptId != widgetId)
      .map(level => level.rptId);


    return allParams?.map(param => {
      let widgetValue = paramsValues?.widgetParams?.[widgetId]?.[param?.id] || null;

      if (widgetValue === null && parentWidgetIds.length > 0) {
        for (const parentWidgetId of parentWidgetIds) {
          widgetValue = paramsValues?.widgetParams?.[parentWidgetId]?.[param?.id] || null;
          if (widgetValue !== null) break;
        }
      }

      const tabValue = paramsValues?.tabParams?.[param?.id] || param?.value || null;
      const value = widgetValue ?? tabValue ?? null;

      const valOptions = allDrpDtParams?.[param?.paraName] || [];
      const matchedOption = valOptions.find(dt => dt?.optionValue == value);

      return {
        ...param,
        value,
        val: matchedOption
          ? matchedOption.optionText
          : value == "%" ? "All" : value
      };
    });
  };

  const widgetOnlyParams = getWidgetParametersOnly(
    widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams, levelData
  );


  const [queryParams] = useSearchParams();
  const isPrev = queryParams.get('isPreview');
  const isGlobal = queryParams.get("isGlobal") || 0;

  // const encIFUrl = queryParams.get("dbfhttf");
  // const isPrev = encIFUrl ? getEncryptedParamValue(encIFUrl, "isPreview") : '';

  const isChildPresent = widgetData?.children && widgetData?.children?.length > 0;
  const childId = widgetData?.children?.length > 0 ? widgetData?.children[0] : '';
  const isFirstRowHeading = widgetData?.isFirstRowColumnName || 'No';
  const widheight = presentTabs?.length > 0 && presentTabs?.filter(dt => dt?.rptId == widgetData?.rptId)[0]?.widgetHeight;
  const isSynchronized = widgetData?.synchronizedWidgetRptId !== "" && widgetData?.synchronizedWidgetRptId !== undefined;


  // FOR SUBHEADING
  const formatData = (rawData = [], isFirstRowHeading) => {
    if (!rawData || rawData.length === 0) {
      return { columns: [], data: [] };
    }

    if (isFirstRowHeading === 'Yes') {
      const headerRow = rawData[0];
      const dataRows = rawData.slice(1);

      const headers = [];
      let isH2 = false;
      Object.entries(headerRow).forEach(([key, value]) => {
        if (key === 'sno' || !value.includes('#h2#')) {
          headers.push({ name: key === 'sno' ? 'sno' : value, subHeaders: [] });
        } else if (typeof value === 'string' && value.includes('#h2#')) {
          const [mainHeader, subHeadersString] = value.split('#h2#');
          const subHeaders = subHeadersString.split(',');
          headers.push({ name: mainHeader, subHeaders: subHeaders?.map(s => s.trim()) });
          isH2 = true
        }
      });

      const formattedData = dataRows?.map((item) => {
        const formattedItem = {};
        let headerIndex = 0;

        Object.entries(item).forEach(([key, value]) => {
          if (key === 'sno' || !value.includes('#d#')) {
            formattedItem[headers[headerIndex].name] = value;
            headerIndex++;
          } else if (typeof value === 'string' && value.includes('#d#')) {
            const values = value.split('#d#');
            headers[headerIndex].subHeaders.forEach((subHeader, subIndex) => {
              const fullColumnKey = `${headers[headerIndex].name}_${subHeader}`;
              formattedItem[fullColumnKey] = values[subIndex];
            });
            headerIndex++;
          } else {
            const formattedKey = key.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
            formattedItem[formattedKey] = value;
          }
        });
        return formattedItem;
      });

      return { headers, datafor: formattedData, isH2 };
    } else {
      // This logic handles the case where there is no multi-level header
      const formattedData = rawData?.length > 0 && rawData?.map((item) => {
        const formattedItem = {};
        Object.entries(item).forEach(([key, value]) => {
          const formattedKey = key.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          formattedItem[formattedKey] = value;
        });
        return formattedItem;
      });

      return { headers: null, datafor: formattedData, isMultiLevel: false };
    }
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

  const openPopUpWidget = (value, clmtoshow) => {
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
      if (config?.drillDownType === "Tab") {
        const tabdt = presentTabsDash?.filter(tab => tab?.jsonData?.dashboardId == config?.drillTabId)
        if (tabdt?.length > 0) {
          setActiveTab(tabdt[0]);
          // setPrevKpiTab(prev => [...prev, activeTab]);
          setPrevKpiTab(prev => [...prev, {
            ...activeTab,
            pkVal: pkColumn || ""
          }]);
          setPkColumn(pkValue);
        } else {
          ToastAlert('Tab Not Found', 'warning');
        }

      } else {
        setPopupConfig({
          widgetId: config.popupWidgetId,
          pkValue: pkValue,
          title: config.titleMsg,
          mode: config.modeForOpeningPopup,
          widgetName: config?.drillWidgetName,
          columnToShow: clmtoshow ? clmtoshow : []
        });
        setShowPopUpWidget(true);
      }

    } catch (error) {
      console.error('Error opening popup:', error);
      setShowPopUpWidget(false);
    }
  };

  const closePopup = () => {
    setPopupConfig(null);
    setShowPopUpWidget(false);
  };

  // const FtpClicked = async (e) => {
  //   e.preventDefault();
  //   const tag = e.target;

  //   if (tag.tagName !== 'A') {
  //     ToastAlert("Invalid FTP link.", 'error');
  //     return;
  //   }

  //   const remoteUrl = tag.getAttribute('data-url');
  //   const fileName = tag.getAttribute('data-filename');

  //   const val = {
  //     "remoteUrl": remoteUrl,
  //     "fileName": fileName
  //   }

  //   fetchPostData(`/hisutils/ftp/view?isGlobal=${isGlobal || 0}`, val, { responseType: 'blob' }).then(async (data) => {
  //     if (data) {

  //       // const contentType = data.headers['content-type'] || data.data.type;

  //       // if (contentType.includes('application/pdf')) {

  //       const pdfBlob = new Blob([data?.data], { type: 'application/pdf' });
  //       const pdfUrl = URL.createObjectURL(pdfBlob);
  //       window.open(pdfUrl, '_blank');

  //       // } else if (contentType.includes('text/plain')) {

  //       //   const text = await data.data.text();
  //       //   const doc = new jsPDF();
  //       //   doc.text(text?.trim(), 10, 10);
  //       //   const pdfUrl = URL.createObjectURL(doc.output('blob'));

  //       //   const pdfWindow = window.open(pdfUrl);
  //       //   if (!pdfWindow) {
  //       //     const a = document.createElement('a');
  //       //     a.href = pdfUrl;
  //       //     a.download = 'converted.pdf';
  //       //     a.click();
  //       //   }
  //       //   setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
  //       // }
  //       // else {
  //       //   ToastAlert(`Unsupported file type: ${contentType}`, 'error');
  //       // }
  //     } else {
  //       ToastAlert("Internal Error", 'error')
  //     }
  //   })
  // }

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
      remoteUrl,
      fileName
    };
    try {
      const response = await fetchPostData(
        `/hisutils/ftp/view?isGlobal=${isGlobal || 0}`,
        val,
        { responseType: 'blob' }
      );

      if (!response || !response.data) {
        ToastAlert("Internal Error", 'error');
        return;
      }
      // GET CONTENT TYPE
      const contentType =
        response.headers['content-type'] ||
        response.data.type ||
        'application/octet-stream';
      // CREATE DYNAMIC BLOB
      const fileBlob = new Blob([response.data], {
        type: contentType
      });
      // CREATE URL
      const fileUrl = URL.createObjectURL(fileBlob);
      // FILE EXTENSION
      const extension = fileName?.split('.').pop()?.toLowerCase();
      // FILES THAT CAN OPEN IN BROWSER
      const previewableTypes = [
        'pdf',
        'png',
        'jpg',
        'jpeg',
        'gif',
        'webp',
        'mp4',
        'txt'
      ];

      // OPEN IN NEW TAB
      if (previewableTypes.includes(extension)) {
        window.open(fileUrl, '_blank');
      } else {
        // FORCE DOWNLOAD
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      // CLEANUP MEMORY
      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (error) {
      console.error(error);
      ToastAlert("Unable to open file", 'error');
    }
  };


  const handleSyncChange = (pkValue, srcwidgetId, widgetList) => {
    if (!pkValue) {
      console.warn(" pkValue is empty");
      return;
    }

    widgetList.forEach((targetId) => {
      setsyncPkValues(prev => ({ ...prev, [targetId]: pkValue }))

    });
  };

  useEffect(() => {
    if (!isSynchronized) return;

    const handler = (e) => {
      if (e.target.classList.contains("sync-btn")) {

        const row = e.target.closest("span");
        if (!row) return;

        const syncClass = Array.from(row.classList)
          .find(cls => cls.startsWith("syncRow^"));
        const parts = syncClass.split("^");

        const syncwidgetIds = parts[2] ? parts[2].split(",") : [];
        const srcwidgetId = parts[1];
        const pkVal = parts[3];

        setSelectedPk(prev => ({ ...prev, [srcwidgetId]: pkVal }));
        if (!pkVal) {
          console.warn(" pkcolumn missing");
          return;
        }
        if (handleSyncChange) {
          handleSyncChange(pkVal, srcwidgetId, syncwidgetIds);
        }
      }
    };

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, [isSynchronized, multipleTables, widgetData]);

  useEffect(() => {
    // no table data
    if (!multipleTables?.length) return;

    // no widget
    if (!widgetData) return;

    // not synchronized
    const isSyncWidget =
      widgetData?.synchronizedWidgetRptId &&
      widgetData?.synchronizedWidgetRptId !== "";

    if (!isSyncWidget) return;

    // already initialized
    if (isInitialSyncLoad.current?.[widgetData?.rptId]) {
      return;
    }

    // first table
    const firstTable = multipleTables?.[0];

    // no rows
    if (!firstTable?.data?.length) return;

    // first row pk
    const firstPk = firstTable?.data?.[0]?.pkcolumn;

    if (!firstPk) return;
    setSelectedPk(prev => ({
      ...prev,
      [widgetData?.rptId]: firstPk
    }));

    // target widgets
    const widgetList =
      widgetData?.synchronizedWidgetRptId?.split(",") || [];

    // sync reload
    widgetList.forEach((targetId) => {

      setsyncPkValues(prev => ({
        ...prev,
        [targetId]: firstPk
      }));

    });

    // prevent rerun
    isInitialSyncLoad.current[widgetData?.rptId] = true;

  }, [multipleTables]);

  const getFirstValue = (val) => {
    return typeof val === 'string' && val.includes('##') ? val.split('##')[0] : val;
  };

  const isHTML = (str) => {
    const pattern = /<\/?[a-z][\s\S]*>/i;
    return pattern.test(str);
  }

  const stripHtml = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '').trim();
  };

  const generateColumns = (data, ifDrill = isChildPresent, isFirstRowHeading, headers, isH2, mainIndex) => {
    if (!data || data.length === 0) return [];

    const allKeys = data.length ? Object.keys(data[0]).filter(key => key !== 'pkcolumn') : [];
    const snoKey = allKeys.find(k => /^sno$/i.test(k));
    const stateKey = allKeys.find(k => /state/i.test(k));


    const isDateString = (value) => typeof value === 'string' && /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(value.trim());
    const dateColumns = new Set();
    for (let i = 0; i < Math.min(5, data.length); i++) {
      const row = data[i];
      allKeys.forEach(key => {
        const value = getFirstValue(row[key]);
        if (isDateString(value)) dateColumns.add(key);
      });
    }

    if (isFirstRowHeading === 'Yes') {

      const reorderedHeaders = [];

      if (snoKey) {
        const snoHeader = headers.find(h => h.name.toLowerCase() === snoKey.toLowerCase());
        if (snoHeader) reorderedHeaders.push(snoHeader);
      }

      if (stateKey) {
        const stateHeader = headers.find(h => h.name.toLowerCase() === stateKey.toLowerCase());
        if (stateHeader && !reorderedHeaders.includes(stateHeader)) reorderedHeaders.push(stateHeader);
      }

      headers.forEach(h => {
        if (!reorderedHeaders.includes(h)) {
          reorderedHeaders.push(h);
        }
      });

      const columns = [];
      const mainHeaders = [];

      reorderedHeaders.forEach(header => {
        if (header.subHeaders.length === 1 && header.subHeaders[0] === header.name) {
          mainHeaders.push({ name: header.name, subHeaders: 1, isSingle: true });

          columns.push({
            name: ' ',
            mainHeader: header?.name,
            selector: row => row[header.name] || '-',
            sortable: true,
            wrap: true,
            sortFunction: dateColumns.has(header.name)
              ? (rowA, rowB) => new Date(getFirstValue(rowA[header.name])) - new Date(getFirstValue(rowB[header.name]))
              : undefined,
            cell: (row) => {
              const value = row[header.name];
              if (value && typeof value === 'object' && !Array.isArray(value)) return null;

              const displayValue = getFirstValue(value);

              if (typeof value === 'string' && value.includes('<a') &&
                (
                  value.includes('class="ftp"') ||
                  value.includes('data-isSFTP=')
                )
              ) {
                return (
                  <span
                    className="pointer"
                    dangerouslySetInnerHTML={{ __html: value }}
                    onClick={(e) => FtpClicked(e, value)}
                  />
                );
              }

              if (typeof value === 'string' && (value.trim().startsWith('<a') || value.trim().startsWith('<div') || isHTML(value.trim()))) {
                return <span dangerouslySetInnerHTML={{ __html: value }} />;
              }

              return typeof value === 'string' && value.includes("##") ? (
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => openPopUpWidget(value)}>{displayValue}</span>
              ) : (
                <span>{displayValue}</span>
              );
            }
          });

        } else if (header.subHeaders.length === 1 && header.subHeaders[0] !== header.name) {
          mainHeaders.push({ name: header.name, subHeaders: 1, isSingle: header?.name === 'sno' });
          const key = header.subHeaders[0];

          columns.push({
            name: header?.name !== 'sno' ? key : '',
            title: (<span title={key}>{header?.name !== 'sno' ? key : ''}</span>),
            mainHeader: header?.name,
            selector: row => row[key] || '-',
            sortable: true,
            wrap: true,
            sortFunction: dateColumns.has(key)
              ? (rowA, rowB) => new Date(getFirstValue(rowA[key])) - new Date(getFirstValue(rowB[key]))
              : undefined,
            cell: (row) => {
              const value = row[key];
              if (value && typeof value === 'object' && !Array.isArray(value)) return null;

              const displayValue = getFirstValue(value);

              if (typeof value === 'string' && value.includes('<a') &&
                (
                  value.includes('class="ftp"') ||
                  value.includes('data-isSFTP=')
                )
              ) {
                return (
                  <span
                    className="pointer"
                    dangerouslySetInnerHTML={{ __html: value }}
                    onClick={(e) => FtpClicked(e, value)}
                  />
                );
              }

              if (typeof value === 'string' && (value.trim().startsWith('<a') || value.trim().startsWith('<div') || isHTML(value.trim()))) {
                return <span dangerouslySetInnerHTML={{ __html: value }} />;
              }

              return typeof value === 'string' && value.includes("##") ? (
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => openPopUpWidget(value)}>{displayValue}</span>
              ) : (
                <span>{displayValue}</span>
              );
            }
          });

        } else if (header.subHeaders.length === 0) {
          if (isH2) {
            mainHeaders.push({ name: header.name, subHeaders: 1, isSingle: true });
            const key = header.name;
            columns.push({
              name: ' ',
              mainHeader: header?.name,
              selector: row => row[header.name] || '-',
              sortable: true,
              wrap: true,
              sortFunction: dateColumns.has(key)
                ? (rowA, rowB) => new Date(getFirstValue(rowA[key])) - new Date(getFirstValue(rowB[key]))
                : undefined,
              cell: (row) => {
                const value = row[key];
                if (value && typeof value === 'object' && !Array.isArray(value)) return null;

                const displayValue = getFirstValue(value);

                if (typeof value === 'string' && value.includes('<a') &&
                  (
                    value.includes('class="ftp"') ||
                    value.includes('data-isSFTP=')
                  )
                ) {
                  return (
                    <span
                      className="pointer"
                      dangerouslySetInnerHTML={{ __html: value }}
                      onClick={(e) => FtpClicked(e, value)}
                    />
                  );
                }

                if (typeof value === 'string' && (value.trim().startsWith('<a') || value.trim().startsWith('<div') || isHTML(value.trim()))) {
                  return <span dangerouslySetInnerHTML={{ __html: value }} />;
                }

                return typeof value === 'string' && value.includes("##") ? (
                  <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => openPopUpWidget(value)}>{displayValue}</span>
                ) : (
                  <span>{displayValue}</span>
                );
              }
            });
          } else {
            const key = header.name;
            columns.push({
              name: header?.name,
              title: (<span title={header?.name}>{header?.name}</span>),
              mainHeader: header?.name,
              selector: row => row[header.name] || '-',
              sortable: true,
              wrap: true,
              sortFunction: dateColumns.has(key)
                ? (rowA, rowB) => new Date(getFirstValue(rowA[key])) - new Date(getFirstValue(rowB[key]))
                : undefined,
              cell: (row) => {
                const value = row[key];
                if (value && typeof value === 'object' && !Array.isArray(value)) return null;

                const displayValue = getFirstValue(value);

                if (typeof value === 'string' && value.includes('<a') &&
                  (
                    value.includes('class="ftp"') ||
                    value.includes('data-isSFTP=')
                  )
                ) {
                  return (
                    <span
                      className="pointer"
                      dangerouslySetInnerHTML={{ __html: value }}
                      onClick={(e) => FtpClicked(e, value)}
                    />
                  );
                }

                if (typeof value === 'string' && (value.trim().startsWith('<a') || value.trim().startsWith('<div') || isHTML(value.trim()))) {
                  return <span dangerouslySetInnerHTML={{ __html: value }} />;
                }

                return typeof value === 'string' && value.includes("##") ? (
                  <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => openPopUpWidget(value)}>{displayValue}</span>
                ) : (
                  <span>{displayValue}</span>
                );
              }
            });

          }
        } else {
          mainHeaders.push({ name: header.name, subHeaders: header.subHeaders.length });
          header.subHeaders.forEach(subHeader => {
            const fullKey = `${header.name}_${subHeader}`;
            columns.push({
              name: subHeader,
              title: (<span title={subHeader}>{subHeader}</span>),
              mainHeader: header?.name,
              selector: row => row[fullKey] || '-',
              sortable: true,
              wrap: true,
              sortFunction: dateColumns.has(fullKey)
                ? (rowA, rowB) => new Date(getFirstValue(rowA[fullKey])) - new Date(getFirstValue(rowB[fullKey]))
                : undefined,
              cell: (row) => {
                const value = row[fullKey];
                if (value && typeof value === 'object' && !Array.isArray(value)) return null;

                const displayValue = getFirstValue(value);

                if (typeof value === 'string' && value.includes('<a') &&
                  (
                    value.includes('class="ftp"') ||
                    value.includes('data-isSFTP=')
                  )
                ) {
                  return (
                    <span
                      className="pointer"
                      dangerouslySetInnerHTML={{ __html: value }}
                      onClick={(e) => FtpClicked(e, value)}
                    />
                  );
                }

                if (typeof value === 'string' && (value.trim().startsWith('<a') || value.trim().startsWith('<div') || isHTML(value.trim()))) {
                  return <span dangerouslySetInnerHTML={{ __html: value }} />;
                }

                return typeof value === 'string' && value.includes("##") ? (
                  <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => openPopUpWidget(value)}>{displayValue}</span>
                ) : (
                  <span>{displayValue}</span>
                );
              }
            });
          });
        }
      });

      // Add Drill column to start
      if (ifDrill) {
        columns.unshift({
          name: "Action",
          cell: (row) => (
            <button className="rounded-4 border-1" onClick={() => onDrillDown(row?.pkcolumn)}>
              <FontAwesomeIcon icon={faSortAmountDesc} />
            </button>
          )
        });
      }

      return { columns, mainHeaders };
    }

    else {

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

      // Helper function to detect date strings in format "23-Jul-2025"
      const isDateString = (value) => {
        if (typeof value !== 'string') return false;
        return /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(value.trim());
      };

      // Check which columns contain date values
      const dateColumns = new Set();
      if (data.length > 0) {
        // Sample first 5 rows to detect date columns
        for (let i = 0; i < Math.min(5, data.length); i++) {
          const row = data[i];
          reorderedKeys.forEach(key => {
            const value = getFirstValue(row[key]);
            if (isDateString(value)) {
              dateColumns.add(key);
            }
          });
        }
      }
      const formatSettings = widgetData?.mpFormatColumn?.[mainIndex]?.lstFormatColumn || [];
      const clmtoshowno = widgetData?.parentDisplaycolumnno || '1';
      const columnNumbers = clmtoshowno.split(',').map(num => parseInt(num.trim()));

      const drillData = columnNumbers.map(num => {
        const columnKey = reorderedKeys[num - 1];
        return {
          label: columnKey,
          value: columnKey
        };
      }).filter(item => item.label);

      const dynamicColumns = reorderedKeys?.map((key, index) => {
        const isDateColumn = dateColumns.has(key);

        // Find corresponding format by columnNo
        const format = formatSettings.find(f => parseInt(f.columnNo) === index + 1);

        const align = format?.columnAlignment || 'Left';
        const widthPercent = format?.columnWidth ? `${format.columnWidth}%` : undefined;

        return {
          name: key,
          title: (<span style={{ overflowWrap: "anywhere" }} title={key}>{key}</span>),
          selector: row => getFirstValue(row[key]),
          sortable: true,
          wrap: true,
          // width: /^sno$/i.test(key) ? '8%' : undefined,
          width: widthPercent || (/^sno$/i.test(key) ? '8%' : undefined),
          center: align.toLowerCase() === 'center' ? true : false,
          right: align.toLowerCase() === 'right' ? true : false,

          // Add custom sort function for date columns
          sortFunction: isDateColumn ? (rowA, rowB) => {
            const dateA = new Date(getFirstValue(rowA[key]));
            const dateB = new Date(getFirstValue(rowB[key]));
            return dateA - dateB;
          } : undefined,
          cell: (row) => {
            const value = row[key];
            const drillDownData = drillData.map(item => ({
              label: item.label,
              value: getFirstValue(row[item.value])
            }));
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              return null;
            }
            const displayValue = getFirstValue(value);

            if (typeof value === 'string' && value.includes('<a') && (value.includes('class="ftp"') || value.includes('data-isSFTP='))) {
              return (
                <span className="pointer" dangerouslySetInnerHTML={{ __html: value }} onClick={(e) => FtpClicked(e, value)} />
              );
            }

            if (typeof value === 'string' && !value.includes("##") && (value.trim().startsWith('<a') || value.trim().startsWith('<div') || isHTML(value.trim()))) {
              return (
                <span
                  dangerouslySetInnerHTML={{ __html: getFirstValue(value) }}
                  style={{ textAlign: align.toLowerCase() }}
                />
              );
            }

            return typeof value === 'string' && value.includes("##") ? (
              <span
                style={{ color: 'blue', cursor: 'pointer', textAlign: align.toLowerCase() }}
                onClick={() => openPopUpWidget(value, drillDownData)}
              >
                {!isHTML(value.trim()) ? displayValue : <span
                  dangerouslySetInnerHTML={{ __html: getFirstValue(value) }}
                  style={{ textAlign: align.toLowerCase() }}
                />}
              </span>
            ) :
              (
                <span style={{ textAlign: align.toLowerCase(), display: 'block' }}>{displayValue}</span>
              );
          }
        };
      });

      if (ifDrill) {
        const drillColumn = {
          name: "Action",
          cell: (row) => {
            // Create an array of values for all drill columns

            const drillDownData = drillData.map(item => ({
              label: item.label,
              value: getFirstValue(row[item.value])
            }));

            return (
              <button
                className="rounded-4 border-1"
                onClick={() => onDrillDown(row?.pkcolumn, drillDownData)}
              >
                <FontAwesomeIcon icon={faSortAmountDesc} />
              </button>
            );
          }
        };
        return [drillColumn, ...dynamicColumns];
      }

      return dynamicColumns;
    }
  };

  const addSyncColumn = (columns, widget) => {

    const isSyncWidget =
      widget?.synchronizedWidgetRptId &&
      widget?.synchronizedWidgetRptId !== "";

    if (!isSyncWidget) return columns;

    const syncColumn = {
      name: "Select",
      width: "70px",
      center: true,

      cell: (row) => {

        const isSelected =
          selectedPk?.[widget?.rptId] == row?.pkcolumn;

        return (
          <input
            key={`${widgetData?.rptId}-${selectedPk?.[widgetData?.rptId]}`}
            type="radio"
            name={`sync-radio-${widgetData?.rptId}`}
            onChange={() => {
              setSelectedPk(prev => ({
                ...prev,
                [widgetData?.rptId]: row?.pkcolumn
              }));

              if (handleSyncChange) {

                const syncwidgetIds =
                  widgetData?.synchronizedWidgetRptId?.split(",") || [];

                handleSyncChange(
                  row?.pkcolumn,
                  widgetData?.rptId,
                  syncwidgetIds
                );
              }
            }}
          />
        );
      }
    };

    return [syncColumn, ...columns];
  };

  const fetchData = async (widget, isRef, syncPk) => {
    if (widget?.modeOfQuery === "Procedure") {
      if (!widget?.procedureMode) return;
      try {
        setFetching(true);
        setStatusMessage("Requesting...")
        const paramVal = formatParams(paramsValues ? paramsValues : null, widgetData?.rptId || '', tabParams);
        const params = [
          getAuthUserData('hospitalCode')?.toString(), //hospital code===
          "10001", //user id===
          syncPk ? syncPk?.toString() : pkColumn ? pkColumn?.toString() : '', //primary key
          paramVal.paramsId || "", //parameter ids
          paramVal.paramsValue || "", //parameter values
          isPaginationReq?.toString(), //is pagination required===
          initialRecord?.toString(), //initial record no.===
          finalRecord?.toString(), //final record no.===
          "", //date options
          formatDateFullYear(new Date()),//from values
          formatDateFullYear(new Date()) // to values
        ]
        setStatusMessage("Executing Query...")
        const response = await fetchProcedureData(widget?.procedureMode, params, widget?.JNDIid, null, isGlobal, setJndiName);
        // if (response?.data?.length > 0) {
        setStatusMessage("Prepairing Data...")
        let filteredData = response.data;

        if (widget?.isQuerychild && widget?.isQuerychild === "1") {
          const columnIndexes = widget?.columnIndexesParent || [];
          const keys = Object.keys(data[0]);
          filteredData = response?.data?.map(row => {
            const filteredRow = {};
            columnIndexes.forEach(idx => {
              const key = keys[idx];
              if (key) filteredRow[key] = row[key];
            });
            return filteredRow;
          });
        }

        if (widget?.isFirstRowColumnName === 'Yes') {
          const { headers, datafor, isH2 } = formatData(filteredData, widget?.isFirstRowColumnName);
          const { columns, mainHeaders } = generateColumns(datafor, isChildPresent, widget?.isFirstRowColumnName, headers, isH2);
          setMultipleTables([{ columns, mainHeaders, data: datafor, queryObj: response?.query }])

        } else {
          const { datafor } = formatData(filteredData, widget?.isFirstRowColumnName);
          let columns = generateColumns(datafor, isChildPresent, widget?.isFirstRowColumnName);
          columns = addSyncColumn(columns, widget);
          setMultipleTables([{ columns, mainHeaders: [], data: datafor, queryObj: response?.query }])
        }

        setIsSearchQuery(false);
        setFetching(false);
        setStatusMessage('')
        // setTimeout(() => setFetching(false), 500);
      } catch (error) {
        console.error("Error loading query data:", error);
        setFetching(false);
        setIsSearchQuery(false)
        setStatusMessage('')
      }
    } else {
      if (!widget?.queryVO?.length > 0) return;
      try {
        setFetching(true);
        setStatusMessage("Requesting...")
        const allQueryResults = await Promise.allSettled(
          widget.queryVO?.map(async (queryObj) => {
            const params = getOrderedParamValues(queryObj?.mainQuery, isRef ? paramsValuesRef.current : paramsValues, widget?.rptId);
            setStatusMessage("Executing Query...")
            const data = await fetchQueryData([queryObj], widget?.JNDIid, params, syncPk ? syncPk : pkColumn, isGlobal, setJndiName);
            return { queryObj, data };
          })
        );
        setStatusMessage("Prepairing Data...")
        // Format results for each query
        // const processedTables = allQueryResults?.map(({ queryObj, data }, index) => {
        const processedTables = allQueryResults
          .filter(r => r.status === "fulfilled" && r.value)
          .map(({ value }, index) => {
            const { queryObj, data } = value;
            let filteredData = data;

            if (widget?.isQuerychild === "1") {
              const columnIndexes = widget?.columnIndexesParent || [];
              const keys = Object.keys(data[0] || {});
              filteredData = data?.map(row => {
                const filteredRow = {};
                columnIndexes.forEach(idx => {
                  const key = keys[idx];
                  if (key) filteredRow[key] = row[key];
                });
                return filteredRow;
              });
            }

            if (widget?.isFirstRowColumnName === 'Yes') {
              const { headers, datafor, isH2 } = formatData(filteredData, widget?.isFirstRowColumnName);
              const { columns, mainHeaders } = generateColumns(datafor, isChildPresent, widget?.isFirstRowColumnName, headers, isH2, index);
              let column = columns;
              column = addSyncColumn(columns, widget);
              return { columns: column, mainHeaders, data: datafor, queryObj };
            } else {
              const { datafor } = formatData(filteredData, widget?.isFirstRowColumnName);
              let columns = generateColumns(datafor, isChildPresent, widget?.isFirstRowColumnName, null, null, index);
              columns = addSyncColumn(columns, widget);
              return { columns, mainHeaders: [], data: datafor, queryObj };
            }
          });

        if (isSynchronized) {
          const firstPk = processedTables?.length && processedTables[0]?.data[0]?.pkcolumn;
          if (firstPk) {
            const targetIds = widget?.synchronizedWidgetRptId;
            const widgetList = targetIds.split(",");
            widgetList.forEach((targetId) => {
              setSelectedPk(prev => ({ ...prev, [widget?.rptId]: firstPk }));
              setsyncPkValues(prev => ({ ...prev, [targetId]: firstPk }));
            })
          }
        }

        setMultipleTables(processedTables);
        setIsSearchQuery(false);
        setFetching(false);
        setStatusMessage('');
        // setTimeout(() => setFetching(false), 500);

      } catch (error) {
        console.error("Error loading query data:", error);
        setIsSearchQuery(false);
        setFetching(false);
        setStatusMessage('');
      }
    }
  }

  useEffect(() => {
    paramsValuesRef.current = paramsValues;
  }, [paramsValues]);

  useEffect(() => {
    let intervalId;

    if (widgetData && (widgetData?.widgetLoadOption !== "ONGOBUTTONCLICK" || !paramsData)) {

      const refreshTime = widgetData?.widgetRefreshTime || '0';
      // const rowPerPg = widgetData?.recordPerPage || 10;
      const shouldSetInterval = refreshTime && parseInt(refreshTime) > 0;

      const fetchDataWithInterval = async (isRef) => {
        try {
          if (!isSearchQuery) {
            await fetchData(widgetData, isRef);
          }
        } catch (error) {
        }
      };

      fetchDataWithInterval(false);
      if (shouldSetInterval && !intervalId && !fetching) {
        intervalId = setInterval(() => {
          fetchDataWithInterval(true);
        }, parseInt(refreshTime));
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [widgetData]);

  useEffect(() => {
    if (paramsValues?.widgetParams[widgetData?.rptId] && !isSearchQuery && widgetData) {
      fetchData(widgetData);
    }
  }, [paramsValues?.widgetParams[widgetData?.rptId]]);


  useEffect(() => {
    if (searchScope?.scope === "all" && !isSearchQuery && widgetData && searchScope?.scope !== "widgetParams") {
      fetchData(widgetData);
    }
  }, [paramsValues])

  useEffect(() => {
    if (isSearchQuery && searchScope?.scope === "widgetParams" && searchScope?.id == widgetData?.rptId) {
      fetchData(widgetData);
    } else if (isSearchQuery && searchScope?.scope !== "" && searchScope?.scope !== "widgetParams") {
      fetchData(widgetData);
    }
  }, [isSearchQuery]);

  useEffect(() => {
    if (syncPkValues[widgetData?.rptId] && widgetData) {
      fetchData(widgetData, false, syncPkValues[widgetData?.rptId]);
    }
  }, [syncPkValues?.[widgetData?.rptId]]);

  const headingAlign = widgetData?.widgetHeadingAlignment?.toLowerCase() || 'left';
  const headingAlignTable = widgetData?.tableHeadingAlignment === '1' ? 'center' : 'left';
  const borderReq = widgetData?.isWidgetBorderRequired || 'Yes';
  const headingReq = widgetData?.isWidgetNameVisible || "Yes";
  const headingBgClr = widgetData?.headingBackgroundColour || '#000000';
  const headingFontClr = widgetData?.headingFontColour || '#000000';
  const widgetHeadingColor = widgetData?.widgetHeadingColor || '#000000';
  const isPaginationReq = widgetData?.isPaginationReq === 'Yes' ? true : false;
  const isIndexNoReq = widgetData?.isIndexNumberRequired === 'Yes' ? true : false;
  const isDataSearchReq = widgetData?.isDataSearchReq === 'Yes' ? true : false;
  const isHeadingFixed = widgetData?.isHeadingFixed === 'Yes' ? true : false;
  const recordPerPage = widgetData?.recordPerPage || 5;
  const scrollHeight = widgetData?.scrollYValue;
  const isDirectDownloadRequired = widgetData?.isDirectDownloadRequired || 'Yes';
  const isActionButtonReq = widgetData?.isActionButtonReq;
  const paramsData = widgetData.selFilterIds || "";
  const footerText = widgetData.footerText || "";
  const widgetTopMargin = widgetData.widgetTopMargin || "";
  const initialRecord = widgetData?.initialRecordNo;
  const finalRecord = widgetData?.finalRecordNo;
  const isRecordsLimitedLineRequired = widgetData?.isRecordsLimitedLineRequired || "No";

  const widgetLimit = widgetData?.limitHTMLFromDb || '';
  const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || '';
  const parsedLimit = parseInt(defLimit, 10);
  const safeLimit = parsedLimit ? parsedLimit : '';

  const mainQuery = widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : ''
  const customMessage = widgetData?.customMessage || "";

  const onDrillDown = (pkCol, clmtoshow) => {

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
          'pkclm': pkCol,
          'columnToShow': clmtoshow ? clmtoshow : []
        }
      ]);
      setSearchInput('');
    } else {
      ToastAlert('No child available', 'warning')
    }
  }


  const backToParentWidget = (id) => {
    if (levelData?.length > 1 && currentLevel !== 0) {
      let targetLevel = null;
      let widgetDetail = null;
      let pkClm = '';
      const currentWidId = levelData.find(dt => dt.rptLevel === currentLevel);

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

      if (widgetDetail && targetLevel !== null && widgetData?.rptId == currentWidId?.rptId) {
        setCurrentLevel(targetLevel);
        setPkColumn(pkClm)
        const restLevels = levelData.filter(dt => dt.rptLevel <= targetLevel);
        setLevelData(restLevels);
        setWidgetData(widgetDetail);
      }
    }
  }

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [sortConfig, setSortConfig] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(columns?.map(c => c.selector));

  const filterColumns = (columns, clms, isSubHead) => {
    if (isSubHead === 'Yes') {
      if (clms?.length > 0) {
        return columns?.filter(column => {
          return !column.mainHeader || clms.includes(column.mainHeader);
        });
      } else {
        return columns;
      }
    } else {
      const displayedColumns = clms?.length > 0 ? columns?.filter(c => clms?.includes(c.selector)) : columns;
      return displayedColumns;
    }
  }

  const handleSearchChange = (index, value) => {
    setSearchInput(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const addStylesToWindow = (win) => {
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
      win.document.head.appendChild(node.cloneNode(true));
    });
  };


  const handlePrint = (isLimited) => {
    const printTab = window.open("", "_blank");

    printTab.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
         <title>Report Print</title>
         <link rel="stylesheet" href="${window.location.origin}/index.css" />
         <style> 

            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
         </style>
      </head>
      <body>
      <div id="print-loader">
          <div class="spinner"></div>
          <p>Preparing Print...</p>
        </div>
         <div id="print-root"></div>
      </body>
      </html>
    `);

    printTab.document.close();

    Array.from(document.styleSheets).forEach((styleSheet) => {
      try {
        let rules = styleSheet.cssRules;
        if (rules) {
          let style = printTab.document.createElement("style");
          for (let rule of rules) style.appendChild(printTab.document.createTextNode(rule.cssText));
          printTab.document.head.appendChild(style);
        }
      } catch (err) {
        // external CSS like bootstrap, scss build etc
        let link = printTab.document.createElement("link");
        link.rel = "stylesheet";
        link.href = styleSheet.href;
        printTab.document.head.appendChild(link);
      }
    });


    // wait for DOM ready
    const startRender = setInterval(() => {
      const rootEl = printTab.document.getElementById("print-root");
      const copiedStyles = printTab.document.querySelectorAll("style,link").length > 2;

      if (rootEl && copiedStyles) {
        clearInterval(startRender);

        setTimeout(() => {
          const root = createRoot(rootEl);

          root.render(
            <PrintComponent
              filterColumns={filterColumns}
              visibleColumns={visibleColumns}
              widgetData={widgetData}
              multipleTables={multipleTables?.map(table => ({
                ...table,
                columns: table?.columns?.filter(dt => dt?.name !== "Action" && dt?.name !== "pkcolumn"),
                data: widgetLimit && isLimited ? table?.data?.slice(0, parseInt(widgetLimit)) : safeLimit && isLimited ? table?.data?.slice(0, safeLimit) : table.data
              }))}
              config={singleConfigData?.databaseConfigVO}
              filters={getParametersWithValues(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams)}
              onReady={() => {
                setTimeout(() => {
                  const loader = printTab.document.getElementById("print-loader");
                  if (loader) {
                    loader?.remove();
                  }
                  printTab.focus();
                  printTab.print();
                  // printTab.close();   
                }, 800);
              }}
            />
          );
        }, 200);
        const loader = printTab.document.getElementById("print-loader");
        if (loader && multipleTables[0]?.columns?.length === 0) {
          loader?.remove();
        }
      }
    }, 100);
  };

  const clicked = () => {
    setPrevKpiTab(prev => [...prev, {
      ...activeTab,
      pkVal: pkColumn || "bb"
    }]);
  }


  return (
    <>
      {/* {currentLevel == 0 && */}
      <div className={`widget_id_${widgetData?.rptId} tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border ${borderReq === 'No' ? 'border-0' : ''}`} style={{
        height: isLayoutWithPreview ? '100%' : widheight && widheight != '0' ? `${widheight}px` : '650px',
        border: `1px solid ${theme === 'Dark' ? 'white' : '#e8e4e4'}`,
        marginTop: `${widgetTopMargin}px`
      }} key={widgetData?.rptId}>

        <div className={`row py-1 m-0 border-bottom ${headingReq !== "Yes" ? "align-content-end" : ""}`} style={{ width: "100%" }}>
          {headingReq === "Yes" &&
            <div className={` ${isActionButtonReq !== 'No' || isActionButtonReq !== 'None' || currentLevel !== 0 ? 'col-md-9' : 'col-md-12'} fw-medium fs-6`} style={{ textAlign: headingAlign, color: widgetHeadingColor }} >{dt(widgetData?.rptDisplayName)}</div>
          }

          <div className={`${headingReq === "Yes" ? "col-md-3 pe-0 ps-0" : "col-md-12 pe-0 ps-0"}`}>
            {(isActionButtonReq !== 'No' && isActionButtonReq !== 'None') && (<>
              <span
                type="button"
                className="small-box-btn-dwn"
                aria-expanded="false"
                data-bs-toggle="dropdown"
              >
                {/* <FontAwesomeIcon icon={faCog} className="dropdown-gear-icon" /> */}
                <SettingbtnSvg />

              </span>
              <ul className="dropdown-menu p-2">

                {(isActionButtonReq === 'Yes' || isActionButtonReq === 'advanced') &&
                  <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => fetchData(widgetData)}>
                    {/* <FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon me-2" /> */}
                    <RefreshbtnSvg />
                    {dt('Refresh Data')}
                  </li>
                }

                {(isActionButtonReq === 'Yes' || isActionButtonReq === 'pdf' || isActionButtonReq === 'pdfAndcsv') &&
                  <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }}
                    onClick={() => {
                      const limitedTables = multipleTables?.map(table => ({
                        ...table,
                        data: widgetLimit
                          ? table?.data?.slice(0, parseInt(widgetLimit))
                          : safeLimit
                            ? table?.data?.slice(0, safeLimit)
                            : table.data
                      }));
                      generatePDFWorkers(widgetData, limitedTables, singleConfigData?.databaseConfigVO,
                        // filterColumns(multipleTables[0]?.columns, visibleColumns, isFirstRowHeading), 
                        multipleTables?.map((tbl, idx) =>
                          filterColumns(tbl?.columns, visibleColumns, isFirstRowHeading)
                        ),
                        isFirstRowHeading, getParametersWithValues(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams))
                    }} title="PDF">
                    {/* <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon me-2" /> */}
                    <PdfbtnSvg className="me-1 dropdown-gear-icon" height="22" width="22" viewBox="0 0 28 28" />
                    {dt('Download PDF')}
                  </li>
                }

                {(isActionButtonReq === 'Yes' || isActionButtonReq === 'csv' || isActionButtonReq === 'pdfAndcsv') &&
                  <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }}
                    onClick={() => {
                      const limitedTables = multipleTables?.map(table => ({
                        ...table,
                        data: widgetLimit
                          ? table?.data?.slice(0, parseInt(widgetLimit))
                          : safeLimit
                            ? table?.data?.slice(0, safeLimit)
                            : table?.data
                      }));
                      generateCSVWorkers(widgetData, limitedTables, singleConfigData?.databaseConfigVO,
                        // filterColumns(multipleTables[0]?.columns, visibleColumns, isFirstRowHeading),
                        multipleTables?.map((tbl, idx) =>
                          filterColumns(tbl?.columns, visibleColumns, isFirstRowHeading)
                        ),
                        isFirstRowHeading, getParametersWithValues(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams))
                    }} title="CSV">
                    {/* <FontAwesomeIcon icon={faFileExcel} className="dropdown-gear-icon me-2" /> */}
                    <CsvBtnSvg className="me-1" height="22" width="22" viewBox="0 0 28 28" />
                    {dt('Download CSV')}
                  </li>
                }
                {(isActionButtonReq === 'Yes' || isActionButtonReq === 'advanced') &&
                  <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => setShowAdvancedOptions(true)}>
                    {/* <FontAwesomeIcon icon={faSliders} className="dropdown-gear-icon me-2" /> */}
                    <AdvancedbtnSvg />
                    {dt('Advanced')}</li>
                }

                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }}
                  onClick={() => { multipleTables[0]?.columns?.length > 0 ? handlePrint(true) : ToastAlert('No data available', 'warning') }}
                >
                  {/* <FontAwesomeIcon icon={faPrint} className="dropdown-gear-icon me-2" /> */}
                  <PrintbtnSvg />
                  {dt('Print')}
                </li>

              </ul>
            </>)}

            {isDirectDownloadRequired === "Yes" && (<>
              <span className="small-box-btn-dwn" onClick={() => generatePDFWorkers(widgetData, multipleTables, singleConfigData?.databaseConfigVO,
                // filterColumns(multipleTables[0]?.columns, visibleColumns, isFirstRowHeading),
                multipleTables?.map((tbl, idx) =>
                  filterColumns(tbl?.columns, visibleColumns, isFirstRowHeading)
                ),
                isFirstRowHeading, getParametersWithValues(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams))} title="PDF">
                {/* <FontAwesomeIcon icon={faFilePdf} /> */}
                <PdfbtnSvg />
              </span>

              <span className="small-box-btn-dwn" onClick={() => generateCSVWorkers(widgetData, multipleTables, singleConfigData?.databaseConfigVO,
                // filterColumns(multipleTables[0]?.columns, visibleColumns, isFirstRowHeading), 
                multipleTables?.map((tbl, idx) =>
                  filterColumns(tbl?.columns, visibleColumns, isFirstRowHeading)
                ),
                isFirstRowHeading, getParametersWithValues(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams))} title="CSV">
                {/* <FontAwesomeIcon icon={faFileExcel} /> */}
                <CsvBtnSvg />
              </span>

              {/* <button className="small-box-btn-dwn" onClick={() => { multipleTables[0]?.columns?.length > 0 ? handlePrint(false) : ToastAlert('No data available', 'warning') }} title="Print">
                <FontAwesomeIcon icon={faPrint} />
              </button> */}
            </>)}

            {currentLevel !== 0 && (
              <>
                {/* <button className="small-box-btn-dwn" onClick={() => backToParentWidget()}>
                  <FontAwesomeIcon icon={faArrowCircleLeft} />
                </button> */}

                <span className="small-box-btn-dwn" onClick={() => backToParentWidget()} title="Back">
                  <ArrowCircleLeftbtnSvg />
                </span>

                <div className="nav-item dropdown" >
                  <button className="small-box-btn-dwn nav-link" data-bs-toggle="dropdown" title="Prev Widgets">
                    {/* <FontAwesomeIcon icon={faTableCells} /> */}
                    <TableCellsbtnSvg />
                  </button>

                  <ul className="dropdown-menu dropdown-menu-start" >
                    {levelData?.length > 0 && levelData
                      ?.filter((level, index) => {
                        const maxLevel = Math.max(...levelData?.map(l => l.rptLevel));
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

        {/* DESPLAY PARAMETERS AND COLUMNS */}

        {widgetData?.showParentParameterDetailsinChild === "Yes" &&
          <div className="parent heading">
            {getWidgetParametersOnly(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams, levelData)
              ?.filter(param => param.value !== null && param.value !== undefined && param?.rptid !== widgetData?.rptId)
              ?.map((param, index) => (
                <span key={param.id || index} className="parameter-item">
                  <strong className="mx-1">{param.disName || param.paraName} :</strong>
                  <span className="mx-1">{stripHtml(param.val || param.value)}</span>
                </span>
              ))
            }
          </div>
        }

        {widgetData?.showParentDetailsinChild === "Yes" &&
          <div className="parent heading">
            {!isPopup && levelData?.length > 0 && levelData?.map((level, index) => (
              <div key={index}>
                {level?.columnToShow?.length > 0 && (
                  <div className="column-show-data">
                    {level.columnToShow.map((column, colIndex) => (
                      <span key={colIndex} className="column-item">
                        <strong className="mx-1">{column.label} :</strong> <span className="mx-1"> {stripHtml(column.value)}</span>

                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isPopup &&
              <div>
                {pkConfig?.columnToShow?.length > 0 && (
                  <div className="column-show-data">
                    {pkConfig?.columnToShow?.map((column, colIndex) => (
                      <span key={colIndex} className="column-item">
                        <strong className="mx-1">{column.label} :</strong> <span className="mx-1"> {column.value}</span>

                      </span>
                    ))}
                  </div>
                )}
              </div>
            }

          </div>
        }
        {paramsData && (
          <div className='parameter-box py-1'>
            <Parameters params={paramsData} scope={'widgetParams'} widgetId={widgetData?.rptId} setWidgetParams={setWidgetParams} setAllDrpDtParams={setAllDrpDtParams} />
          </div>
        )}

        {(fetching && statusMessage) ? (
          <>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <h6 className="text-center">{statusMessage}</h6>
            </div>
          </>
        ) : (
          multipleTables?.map((table, index) => {

            let filteredData = table?.data;
            if (searchInput) {
              const lowercasedText = searchInput[index]?.toLowerCase() || "";
              filteredData = lowercasedText
                ? table.data.filter(row =>
                  Object.values(row).some(val =>
                    val?.toString()?.toLowerCase()?.includes(lowercasedText)
                  )
                )
                : table.data;
            }

            return (
              <>
                {(isPrev == 1 || isDataSearchReq) &&
                  <div className="px-2 py-2" >
                    {(widgetData?.modeOfQuery === 'Query' && isPrev == 1) && <>
                      <h4 style={{ fontWeight: "500", fontSize: "20px" }}>{dt('Query')} :</h4>
                      {/* <span>{`${table?.queryObj?.mainQuery}---- JNDI Name ---${jndiName || "null"}`}</span> */}
                      <span>{`${getDisplayQuery(
                        table?.queryObj?.mainQuery,
                        syncPkValues[widgetData?.rptId] ? syncPkValues[widgetData?.rptId] : pkColumn,
                        paramsValues,widgetData?.rptId
                      )}---- JNDI Name ---${jndiName || "null"}`}</span>
                    </>
                    }
                    {(widgetData?.modeOfQuery === "Procedure" && isPrev == 1) &&
                      // <span>{widgetData?.procedureMode}</span>
                      <span>{`Procedure-----${widgetData?.procedureMode}-----${table?.queryObj}---- JNDI Name ---${jndiName || 'null'}`}</span>
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
                            onChange={(e) => { handleSearchChange(index, e?.target?.value); }}
                            isSpecialChrs={true}
                          />
                        </div>
                      </div>
                    }
                  </div>
                }

                {widgetData?.tablePluginType === "highchartGrid" ? (
                  <HighchartsGrid
                    key={index}
                    data={widgetLimit
                      ? filteredData?.slice(0, parseInt(widgetLimit)) || []
                      : safeLimit
                        ? filteredData?.slice(0, safeLimit) || []
                        : filteredData || []
                    }
                    columns={filterColumns(table?.columns, visibleColumns, isFirstRowHeading)}
                    mainHeaders={table.mainHeaders}
                    widgetData={widgetData}
                    gridOptions={widgetData?.gridOptions}
                    syncPkValues={syncPkValues}
                    setsyncPkValues={setsyncPkValues}
                    handleSyncChange={handleSyncChange}
                    selectedPk={selectedPk}
                    setSelectedPk={setSelectedPk}
                  />
                ) : (
                  <Tabular
                    key={index}
                    columns={filterColumns(table?.columns, visibleColumns, isFirstRowHeading)}
                    // data={widgetLimit ? filterData?.slice(0, parseInt(widgetLimit)) : safeLimit ? filterData?.slice(0, safeLimit) : filterData}
                    data={widgetLimit ? filteredData?.slice(0, parseInt(widgetLimit)) || [] : safeLimit ? filteredData?.slice(0, safeLimit) || [] : filteredData || []}
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
                    mainHeaders={(() => {
                      if (visibleColumns?.length > 0) {
                        return (table.mainHeaders || [])?.filter(header => visibleColumns?.includes(header.name));
                      } else {
                        return table.mainHeaders || [];
                      }
                    })()}
                    sortConfig={sortConfig}
                    onSortConfigChange={setSortConfig}
                    isRecordsLimitedLineRequired={isRecordsLimitedLineRequired}
                    allData={table.data}
                    limit={widgetLimit ? widgetLimit : safeLimit ? safeLimit : ''}
                    isFirstRowHeading={isFirstRowHeading}
                  />
                )
                }
              </>
            )
          }

          )
        )}

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
      <AdvancedOptionsModal
        show={showAdvancedOptions}
        onClose={() => setShowAdvancedOptions(false)}
        columns={isFirstRowHeading === 'Yes' ? multipleTables[0]?.mainHeaders : multipleTables[0]?.columns}
        sortConfig={sortConfig}
        onSortConfigChange={setSortConfig}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        isFirstRowHeading={isFirstRowHeading}
        widgetId={widgetData?.rptId}
      />

    </>
  );
};
export default TabularDash;

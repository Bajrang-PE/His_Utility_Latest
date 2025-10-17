import React, { useContext, useEffect, useState } from 'react'
import NavbarHeader from '../../components/headers/NavbarHeader'
import GlobalButtonGroup from '../../components/commons/GlobalButtonGroup'
import TabNav from '../../components/commons/TabNav'
import AboutWidget from '../../components/dashboardMasters/widgetMaster/AboutWidget'
import QueryDetails from '../../components/dashboardMasters/widgetMaster/QueryDetails'
import TableDetails from '../../components/dashboardMasters/widgetMaster/TableDetails'
import JndiDetails from '../../components/dashboardMasters/widgetMaster/JndiDetails'
import FooterDetails from '../../components/dashboardMasters/widgetMaster/FooterDetails'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import GraphWidget from '../../components/dashboardMasters/widgetMaster/GraphWidget'
import KpiWidget from '../../components/dashboardMasters/widgetMaster/KpiWidget'
import MapWidget from '../../components/dashboardMasters/widgetMaster/MapWidget'
import NewsTickWidget from '../../components/dashboardMasters/widgetMaster/NewsTickWidget'
import GlobalDataTable from '../../components/commons/GlobalDataTable'
import { HISContext } from '../../contextApi/HISContext'
import DataServiceTable from '../../components/webServiceMasters/dataService/DataServiceTable'
import { highchartGraphOptions, parameterType } from '../../localData/DropDownData'
import ParamsDetail from '../../components/dashboardMasters/tabMaster/ParamsDetail'
import InputSelect from '../../components/commons/InputSelect'
import { ToastAlert } from '../../utils/commonFunction'
import { fetchPostData } from '../../../../utils/HisApiHooks'

const WidgetMaster = () => {

  const { setShowDataTable, allWidgetData, getAllWidgetData, dashboardForDt, getDashboardForDrpData, parameterData, getAllParameterData, widgetDrpData, getAllServiceData, dataServiceData, selectedOption, setSelectedOption, actionMode, setActionMode, parameterDrpData, setLoading, setShowConfirmSave, confirmSave, setConfirmSave, getAllTabsData, tabDrpData, getDashConfigData, singleConfigData, dt } = useContext(HISContext);

  const [values, setValues] = useState({
    "id": "", "widgetFor": "", "widgetType": "columnBased", "widgetNameDisplay": "", "widgetNameInternal": "", "widgetRefreshTime": "", "widgetRefreshDelayTime": "", "cachingStatus": "Cache for All", "limit": "150", "widgetHadingClr": "", "widgetTopMargin": "", "headingBgColor": "", "headingFontColor": "#ffffff", "headingDisplayStyle": "", "recordsPerPage": "", "pagePerBlock": "", "DataScrollHeight": "", "parentWidget": "", "columnNoToDisplay": "1", "leftClmNoToFixed": "", "rightClmNoToFixed": "", "linkedWidget": [], "actionBtnReq": "", "pdfTableFontSize": "10", "pdfTableHeadBarClr": "", "pdfTableHeadTxtFontClr": "", "groupClmNoComma": "", "query": "", "webQuery": "", "procedureName": "", "recordsPerPageTreeCh": "", "parameterOption": "", "loadOption": "ONWINDOWLOAD", "paraComboBgColor": "", "paraComboFontColor": "", "paraLabelFontColor": "", "jndiSavingData": "", "stmtTimeOut": "5", "lastUpdatedQuery": "", "FooterText": "", "customMsgForNoData": "", "treeChildQuery": "", "treeChildProcedure": "", "popUpDetails": [], "queryLabel": '', "htmlText": '', 'iconName': "",
    //graphs fields
    "defaultPluginName": "highchart", "defaultGraphType": "BAR_GRAPH", "graphTypes": [], "clmNameForLineGraph": "", "colorsForBars": "", "graphHeight": "", "graphBottomMargin": "", "graphBgStartColor": "", "graphBgEndColor": "", "graphFontColor": "", "graphTypeBgColor": "", "graphTypeFontColor": "", "labelRotation": "", "alphaGraph3D": "", "betaGraph3D": "", "xAxisLabel": "", "yAxisLabel": "", "xAxisFontSize": "", "yAxisFontSize": "", "annotationFontSize": "", "maxValueOfAxis": "", "parentWidgetGraph": "", "isActionBtnReqGraph": "Yes", "minValueOfAxis": '',
    //kpi details
    "kpiType": "0", "kpiBorderWidth": "", "kpiBorderColor": "", "kpiIconType": "FONT_ICON", "kpiTabIconImage": "", "kpiDefaultBgColor": "#ffffff", "kpiDefaultFontColor": "", "kpiDefaultHoverBg": "", "kpiIconColor": "", "kpiBoxClickOptions": "0", "kpiTabOpenOnClick": "", "kpiWidgetOpenOnClick": "", "kpiDashboardOpenOnClick": "",
    "kpiTabLinkName": "", "kpiWidgetLinkName": "", "kpiLinkColor": "", "kpiLinkFontColor": "",
    //map fields
    "mapName": "india", "parentWidgetMap": "", "mapIncreasingIntensity": "",
    //newsTicker Fields
    "noOfNewsVisible": "", "newsSpeed": "normal", "newsInterval": "5000",
    //iframe
    "urlForIframe": "",
    // other link
    "lstOtherLink": [],
    "sqChildJsonString": [],
    "selFilterIds": "", "mpFormatColumn": ""
  })

  const [radioValues, setRadioValues] = useState({
    widgetViewed: 'Tabular', isWidgetNameVisible: 'Yes', selectedModeQuery: 'Query', widgetPurpose: 'HTML',
    widgetHeadingAlign: 'left', isRecordLimitReq: 'Yes', isWidgetBorderReq: 'Yes',

    isTableHeadingReq: 'Yes',
    tableHeadingAlign: "0", isFirstRowHeading: 'No', isDataTblReq: 'Yes', isIndexNumReq: 'Yes',
    isPaginationReq: 'Yes', isSearchReq: 'Yes', isHeadingFixed: 'Yes', isLastRowTotal: 'Yes', isCardViewMobile: 'Yes', isShowPrntHeadChild: 'Yes', isShowPrntParamsChild: 'Yes', printPdfIn: 'Landscape', pdfTheme: 'grid', isPdfHeadReqAllPgs: 'Yes', showFilterDtlsInPdf: 'Yes', isReportByJsPdfPlug: 'Yes', isReportPrintDtReq: 'Yes', isGlobalHeaderReq: 'Yes', isTableBorderReq: 'Yes', isPositiveWidget: 'Yes', isDirectDownloadBtn: 'Yes', isPopupBasedReq: 'No', isTreeChildReq: 'No', treeChildDataBy: "Query", dataDisplay: "horizontal", isDataTblReqTree: 'Yes', isPaginationReqTree: 'Yes', isSearchReqTree: 'Yes',
    //graphs fields
    isDisplayGraphPlugin: "Yes", isColorByPoint: "Yes", isShowLegendOnExport: "Yes", isFullLabelReq: "Yes", isGraphScrollBarReq: "Yes", isShowLegend: "Yes", isDataLabels: "Yes", isThree3D: "Yes", isDirectDownloadBtnGraph: 'Yes', isFirstClmGraphHeading: 'Yes', isShowPrntHeadChildGraph: 'Yes', isHideParent: 'Yes', isRowClickable: "No",
    //kpi
    isWidgetShadowReq: "Yes", isDownloadDataFromKpi: "Yes",
    //map
    isChildBasedPrimaryKey: "Yes", isHideParentMap: "Yes",
    //iframe
    isSsoUrl: "Yes"
  })

  const [tabIndex, setTabIndex] = useState(1);
  const [tabName, setTabName] = useState({ value: 1, label: "About Widget" });
  const [showWidgetTable, setShowWidgetTable] = useState(false);
  const [showParamsTable, setShowParamsTable] = useState(false);
  const [showWebServiceTable, setShowWebServiceTable] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filterData, setFilterData] = useState(parameterData)
  const [widgetSearchInput, setWidgetSearchInput] = useState('');
  const [widgetFilterData, setWidgetFilterData] = useState(allWidgetData);
  const [singleData, setSingleData] = useState([]);
  const [isInputChanged, setIsInputChanged] = useState(false);

  //multi params
  const [availableOptions, setAvailableOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [newRow, setNewRow] = useState({ modeForSQCHILDColumnNo: "", SQCHILDWidgetId: "", drillSQCHILDWidgetName: "" });

  const [otherLinkData, setOtherLinkData] = useState([{ otherLinkName: "", otherLinkURL: "" }]);

  const [rows, setRows] = useState([{ queryLabel: "", mainQuery: "", isMultiRowDataTable: "", tableDataDisplay: "horizontal", totalRecordCountQuery: "" }]);

  const [procedureRows, setProcedureRows] = useState([{ queryLabel: "", serviceReferenceNumber: "", webserviceName: "", isMultiRowDataTable: "", tableDataDisplay: "horizontal" }]);

  const [errors, setErrors] = useState({
    widgetForErr: "", widgetNameDisplayErr: "", widgetNameInternalErr: "", defaultGraphTypeErr: "", clmNameForLineGraphErr: "", defaultPluginNameErr: "",
    alphaGraph3DErr: "", betaGraph3DErr: "", xAxisLabelErr: "", yAxisLabelErr: "", kpiTypeErr: "", kpiIconTypeErr: "", kpiDefaultBgColorErr: "", noOfNewsVisibleErr: "", mapNameErr: "",

    modeForSQCHILDColumnNoErr: "", SQCHILDWidgetIdErr: "", otherLinkNameErr: "", otherLinkURLErr: "", mainQueryErr: "", serviceReferenceNumberErr: "", webserviceNameErr: "", procedureNameErr: "",

    widgetViewedErr: "", isWidgetNameVisibleErr: "", isThree3DErr: "", isDataLabelsErr: "", isShowLegendErr: "", isDisplayGraphPluginErr: "", isFullLabelReqErr: "", isGraphScrollBarReqErr: "",
  });

  useEffect(() => {
    const init = async () => {
      if (!singleConfigData) {
        await getDashConfigData();
      }
      if (dashboardForDt?.length === 0) { getDashboardForDrpData(); }
      if (dataServiceData?.length === 0) { getAllServiceData(); }
    };
    init();
  }, [])

  useEffect(() => {
    if (values?.selFilterIds !== "") {
      const selectedIds = values?.selFilterIds?.split(",")?.map(id => id?.trim());
      // const fdt = parameterDrpData?.filter(dt => selectedIds?.includes(dt?.value?.toString()));
      const fdt = selectedIds?.map(id => parameterDrpData?.find(dt => dt.value?.toString() === id))?.filter(Boolean);
      const availableOptions = parameterDrpData?.filter(dt => !selectedIds?.includes(dt?.value?.toString()));

      setSelectedOptions(fdt?.length > 0 ? fdt : []);
      setAvailableOptions(availableOptions?.length > 0 ? availableOptions : []);
    } else {
      setSelectedOptions([]);
      setAvailableOptions(parameterDrpData);
    }
  }, [values?.selFilterIds, parameterDrpData]);

  //to set value of dashboard for auto
  const dashFor = localStorage.getItem('dfor');
  useEffect(() => {
    if (dashFor) {
      setValues({ ...values, "widgetFor": dashFor })
    }
  }, [dashFor])

  useEffect(() => {
    if (selectedOptions?.length > 0) {
      const selectedIdParams = selectedOptions?.length > 0 ? selectedOptions?.map(option => option?.value).join(",") : '';
      setValues({
        ...values,
        ['selFilterIds']: selectedIdParams
      })
    }
  }, [selectedOptions])


  useEffect(() => {
    const localValues = localStorage.getItem('values');
    const localRadio = localStorage.getItem('radio');
    const mode = localStorage.getItem('mode');
    if (localValues && localValues !== '') {
      const val = JSON.parse(localValues);
      setValues(val);
      setActionMode(mode);
      setRows(val?.queryVO && val?.queryVO?.length > 0 ? val?.queryVO : []);

    }
    if (localRadio && localRadio !== '') {
      setRadioValues(JSON.parse(localRadio));
      setActionMode(mode)
    }

  }, []);

  useEffect(() => {
    if (values?.widgetFor) {
      getAllWidgetData(values?.widgetFor);
      getAllParameterData(values?.widgetFor);
      getAllTabsData(values?.widgetFor)
    }
  }, [values?.widgetFor])


  const handleRadioChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRadioValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // setIsInputChanged(true)
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    const error = name + 'Err'
    if (name) {
      setValues({ ...values, [name]: value })
    }
    if (error && name) {
      setErrors({ ...errors, [error]: '' })
    }
    // setIsInputChanged(true)
  }

  // TAB MENUS
  const [tabNavMenus, setTabNavMenus] = useState([
    { value: 1, label: "About Widget" },
    { value: 2, label: "Query Details" },
    { value: 3, label: "Table Details" },
    { value: 4, label: "Parameter Detail" },
    { value: 5, label: "JNDI Details" },
    { value: 6, label: "Footer Details" },
  ]);

  // HANDLE TAB MENUS ACCORDING TO WIDGET
  useEffect(() => {
    const widgetTabMapping = {
      Tabular: { value: 3, label: "Table Details" },
      Graph: { value: 3, label: "Graph Details" },
      Criteria_Map: { value: 3, label: "Map Details" },
      KPI: { value: 3, label: "KPI Details" },
      News_Ticker: { value: 3, label: "News Details" },
    };
    const removeParamTabsFor = ["Tabular", "Graph", "Criteria_Map"];

    let updatedTabs = [...tabNavMenus];
    if (radioValues?.widgetViewed === "Other_Link" || radioValues?.widgetViewed === "Iframe") {
      const removeTabs = tabNavMenus.filter(dt => dt?.value !== 3 && dt?.value !== 4 && dt?.value !== 2);
      setTabNavMenus(removeTabs);
    } else {
      const selectedTab = widgetTabMapping[radioValues?.widgetViewed];
      const isValue3Present = tabNavMenus.some(dt => dt.value === 3);
      const isParamsPresent = tabNavMenus.some(dt => dt.value === 4);
      const isQueryPresent = tabNavMenus.some(dt => dt.value === 2);
      if (selectedTab) {
        if (isValue3Present) {
          updatedTabs = updatedTabs.map(dt =>
            dt.value === 3 ? { ...dt, label: selectedTab?.label } : dt
          );
        } else {
          updatedTabs.splice(1, 0, selectedTab);
          // setTabNavMenus(updatedTabs);
        }
      }
      // Remove "value: 4" Parameter tab for specific widgets
      if (!removeParamTabsFor.includes(radioValues?.widgetViewed) && isParamsPresent) {
        updatedTabs = updatedTabs.filter(dt => dt.value !== 4);
      } else if (removeParamTabsFor.includes(radioValues?.widgetViewed) && !isParamsPresent) {
        updatedTabs.splice(3, 0, { value: 4, label: "Parameter Detail" });
      }

      if (!isQueryPresent) {
        updatedTabs.splice(1, 0, { value: 2, label: "Query Details" });
      }

      setTabNavMenus(updatedTabs);
    }
  }, [radioValues?.widgetViewed])


  const saveTabsData = () => {
    let nextTab = tabIndex + 1;
    if (tabNavMenus?.length >= nextTab) {
      setTabName(tabNavMenus[nextTab - 1])
      setTabIndex(nextTab)
    }
    localStorage.setItem('values', JSON.stringify(values));
    localStorage.setItem('radio', JSON.stringify(radioValues));
    localStorage.setItem('mode', actionMode);
  }

  const previousTab = () => {
    let nextTab = tabIndex - 1;
    if (nextTab >= 1) {
      setTabName(tabNavMenus[nextTab - 1])
      setTabIndex(nextTab);
    }
  }

  const onOpenDataTable = () => {
    setShowDataTable(true);
    setShowWidgetTable(true);
  }
  const onOpenParams = () => {
    setShowDataTable(true);
    setShowParamsTable(true);
  }
  const onOpenWebService = () => {
    setShowDataTable(true);
    setShowWebServiceTable(true);
  }

  const onTableClose = () => {
    setShowWidgetTable(false);
    setShowParamsTable(false);
    setShowWebServiceTable(false);
    setSearchInput('');
    setSelectedOption([]);
    setWidgetSearchInput('')
  }

  const reset = () => {
    // const isReset = window.confirm('Do you want to reset whole form!');
    // if (isReset) {
    setValues({
      "id": "", "widgetFor": dashFor || "", "widgetType": "columnBased", "widgetNameDisplay": "", "widgetNameInternal": "", "widgetRefreshTime": "", "widgetRefreshDelayTime": "", "cachingStatus": "Cache for All", "limit": "150", "widgetHadingClr": "", "widgetTopMargin": "", "headingBgColor": "", "headingFontColor": "#ffffff", "headingDisplayStyle": "", "recordsPerPage": "", "pagePerBlock": "", "DataScrollHeight": "", "parentWidget": "", "columnNoToDisplay": "1", "leftClmNoToFixed": "", "rightClmNoToFixed": "", "linkedWidget": [], "actionBtnReq": "", "pdfTableFontSize": "10", "pdfTableHeadBarClr": "", "pdfTableHeadTxtFontClr": "", "groupClmNoComma": "", "query": "", "procedureName": "", "recordsPerPageTreeCh": "", "parameterOption": "", "loadOption": "ONWINDOWLOAD", "paraComboBgColor": "", "paraComboFontColor": "", "paraLabelFontColor": "", "jndiSavingData": "", "stmtTimeOut": "5", "lastUpdatedQuery": "", "FooterText": "", "customMsgForNoData": "", "treeChildQuery": "", "treeChildProcedure": "", "popUpDetails": [], "webQuery": "", "queryLabel": '', "htmlText": '', 'iconName': "",
      //graphs fields
      "defaultPluginName": "highchart", "defaultGraphType": "BAR_GRAPH", "graphTypes": [], "clmNameForLineGraph": "", "colorsForBars": "", "graphHeight": "", "graphBottomMargin": "", "graphBgStartColor": "", "graphBgEndColor": "", "graphFontColor": "", "graphTypeBgColor": "", "graphTypeFontColor": "", "labelRotation": "", "alphaGraph3D": "", "betaGraph3D": "", "xAxisLabel": "", "yAxisLabel": "", "xAxisFontSize": "", "yAxisFontSize": "", "annotationFontSize": "", "maxValueOfAxis": "", "parentWidgetGraph": "", "isActionBtnReqGraph": "Yes", "minValueOfAxis": "",
      //kpi details
      "kpiType": "0", "kpiBorderWidth": "", "kpiBorderColor": "", "kpiIconType": "FONT_ICON", "kpiTabIconImage": "", "kpiDefaultBgColor": "#ffffff", "kpiDefaultFontColor": "", "kpiDefaultHoverBg": "", "kpiIconColor": "", "kpiBoxClickOptions": "0", "kpiTabOpenOnClick": "", "kpiWidgetOpenOnClick": "", "kpiDashboardOpenOnClick": "", "kpiTabLinkName": "", "kpiWidgetLinkName": "", "kpiLinkColor": "", "kpiLinkFontColor": "",
      //map fields
      "mapName": "india", "parentWidgetMap": "", "mapIncreasingIntensity": "",
      //newsTicker Fields
      "noOfNewsVisible": "", "newsSpeed": "normal", "newsInterval": "5000",
      //iframe
      "urlForIframe": "",
      "lstOtherLink": [],
      "sqChildJsonString": []
    });
    setRadioValues({
      widgetViewed: 'Tabular', isWidgetNameVisible: 'Yes', selectedModeQuery: 'Query', widgetPurpose: 'HTML',
      widgetHeadingAlign: 'left', isRecordLimitReq: 'Yes', isWidgetBorderReq: 'Yes',

      isTableHeadingReq: 'Yes',
      tableHeadingAlign: "0", isFirstRowHeading: 'No', isDataTblReq: 'Yes', isIndexNumReq: 'Yes',
      isPaginationReq: 'Yes', isSearchReq: 'Yes', isHeadingFixed: 'Yes', isLastRowTotal: 'Yes', isCardViewMobile: 'Yes', isShowPrntHeadChild: 'Yes', isShowPrntParamsChild: 'Yes', printPdfIn: 'Landscape', pdfTheme: 'grid', isPdfHeadReqAllPgs: 'Yes', showFilterDtlsInPdf: 'Yes', isReportByJsPdfPlug: 'Yes', isReportPrintDtReq: 'Yes', isGlobalHeaderReq: 'Yes', isTableBorderReq: 'Yes', isPositiveWidget: 'Yes', isDirectDownloadBtn: 'Yes', isPopupBasedReq: 'No', isTreeChildReq: 'No', treeChildDataBy: "Query", dataDisplay: "horizontal", isDataTblReqTree: 'Yes', isPaginationReqTree: 'Yes', isSearchReqTree: 'Yes',
      //graphs fields
      isDisplayGraphPlugin: "Yes", isColorByPoint: "Yes", isShowLegendOnExport: "Yes", isFullLabelReq: "Yes", isGraphScrollBarReq: "Yes", isShowLegend: "Yes", isDataLabels: "Yes", isThree3D: "Yes", isDirectDownloadBtnGraph: 'Yes', isFirstClmGraphHeading: 'Yes', isShowPrntHeadChildGraph: 'Yes', isHideParent: 'Yes',
      //kpi
      isWidgetShadowReq: "Yes", isDownloadDataFromKpi: "Yes",
      //map
      isChildBasedPrimaryKey: "Yes", isHideParentMap: "Yes",
      //iframe
      isSsoUrl: "Yes"
    });
    setErrors({
      widgetForErr: "", widgetNameDisplayErr: "", widgetNameInternalErr: "", defaultGraphTypeErr: "", graphTypesErr: "", clmNameForLineGraphErr: "", defaultPluginNameErr: "",
      alphaGraph3DErr: "", betaGraph3DErr: "", xAxisLabelErr: "", yAxisLabelErr: "", kpiTypeErr: "", kpiIconTypeErr: "", kpiDefaultBgColorErr: "", noOfNewsVisibleErr: "", mapNameErr: "",

      modeForSQCHILDColumnNoErr: "", SQCHILDWidgetIdErr: "", otherLinkNameErr: "", otherLinkURLErr: "", mainQueryErr: "", serviceReferenceNumberErr: "", webserviceNameErr: "", procedureNameErr: "",

      widgetViewedErr: "", isWidgetNameVisibleErr: "", isThree3DErr: "", isDataLabelsErr: "", isShowLegendErr: "", isDisplayGraphPluginErr: "", isFullLabelReqErr: "", isGraphScrollBarReqErr: "",
    })
    setTabIndex(1);
    setTabName({ value: 1, label: "About Widget" })
    localStorage.removeItem('values');
    localStorage.removeItem('radio');
    setLoading(false)
    onTableClose()

    setNewRow({ modeForSQCHILDColumnNo: "", SQCHILDWidgetId: "", drillSQCHILDWidgetName: "" });

    setOtherLinkData([{ otherLinkName: "", otherLinkURL: "" }]);

    setRows([{ queryLabel: "", mainQuery: "", isMultiRowDataTable: "", tableDataDisplay: "horizontal", totalRecordCountQuery: "" }]);

    setProcedureRows([{ queryLabel: "", serviceReferenceNumber: "", webserviceName: "", isMultiRowDataTable: "", tableDataDisplay: "horizontal" }]);
    // setIsInputChanged(false)
  }

  const handleUpdateData = () => {
    if (selectedOption?.length > 0) {
      const selectedRow = allWidgetData?.filter(dt => dt?.rptId === selectedOption[0]?.rptId)
      reset();
      setSingleData(selectedRow);
      setActionMode('edit');
      // setShowParamsTable(false);
      setShowDataTable(false);
      // setShowWebServiceTable(false);
      // setSelectedOption([]);
      onTableClose()
      // setIsInputChanged(true)
    } else {
      ToastAlert('Please select a record', 'warning');
    }
  }

  const returnAlignment = (val) => {
    if (val === "left" || val === "Left") {
      return "left";
    } else if (val === 'right' || val === "Right") {
      return 'right';
    } else if (val === 'center' || val === "Center") {
      return 'center';
    } else {
      return "left";
    }
  }

  const returnLinkedData = (linkedWidgetRptId) => {
    if (!linkedWidgetRptId || !widgetDrpData) return [];

    const ids = linkedWidgetRptId?.split(",").map(id => id.trim());

    return widgetDrpData.filter(item => ids.includes(String(item.value)));
  }


  useEffect(() => {
    if (singleData?.length > 0) {
      setLoading(true)
      setValues({
        ...values,
        id: singleData[0]?.rptId,
        widgetFor: singleData[0]?.dashboardFor || '',//
        widgetType: singleData[0]?.widgetType,//
        widgetNameDisplay: singleData[0]?.rptDisplayName,//
        widgetNameInternal: singleData[0]?.rptName,//
        widgetRefreshTime: singleData[0]?.widgetRefreshTime,//
        widgetRefreshDelayTime: singleData[0]?.widgetRefreshDelayTime,//
        cachingStatus: singleData[0]?.cachingStatusForWidget || "Cache for All",//
        limit: singleData[0]?.limitHTMLFromDb || '150',//
        widgetHadingClr: singleData[0]?.widgetHeadingColor,//
        widgetTopMargin: singleData[0]?.widgetTopMargin,//
        //table
        headingBgColor: singleData[0]?.headingBackgroundColour,//
        headingFontColor: singleData[0]?.headingFontColour || "#ffffff",//
        headingDisplayStyle: singleData[0]?.headingDisplayStyle,//
        recordsPerPage: singleData[0]?.recordPerPage,//
        pagePerBlock: singleData[0]?.pagePerBlock,//
        DataScrollHeight: singleData[0]?.scrollYValue,//
        parentWidget: singleData[0]?.parentReport,//
        columnNoToDisplay: singleData[0]?.parentDisplaycolumnno || '1',//
        leftClmNoToFixed: singleData[0]?.leftColumnsToBeFixed,//
        rightClmNoToFixed: singleData[0]?.rightColumnsToBeFixed,//
        linkedWidget: returnLinkedData(singleData[0]?.linkedWidgetRptId),//
        actionBtnReq: singleData[0]?.isActionButtonReq,//
        pdfTableFontSize: singleData[0]?.pdfTableFontSize || '10',//
        pdfTableHeadBarClr: singleData[0]?.pdfTableheaderBarColor,//
        pdfTableHeadTxtFontClr: singleData[0]?.pdfTableheadingFontColour,//
        groupClmNoComma: singleData[0]?.groupColumnNo,//

        query: singleData[0]?.modeOfQuery !== 'WebSevice' ? singleData[0]?.queryVO : [],//
        webQuery: singleData[0]?.modeOfQuery === 'WebSevice' ? singleData[0]?.queryVO : [],//
        procedureName: singleData[0]?.procedureMode,//
        treeChildQuery: singleData[0]?.treeChildQuery,
        treeChildProcedure: singleData[0]?.treeChildProcedure,
        popUpDetails: singleData[0]?.drillDownJsonString && typeof singleData[0]?.drillDownJsonString === "string" ? JSON?.parse(singleData[0]?.drillDownJsonString) : singleData[0]?.drillDownJsonString,//
        queryLabel: singleData[0]?.queryLabel,//
        htmlText: singleData[0]?.htmlText,//

        recordsPerPageTreeCh: singleData[0]?.treeChildrecordPerPage,//
        parameterOption: singleData[0]?.parameterOptions,//
        loadOption: singleData[0]?.widgetLoadOption,//
        paraComboBgColor: singleData[0]?.widgetParameterComboBGColor,//
        paraComboFontColor: singleData[0]?.widgetParameterComboFontColor,//
        paraLabelFontColor: singleData[0]?.widgetParameterLabelFontColor,//
        jndiSavingData: singleData[0]?.JNDIid,//
        stmtTimeOut: singleData[0]?.statementTimeOut || '5',//
        lastUpdatedQuery: singleData[0]?.lastUpdatedQuery,//
        FooterText: singleData[0]?.footerText,//
        customMsgForNoData: singleData[0]?.customMessage,//
        //graph
        defaultPluginName: singleData[0]?.graphPluginName,//
        defaultGraphType: singleData[0]?.defaultgraphType,//
        graphTypes: singleData[0]?.graphChangeOptions?.length > 0 && singleData[0]?.graphChangeOptions?.map(tp => highchartGraphOptions?.find(type => type?.value === tp)).filter(type => type !== undefined),//
        clmNameForLineGraph: singleData[0]?.lineGraphColumnName,//
        colorsForBars: singleData[0]?.colorForBars,//
        graphHeight: singleData[0]?.graphHeight,//
        graphBottomMargin: singleData[0]?.graphBottomMargin,//
        graphBgStartColor: singleData[0]?.graphStartColor,//
        graphBgEndColor: singleData[0]?.graphEndColor,//
        graphFontColor: singleData[0]?.graphFontColor,//
        graphTypeBgColor: singleData[0]?.graphTypeBGColor,//
        graphTypeFontColor: singleData[0]?.graphTypeFontColor,//
        labelRotation: singleData[0]?.rotation,//
        alphaGraph3D: singleData[0]?.alpha,//
        betaGraph3D: singleData[0]?.beta,//
        xAxisLabel: singleData[0]?.xAxisLabel,//
        yAxisLabel: singleData[0]?.yAxisLabel,//
        xAxisFontSize: singleData[0]?.XAxisFontSize,//
        yAxisFontSize: singleData[0]?.YAxisFontSize,//
        annotationFontSize: singleData[0]?.annotationFontSize,//
        maxValueOfAxis: singleData[0]?.maxValueOfAxis,//
        minValueOfAxis: singleData[0]?.minValueOfAxis,//
        parentWidgetGraph: singleData[0]?.parentReport,//
        isActionBtnReqGraph: singleData[0]?.isActionButtonReq,//
        //kpi
        kpiType: singleData[0]?.kpiType || "0",//================
        kpiBorderWidth: singleData[0]?.kpiBorderWidth,//
        kpiBorderColor: singleData[0]?.kpiBorderColor,//
        kpiIconType: singleData[0]?.iconType,//
        kpiTabIconImage: singleData[0]?.iconImageName,//
        iconName: singleData[0]?.iconName,//
        kpiDefaultBgColor: singleData[0]?.widgetBackgroundColour,//
        kpiDefaultFontColor: singleData[0]?.widgetFontColour,//
        kpiDefaultHoverBg: singleData[0]?.widgetHoverBackground,//
        kpiIconColor: singleData[0]?.widgetIconColour,//
        kpiBoxClickOptions: singleData[0]?.onClickOfKPITabId && singleData[0]?.onClickOfKPITabId !== "0" ? "showTab" : singleData[0]?.onClickOfKPIWidgetId && singleData[0]?.onClickOfKPIWidgetId !== "0" ? "showWidget" : singleData[0]?.onClickOfKPIDashboardId && singleData[0]?.onClickOfKPIDashboardId !== "0" ? "showDashboard" : singleData[0]?.onClickKPITypeOption || "0",
        kpiTabOpenOnClick: singleData[0]?.onClickOfKPITabId,//
        kpiWidgetOpenOnClick: singleData[0]?.onClickOfKPIWidgetId,//
        kpiDashboardOpenOnClick: singleData[0]?.onClickOfKPIDashboardId,//
        kpiTabLinkName: singleData[0]?.linkTab,//
        kpiWidgetLinkName: singleData[0]?.linkWidget,//
        kpiLinkColor: singleData[0]?.kpiLinkColor,//
        kpiLinkFontColor: singleData[0]?.kpiLinkFontColor,//
        //map
        mapName: singleData[0]?.mapName,//
        parentWidgetMap: singleData[0]?.parentReport,//
        mapIncreasingIntensity: singleData[0]?.legendText,//
        //news
        noOfNewsVisible: singleData[0]?.newsVisible,//
        newsSpeed: singleData[0]?.newsSpeed,//
        newsInterval: singleData[0]?.newsTimeInterval,//
        //iframe
        urlForIframe: singleData[0]?.iframeURL,//
        lstOtherLink: singleData[0]?.lstOtherLink ? singleData[0]?.lstOtherLink : [],//
        // single query parent
        sqChildJsonString: singleData[0]?.sqChildJsonString ? JSON?.parse(singleData[0]?.sqChildJsonString) : [],
        selFilterIds: singleData[0]?.selFilterIds,
        mpFormatColumn: singleData[0]?.mpFormatColumn
      });
      setRadioValues({
        ...radioValues,
        widgetViewed: singleData[0]?.reportViewed,//
        isWidgetNameVisible: singleData[0]?.isWidgetNameVisible,//
        widgetPurpose: singleData[0]?.widgetShowOrDownload,//
        widgetHeadingAlign: returnAlignment(singleData[0]?.widgetHeadingAlignment),//
        isRecordLimitReq: singleData[0]?.isRecordsLimitedLineRequired || 'No',//
        isWidgetBorderReq: singleData[0]?.isWidgetBorderRequired || 'Yes',//

        selectedModeQuery: singleData[0]?.modeOfQuery,//

        isTableHeadingReq: singleData[0]?.tableHeadingRequired === 'yes' || singleData[0]?.tableHeadingRequired === 'Yes' ? 'Yes' : 'No',//
        tableHeadingAlign: singleData[0]?.tableHeadingAlignment,//
        isFirstRowHeading: singleData[0]?.isFirstRowColumnName || 'No',//
        isDataTblReq: singleData[0]?.isDataTableRequired || 'Yes',//
        isIndexNumReq: singleData[0]?.isIndexNumberRequired || 'No',//
        isPaginationReq: singleData[0]?.isPaginationReq || 'No',//
        isSearchReq: singleData[0]?.isDataSearchReq || 'Yes',//
        isHeadingFixed: singleData[0]?.isHeadingFixed || "No",//
        isLastRowTotal: singleData[0]?.isLastRowTotal || 'No',//
        isCardViewMobile: singleData[0]?.isCardViewMobile || 'No',//=============

        isShowPrntHeadChild: singleData[0]?.showParentDetailsinChild || 'Yes',//
        isShowPrntParamsChild: singleData[0]?.showParentParameterDetailsinChild || 'Yes',//

        printPdfIn: singleData[0]?.printPDFIn,//
        pdfTheme: singleData[0]?.pdfTheme || 'grid',//
        isPdfHeadReqAllPgs: singleData[0]?.isPdfHeaderReqInAllPages || 'No',//
        showFilterDtlsInPdf: singleData[0]?.showFilterDetailsInPDF || 'Yes',//
        isReportByJsPdfPlug: singleData[0]?.isReportByjsPDFPlugin || 'Yes',//
        isReportPrintDtReq: singleData[0]?.isReportPrintDateRequired || 'Yes',//
        isGlobalHeaderReq: singleData[0]?.isGlobalHeaderRequired || 'Yes',//
        isTableBorderReq: singleData[0]?.isTableBorderRequired || 'Yes',//
        isPositiveWidget: singleData[0]?.isPositiveWidget || 'Yes',//
        isDirectDownloadBtn: singleData[0]?.isDirectDownloadRequired || 'No',//
        isPopupBasedReq: singleData[0]?.isPopupBasedOnDataClickRequired || 'No',//
        isTreeChildReq: singleData[0]?.isTreeChildRequired || 'No',//

        treeChildDataBy: singleData[0]?.treeChildDataBy,//
        dataDisplay: singleData[0]?.treeChildDataDisplay,//
        isDataTblReqTree: singleData[0]?.treeChildIsDataTableRequired,//
        isPaginationReqTree: singleData[0]?.treeChildIsPaginationRequired,//
        isSearchReqTree: singleData[0]?.treeChildIsSearchRequired,//
        // Graph fields
        isDisplayGraphPlugin: singleData[0]?.isDisplayPluginCombo,//
        isColorByPoint: singleData[0]?.isColorByPoint,//==========
        isShowLegendOnExport: singleData[0]?.showLegendOnExport,//
        isFullLabelReq: singleData[0]?.isFullLabelRequired,//
        isGraphScrollBarReq: singleData[0]?.isScrollbarRequired,//
        isShowLegend: singleData[0]?.showInLegend === 'true' || singleData[0]?.showInLegend === 'Yes' ? 'Yes' : 'No',//
        isDataLabels: singleData[0]?.dataLabels === 'true' || singleData[0]?.dataLabels === 'Yes' ? "Yes" : 'No',//
        isThree3D: singleData[0]?.is3d === 'true' || singleData[0]?.is3d === 'Yes' ? 'Yes' : 'No',//
        isDirectDownloadBtnGraph: singleData[0]?.isDirectDownloadRequired,//
        isFirstClmGraphHeading: singleData[0]?.isFirstClmGraphHeading,//========
        isShowPrntHeadChildGraph: singleData[0]?.showParentDetailsinChild,//
        isHideParent: singleData[0]?.isHideParent,//
        isRowClickable: singleData[0]?.isRowClickable,//
        // KPI fields
        isWidgetShadowReq: singleData[0]?.isWidgetShadowRequired,//
        isDownloadDataFromKpi: singleData[0]?.downloadDataFromKPI,//
        // Map fields
        isChildBasedPrimaryKey: singleData[0]?.isChildBasedOnPK,//
        isHideParentMap: singleData[0]?.isHideParent,//
        // Iframe fields
        isSsoUrl: singleData[0]?.isSSOUrl,//
      });
      setRows(singleData[0]?.queryVO && singleData[0]?.queryVO?.length > 0 ? singleData[0]?.queryVO : [])
      setLoading(false)
    }
  }, [singleData]);
  // console.log('singleData', singleData)

  //parameter search
  useEffect(() => {
    if (!searchInput) {
      setFilterData(parameterData);
    } else {
      const lowercasedText = searchInput.toLowerCase();
      const newFilteredData = parameterData.filter(row => {
        const paramId = row?.id?.toString() || "";
        const paramName = row?.jsonData?.parameterName?.toLowerCase() || "";
        const paramDisplayName = row?.jsonData?.parameterDisplayName?.toLowerCase() || "";

        return paramId?.includes(lowercasedText) || paramName.includes(lowercasedText) || paramDisplayName.includes(lowercasedText);
      });
      setFilterData(newFilteredData);
    }
  }, [searchInput, parameterData]);

  //widget search
  useEffect(() => {
    if (!widgetSearchInput) {
      setWidgetFilterData(allWidgetData);
    } else {
      const lowercasedText = widgetSearchInput.toLowerCase();
      const newFilteredData = allWidgetData.filter(row => {
        const paramId = row?.rptId?.toString() || "";
        const paramName = row?.rptName?.toLowerCase() || "";
        const paramDisplayName = row?.rptDisplayName?.toLowerCase() || "";
        const paramType = row?.reportViewed?.toLowerCase() || "";

        return paramId?.includes(lowercasedText) || paramName.includes(lowercasedText) || paramDisplayName.includes(lowercasedText) || paramType?.includes(lowercasedText);
      });
      setWidgetFilterData(newFilteredData);
    }
  }, [widgetSearchInput, allWidgetData]);

  const saveWidgetData = () => {
    setLoading(true)
    const {
      widgetFor, widgetType, widgetNameDisplay, widgetNameInternal, widgetRefreshTime, widgetRefreshDelayTime, cachingStatus, limit, widgetHadingClr, widgetTopMargin,
      //table
      headingBgColor, headingFontColor, headingDisplayStyle, recordsPerPage, pagePerBlock, DataScrollHeight, parentWidget, columnNoToDisplay, leftClmNoToFixed, rightClmNoToFixed, linkedWidget, actionBtnReq, pdfTableFontSize, pdfTableHeadBarClr, pdfTableHeadTxtFontClr, groupClmNoComma, query, procedureName, recordsPerPageTreeCh, parameterOption, loadOption, paraComboBgColor, paraComboFontColor, paraLabelFontColor, jndiSavingData, stmtTimeOut, lastUpdatedQuery, FooterText, customMsgForNoData, treeChildQuery, treeChildProcedure, popUpDetails, webQuery, htmlText, queryLabel,
      // graph fields
      defaultPluginName, defaultGraphType, graphTypes, clmNameForLineGraph, colorsForBars, graphHeight, graphBottomMargin, graphBgStartColor, graphBgEndColor, graphFontColor, graphTypeBgColor, graphTypeFontColor, labelRotation, alphaGraph3D, betaGraph3D, xAxisLabel, yAxisLabel, xAxisFontSize,
      yAxisFontSize, annotationFontSize, maxValueOfAxis, parentWidgetGraph, isActionBtnReqGraph, minValueOfAxis,
      // KPI fields
      kpiType, kpiBorderWidth, kpiBorderColor, kpiIconType, kpiTabIconImage, kpiDefaultBgColor, kpiDefaultFontColor, kpiDefaultHoverBg, kpiIconColor, kpiBoxClickOptions, kpiTabOpenOnClick, kpiWidgetOpenOnClick, kpiDashboardOpenOnClick, kpiTabLinkName, kpiWidgetLinkName, kpiLinkColor, kpiLinkFontColor, iconName,
      // map fields
      mapName, parentWidgetMap, mapIncreasingIntensity,
      // newsTicker fields
      noOfNewsVisible, newsSpeed, newsInterval,
      // iframe
      urlForIframe, lstOtherLink, sqChildJsonString, mpFormatColumn } = values;

    const {
      widgetViewed, isWidgetNameVisible, selectedModeQuery, widgetPurpose, widgetHeadingAlign, isRecordLimitReq, isWidgetBorderReq,
      //table
      isTableHeadingReq, tableHeadingAlign, isFirstRowHeading, isDataTblReq, isIndexNumReq, isPaginationReq, isSearchReq, isHeadingFixed, isLastRowTotal, isCardViewMobile, isShowPrntHeadChild, isShowPrntParamsChild, printPdfIn, pdfTheme, isPdfHeadReqAllPgs, showFilterDtlsInPdf,
      isReportByJsPdfPlug, isReportPrintDtReq, isGlobalHeaderReq, isTableBorderReq, isPositiveWidget, isDirectDownloadBtn, isPopupBasedReq, isTreeChildReq, treeChildDataBy, dataDisplay, isDataTblReqTree,
      isPaginationReqTree, isSearchReqTree,
      // Graph fields
      isDisplayGraphPlugin, isColorByPoint, isShowLegendOnExport, isFullLabelReq, isGraphScrollBarReq, isShowLegend,
      isDataLabels, isThree3D, isDirectDownloadBtnGraph, isFirstClmGraphHeading, isShowPrntHeadChildGraph, isHideParent, isRowClickable,
      // KPI fields
      isWidgetShadowReq, isDownloadDataFromKpi,
      // Map fields
      isChildBasedPrimaryKey, isHideParentMap,
      // Iframe fields
      isSsoUrl
    } = radioValues;

    const selectedIdParams = selectedOptions?.length > 0 ? selectedOptions?.map(option => option?.value).join(",") : '';

    const val = {
      dashboardFor: widgetFor,
      masterName: "DashboardWidgetMst",
      keyName: widgetNameDisplay,
      jndiIdForGettingData: jndiSavingData,
      statementTimeout: stmtTimeOut,
      entryUserId: 101,
      // lastModifiedUserId: 2,
      jsonData: {
        dashboardFor: widgetFor,
        widgetType: widgetType,
        rptDisplayName: widgetNameDisplay,
        rptName: widgetNameInternal,
        widgetRefreshTime: widgetRefreshTime,
        widgetRefreshDelayTime: widgetRefreshDelayTime,
        cachingStatusForWidget: cachingStatus,
        limitHTMLFromDb: limit,
        widgetHeadingColor: widgetHadingClr,
        widgetTopMargin: widgetTopMargin,
        sqChildJsonString: JSON?.stringify(sqChildJsonString),
        selFilterIds: selectedIdParams,
        //table
        headingBackgroundColour: headingBgColor,
        headingFontColour: headingFontColor,
        headingDisplayStyle: headingDisplayStyle,
        recordPerPage: recordsPerPage,
        pagePerBlock: pagePerBlock,
        scrollYValue: DataScrollHeight,
        parentReport: parentWidget,
        parentDisplaycolumnno: columnNoToDisplay,
        leftColumnsToBeFixed: leftClmNoToFixed,
        rightColumnsToBeFixed: rightClmNoToFixed,
        linkedWidgetRptId: linkedWidget?.length > 0 ? linkedWidget.map(item => item.value).join(',') : '',
        isActionButtonReq: actionBtnReq,
        pdfTableFontSize: pdfTableFontSize || '10',
        pdfTableheaderBarColor: pdfTableHeadBarClr,
        pdfTableheadingFontColour: pdfTableHeadTxtFontClr,
        groupColumnNo: groupClmNoComma,
        queryVO: selectedModeQuery === 'Query' ? query : selectedModeQuery === 'WebSevice' ? webQuery : [],
        queryLabel: queryLabel,//
        htmlText: htmlText,//
        procedureMode: procedureName,
        treeChildQuery: treeChildQuery,
        treeChildProcedure: treeChildProcedure,
        drillDownJsonString: popUpDetails?.length > 0 ? JSON?.stringify(popUpDetails) : "",
        mpFormatColumn: mpFormatColumn,
        treeChildrecordPerPage: recordsPerPageTreeCh,
        parameterOptions: parameterOption,
        widgetLoadOption: selectedIdParams ? loadOption : 'ONWINDOWLOAD',
        widgetParameterComboBGColor: paraComboBgColor,
        widgetParameterComboFontColor: paraComboFontColor,
        widgetParameterLabelFontColor: paraLabelFontColor,
        JNDIid: jndiSavingData,
        statementTimeOut: stmtTimeOut,
        lastUpdatedQuery: lastUpdatedQuery,
        footerText: FooterText,
        customMessage: customMsgForNoData,
        //graph
        graphPluginName: defaultPluginName,
        defaultgraphType: defaultGraphType,
        graphChangeOptions: graphTypes?.length > 0 ? graphTypes?.map(tp => tp?.value) : [],
        lineGraphColumnName: clmNameForLineGraph,
        colorForBars: colorsForBars,
        graphHeight: graphHeight,
        graphBottomMargin: graphBottomMargin,
        graphStartColor: graphBgStartColor,
        graphEndColor: graphBgEndColor,
        graphFontColor: graphFontColor,
        graphTypeBGColor: graphTypeBgColor,
        graphTypeFontColor: graphTypeFontColor,
        rotation: labelRotation,
        alpha: alphaGraph3D,
        beta: betaGraph3D,
        xAxisLabel: xAxisLabel,
        yAxisLabel: yAxisLabel,
        XAxisFontSize: xAxisFontSize,
        YAxisFontSize: yAxisFontSize,
        annotationFontSize: annotationFontSize,
        maxValueOfAxis: maxValueOfAxis,
        minValueOfAxis: minValueOfAxis,
        parentReportGraph: parentWidgetGraph,
        isActionButtonReqGraph: isActionBtnReqGraph,
        //kpi
        kpiType: kpiType || "0",
        kpiBorderWidth: kpiBorderWidth,
        kpiBorderColor: kpiBorderColor,
        iconType: kpiIconType,
        iconImageName: kpiTabIconImage,
        widgetBackgroundColour: kpiDefaultBgColor || "#ffffff",
        widgetFontColour: kpiDefaultFontColor,
        widgetHoverBackground: kpiDefaultHoverBg,
        widgetIconColour: kpiIconColor,
        onClickKPITypeOption: kpiBoxClickOptions,
        onClickOfKPITabId: kpiBoxClickOptions === "showTab" ? kpiTabOpenOnClick : "",
        onClickOfKPIWidgetId: kpiBoxClickOptions === "showWidget" ? kpiWidgetOpenOnClick : "",
        onClickOfKPIDashboardId: kpiBoxClickOptions === "showDashboard" ? kpiDashboardOpenOnClick : "",
        linkTab: kpiTabLinkName,
        linkWidget: kpiWidgetLinkName,
        kpiLinkColor: kpiLinkColor,
        kpiLinkFontColor: kpiLinkFontColor,
        iconName: iconName,//
        //map
        mapName: mapName,
        parentReportMap: parentWidgetMap,
        legendText: mapIncreasingIntensity,
        //news
        newsVisible: noOfNewsVisible,
        newsSpeed: newsSpeed,
        newsTimeInterval: newsInterval,
        //iframe
        iframeURL: urlForIframe,
        lstOtherLink: lstOtherLink,//

        //RADIOVALUES
        reportViewed: widgetViewed,
        isWidgetNameVisible: isWidgetNameVisible,
        widgetShowOrDownload: widgetPurpose,
        widgetHeadingAlignment: widgetHeadingAlign,
        isRecordsLimitedLineRequired: isRecordLimitReq,
        isWidgetBorderRequired: isWidgetBorderReq,
        modeOfQuery: selectedModeQuery,
        //table
        tableHeadingRequired: isTableHeadingReq,
        tableHeadingAlignment: tableHeadingAlign,
        isFirstRowColumnName: isFirstRowHeading,
        isDataTableRequired: isDataTblReq,
        isIndexNumberRequired: isIndexNumReq,
        isPaginationReq: isPaginationReq,
        isDataSearchReq: isSearchReq,
        isHeadingFixed: isHeadingFixed,
        isLastRowTotal: isLastRowTotal,
        isCardViewMobile: isCardViewMobile,
        showParentDetailsinChild: isShowPrntHeadChild,
        showParentParameterDetailsinChild: isShowPrntParamsChild,
        printPDFIn: printPdfIn,
        pdfTheme: pdfTheme,
        isPdfHeaderReqInAllPages: isPdfHeadReqAllPgs,
        showFilterDetailsInPDF: showFilterDtlsInPdf,
        isReportByjsPDFPlugin: isReportByJsPdfPlug,
        isReportPrintDateRequired: isReportPrintDtReq,
        isGlobalHeaderRequired: isGlobalHeaderReq,
        isTableBorderRequired: isTableBorderReq,
        isPositiveWidget: isPositiveWidget,
        isDirectDownloadRequired: isDirectDownloadBtn,
        isPopupBasedOnDataClickRequired: isPopupBasedReq,
        isTreeChildRequired: isTreeChildReq,
        treeChildDataBy: treeChildDataBy,
        treeChildDataDisplay: dataDisplay,
        treeChildIsDataTableRequired: isDataTblReqTree,
        treeChildIsPaginationRequired: isPaginationReqTree,
        treeChildIsSearchRequired: isSearchReqTree,
        //graph
        isDisplayPluginCombo: isDisplayGraphPlugin,
        isColorByPoint: isColorByPoint,
        showLegendOnExport: isShowLegendOnExport,
        isFullLabelRequired: isFullLabelReq,
        isScrollbarRequired: isGraphScrollBarReq,
        showInLegend: isShowLegend,
        dataLabels: isDataLabels,
        is3d: isThree3D,
        isDirectDownloadRequiredGraph: isDirectDownloadBtnGraph,
        isFirstClmGraphHeading: isFirstClmGraphHeading,
        showParentDetailsinChildGraph: isShowPrntHeadChildGraph,
        isHideParent: isHideParent,
        isRowClickable: isRowClickable,
        //kpi
        isWidgetShadowRequired: isWidgetShadowReq,
        downloadDataFromKPI: isDownloadDataFromKpi,
        //map
        isChildBasedOnPK: isChildBasedPrimaryKey,
        isHideParentMap: isHideParentMap,
        //iframe
        isSSOUrl: isSsoUrl
      }
    };
    fetchPostData("/hisutils/createWidget", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Saved Successfully", "success");
        getAllWidgetData(values?.widgetFor)
        reset();
        setConfirmSave(false);
        setActionMode('home');
        setLoading(false)
      } else {
        ToastAlert(data?.message, "error");
        setConfirmSave(false);
        setLoading(false)
      }
    });
  };

  // console.log(singleData,'singledata')

  const updateWidgetData = () => {
    setLoading(true)
    const {
      id, widgetFor, widgetType, widgetNameDisplay, widgetNameInternal, widgetRefreshTime, widgetRefreshDelayTime, cachingStatus, limit, widgetHadingClr, widgetTopMargin,
      //table
      headingBgColor, headingFontColor, headingDisplayStyle, recordsPerPage, pagePerBlock, DataScrollHeight, parentWidget, columnNoToDisplay, leftClmNoToFixed, rightClmNoToFixed, linkedWidget, actionBtnReq, pdfTableFontSize, pdfTableHeadBarClr, pdfTableHeadTxtFontClr, groupClmNoComma, query, procedureName, recordsPerPageTreeCh, parameterOption, loadOption, paraComboBgColor, paraComboFontColor, paraLabelFontColor, jndiSavingData, stmtTimeOut, lastUpdatedQuery, FooterText, customMsgForNoData, treeChildQuery, treeChildProcedure, popUpDetails, webQuery, htmlText, queryLabel,
      // graph fields
      defaultPluginName, defaultGraphType, graphTypes, clmNameForLineGraph, colorsForBars, graphHeight, graphBottomMargin, graphBgStartColor, graphBgEndColor, graphFontColor, graphTypeBgColor, graphTypeFontColor, labelRotation, alphaGraph3D, betaGraph3D, xAxisLabel, yAxisLabel, xAxisFontSize,
      yAxisFontSize, annotationFontSize, maxValueOfAxis, parentWidgetGraph, isActionBtnReqGraph, minValueOfAxis,
      // KPI fields
      kpiType, kpiBorderWidth, kpiBorderColor, kpiIconType, kpiTabIconImage, kpiDefaultBgColor, kpiDefaultFontColor, kpiDefaultHoverBg, kpiIconColor, kpiBoxClickOptions, kpiTabOpenOnClick, kpiWidgetOpenOnClick, kpiDashboardOpenOnClick, kpiTabLinkName, kpiWidgetLinkName, kpiLinkColor, kpiLinkFontColor, iconName,
      // map fields
      mapName, parentWidgetMap, mapIncreasingIntensity,
      // newsTicker fields
      noOfNewsVisible, newsSpeed, newsInterval,
      // iframe
      urlForIframe, lstOtherLink, sqChildJsonString, mpFormatColumn } = values;

    const {
      widgetViewed, isWidgetNameVisible, selectedModeQuery, widgetPurpose, widgetHeadingAlign, isRecordLimitReq, isWidgetBorderReq,
      //table
      isTableHeadingReq, tableHeadingAlign, isFirstRowHeading, isDataTblReq, isIndexNumReq, isPaginationReq, isSearchReq, isHeadingFixed, isLastRowTotal, isCardViewMobile, isShowPrntHeadChild, isShowPrntParamsChild, printPdfIn, pdfTheme, isPdfHeadReqAllPgs, showFilterDtlsInPdf,
      isReportByJsPdfPlug, isReportPrintDtReq, isGlobalHeaderReq, isTableBorderReq, isPositiveWidget, isDirectDownloadBtn, isPopupBasedReq, isTreeChildReq, treeChildDataBy, dataDisplay, isDataTblReqTree,
      isPaginationReqTree, isSearchReqTree,
      // Graph fields
      isDisplayGraphPlugin, isColorByPoint, isShowLegendOnExport, isFullLabelReq, isGraphScrollBarReq, isShowLegend,
      isDataLabels, isThree3D, isDirectDownloadBtnGraph, isFirstClmGraphHeading, isShowPrntHeadChildGraph, isHideParent, isRowClickable,
      // KPI fields
      isWidgetShadowReq, isDownloadDataFromKpi,
      // Map fields
      isChildBasedPrimaryKey, isHideParentMap,
      // Iframe fields
      isSsoUrl
    } = radioValues;
    const selectedIdParams = selectedOptions?.length > 0 ? selectedOptions?.map(option => option?.value).join(",") : '';

    const val = {
      dashboardFor: widgetFor,
      masterName: "DashboardWidgetMst",
      keyName: widgetNameDisplay,
      jndiIdForGettingData: jndiSavingData,
      statementTimeout: stmtTimeOut,
      entryUserId: 101,
      // lastModifiedUserId: 2,
      id: id,
      jsonData: {
        dashboardFor: widgetFor,
        widgetType: widgetType,
        rptDisplayName: widgetNameDisplay,
        rptName: widgetNameInternal,
        rptId: id,
        widgetRefreshTime: widgetRefreshTime,
        widgetRefreshDelayTime: widgetRefreshDelayTime,
        cachingStatusForWidget: cachingStatus,
        limitHTMLFromDb: limit,
        widgetHeadingColor: widgetHadingClr,
        widgetTopMargin: widgetTopMargin,
        sqChildJsonString: JSON?.stringify(sqChildJsonString),
        selFilterIds: selectedIdParams,
        //table
        headingBackgroundColour: headingBgColor,
        headingFontColour: headingFontColor,
        headingDisplayStyle: headingDisplayStyle,
        recordPerPage: recordsPerPage,
        pagePerBlock: pagePerBlock,
        scrollYValue: DataScrollHeight,
        parentReport: parentWidget,
        parentDisplaycolumnno: columnNoToDisplay,
        leftColumnsToBeFixed: leftClmNoToFixed,
        rightColumnsToBeFixed: rightClmNoToFixed,
        linkedWidgetRptId: linkedWidget?.length > 0 ? linkedWidget.map(item => item.value).join(',') : '',
        isActionButtonReq: actionBtnReq,
        pdfTableFontSize: pdfTableFontSize || '10',
        pdfTableheaderBarColor: pdfTableHeadBarClr,
        pdfTableheadingFontColour: pdfTableHeadTxtFontClr,
        groupColumnNo: groupClmNoComma,
        // query: query,
        queryVO: selectedModeQuery === 'Query' ? query : selectedModeQuery === 'WebSevice' ? webQuery : [],
        queryLabel: queryLabel,//
        htmlText: htmlText,//
        procedureMode: procedureName,
        treeChildQuery: treeChildQuery,
        treeChildProcedure: treeChildProcedure,
        drillDownJsonString: popUpDetails?.length > 0 ? JSON?.stringify(popUpDetails) : "",
        mpFormatColumn: mpFormatColumn,
        treeChildrecordPerPage: recordsPerPageTreeCh,
        parameterOptions: parameterOption,
        widgetLoadOption: selectedIdParams ? loadOption : 'ONWINDOWLOAD',
        widgetParameterComboBGColor: paraComboBgColor,
        widgetParameterComboFontColor: paraComboFontColor,
        widgetParameterLabelFontColor: paraLabelFontColor,
        JNDIid: jndiSavingData,
        statementTimeOut: stmtTimeOut,
        lastUpdatedQuery: lastUpdatedQuery,
        footerText: FooterText,
        customMessage: customMsgForNoData,
        //graph
        graphPluginName: defaultPluginName,
        defaultgraphType: defaultGraphType,
        graphChangeOptions: graphTypes?.length > 0 ? graphTypes?.map(tp => tp?.value) : [],
        lineGraphColumnName: clmNameForLineGraph,
        colorForBars: colorsForBars,
        graphHeight: graphHeight,
        graphBottomMargin: graphBottomMargin,
        graphStartColor: graphBgStartColor,
        graphEndColor: graphBgEndColor,
        graphFontColor: graphFontColor,
        graphTypeBGColor: graphTypeBgColor,
        graphTypeFontColor: graphTypeFontColor,
        rotation: labelRotation,
        alpha: alphaGraph3D,
        beta: betaGraph3D,
        xAxisLabel: xAxisLabel,
        yAxisLabel: yAxisLabel,
        XAxisFontSize: xAxisFontSize,
        YAxisFontSize: yAxisFontSize,
        annotationFontSize: annotationFontSize,
        maxValueOfAxis: maxValueOfAxis,
        minValueOfAxis: minValueOfAxis,
        parentReportGraph: parentWidgetGraph,
        isActionButtonReqGraph: isActionBtnReqGraph,
        //kpi
        kpiType: kpiType || "0",
        kpiBorderWidth: kpiBorderWidth,
        kpiBorderColor: kpiBorderColor,
        iconType: kpiIconType,
        iconImageName: kpiTabIconImage,
        widgetBackgroundColour: kpiDefaultBgColor || "#ffffff",
        widgetFontColour: kpiDefaultFontColor,
        widgetHoverBackground: kpiDefaultHoverBg,
        widgetIconColour: kpiIconColor,
        onClickKPITypeOption: kpiBoxClickOptions,
        onClickOfKPITabId: kpiBoxClickOptions === "showTab" ? kpiTabOpenOnClick : "",
        onClickOfKPIWidgetId: kpiBoxClickOptions === "showWidget" ? kpiWidgetOpenOnClick : "",
        onClickOfKPIDashboardId: kpiBoxClickOptions === "showDashboard" ? kpiDashboardOpenOnClick : "",
        linkTab: kpiTabLinkName,
        linkWidget: kpiWidgetLinkName,
        kpiLinkColor: kpiLinkColor,
        kpiLinkFontColor: kpiLinkFontColor,
        iconName: iconName,//
        //map
        mapName: mapName,
        parentReportMap: parentWidgetMap,
        legendText: mapIncreasingIntensity,
        //news
        newsVisible: noOfNewsVisible,
        newsSpeed: newsSpeed,
        newsTimeInterval: newsInterval,
        //iframe
        iframeURL: urlForIframe,
        lstOtherLink: lstOtherLink,  //

        //RADIOVALUES
        reportViewed: widgetViewed,
        isWidgetNameVisible: isWidgetNameVisible,
        widgetShowOrDownload: widgetPurpose,
        widgetHeadingAlignment: widgetHeadingAlign,
        isRecordsLimitedLineRequired: isRecordLimitReq,
        isWidgetBorderRequired: isWidgetBorderReq,
        modeOfQuery: selectedModeQuery,
        //table
        tableHeadingRequired: isTableHeadingReq,
        tableHeadingAlignment: tableHeadingAlign,
        isFirstRowColumnName: isFirstRowHeading,
        isDataTableRequired: isDataTblReq,
        isIndexNumberRequired: isIndexNumReq,
        isPaginationReq: isPaginationReq,
        isDataSearchReq: isSearchReq,
        isHeadingFixed: isHeadingFixed,
        isLastRowTotal: isLastRowTotal,
        isCardViewMobile: isCardViewMobile,
        showParentDetailsinChild: isShowPrntHeadChild,
        showParentParameterDetailsinChild: isShowPrntParamsChild,
        printPDFIn: printPdfIn,
        pdfTheme: pdfTheme,
        isPdfHeaderReqInAllPages: isPdfHeadReqAllPgs,
        showFilterDetailsInPDF: showFilterDtlsInPdf,
        isReportByjsPDFPlugin: isReportByJsPdfPlug,
        isReportPrintDateRequired: isReportPrintDtReq,
        isGlobalHeaderRequired: isGlobalHeaderReq,
        isTableBorderRequired: isTableBorderReq,
        isPositiveWidget: isPositiveWidget,
        isDirectDownloadRequired: isDirectDownloadBtn,
        isPopupBasedOnDataClickRequired: isPopupBasedReq,
        isTreeChildRequired: isTreeChildReq,
        treeChildDataBy: treeChildDataBy,
        treeChildDataDisplay: dataDisplay,
        treeChildIsDataTableRequired: isDataTblReqTree,
        treeChildIsPaginationRequired: isPaginationReqTree,
        treeChildIsSearchRequired: isSearchReqTree,
        //graph
        isDisplayPluginCombo: isDisplayGraphPlugin,
        isColorByPoint: isColorByPoint,
        showLegendOnExport: isShowLegendOnExport,
        isFullLabelRequired: isFullLabelReq,
        isScrollbarRequired: isGraphScrollBarReq,
        showInLegend: isShowLegend,
        dataLabels: isDataLabels,
        is3d: isThree3D,
        isDirectDownloadRequiredGraph: isDirectDownloadBtnGraph,
        isFirstClmGraphHeading: isFirstClmGraphHeading,
        showParentDetailsinChildGraph: isShowPrntHeadChildGraph,
        isHideParent: isHideParent,
        isRowClickable: isRowClickable,
        //kpi
        isWidgetShadowRequired: isWidgetShadowReq,
        downloadDataFromKPI: isDownloadDataFromKpi,
        //map
        isChildBasedOnPK: isChildBasedPrimaryKey,
        isHideParentMap: isHideParentMap,
        //iframe
        isSSOUrl: isSsoUrl
      }
    }
    fetchPostData("/hisutils/updateWidget", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Updated Successfully", "success");
        getAllWidgetData(values?.widgetFor)
        reset();
        setConfirmSave(false);
        setSelectedOption([])
        setLoading(false)
      } else {
        ToastAlert(data?.message, "error");
        setConfirmSave(false);
        setLoading(false)
      }
    });
  };

  const handleDeleteParams = () => {
    if (selectedOption?.length > 0) {
      setLoading(true)
      const val = { "id": selectedOption[0]?.rptId, "dashboardFor": values?.widgetFor, "masterName": "DashboardWidgetMst" };
      fetchPostData("/hisutils/widgetDelete", val).then((data) => {
        if (data?.status === 1) {
          ToastAlert('Deleted Successfully!', 'success');
          getAllWidgetData(values?.widgetFor)
          setSelectedOption([]);
          setShowParamsTable(false);
          setShowDataTable(false);
          setShowWebServiceTable(false);
          reset();
          setLoading(false)
        } else {
          ToastAlert(data?.message, 'error');
          setLoading(false)
        }
      })
    } else {
      ToastAlert('Please select a record', 'warning');
    }
  }

  const handleSaveUpdate = () => {
    let isValid = true;
    let newErrors = {};

    //  General Widget Validations
    if (!values?.widgetFor?.trim()) {
      newErrors.widgetForErr = "Widget for is required";
      isValid = false;
    }
    if (!values?.widgetNameDisplay?.trim()) {
      newErrors.widgetNameDisplayErr = "Display name is required";
      isValid = false;
    }
    if (!values?.widgetNameInternal?.trim()) {
      newErrors.widgetNameInternalErr = "Internal name is required";
      isValid = false;
    }
    if (!radioValues?.widgetViewed?.trim()) {
      newErrors.widgetViewedErr = "Widget view is required";
      isValid = false;
    }
    if (!radioValues?.isWidgetNameVisible?.trim()) {
      newErrors.isWidgetNameVisibleErr = "This check is required";
      isValid = false;
    }

    //  Graph-Specific Validations
    if (radioValues?.widgetViewed === "Graph") {
      if (!values?.defaultGraphType?.trim()) {
        newErrors.defaultGraphTypeErr = "Default graph type is required";
        isValid = false;
      }
      // if (values?.graphTypes?.length === 0) {
      //   newErrors.graphTypesErr = "Graph type selection is required";
      //   isValid = false;
      // }
      // if (!values?.clmNameForLineGraph?.trim()) {
      //   newErrors.clmNameForLineGraphErr = "Column name for Line Graph is required";
      //   isValid = false;
      // }
      if (!values?.defaultPluginName?.trim()) {
        newErrors.defaultPluginNameErr = "Default plugin name is required";
        isValid = false;
      }
      if (!values?.alphaGraph3D?.trim() && radioValues?.isThree3D === "Yes") {
        newErrors.alphaGraph3DErr = "Alpha Graph 3D is required";
        isValid = false;
      }
      if (!values?.betaGraph3D?.trim() && radioValues?.isThree3D === "Yes") {
        newErrors.betaGraph3DErr = "Beta Graph 3D is required";
        isValid = false;
      }
      if (!values?.xAxisLabel?.trim()) {
        newErrors.xAxisLabelErr = "X-axis label is required";
        isValid = false;
      }
      if (!values?.yAxisLabel?.trim()) {
        newErrors.yAxisLabelErr = "Y-axis label is required";
        isValid = false;
      }
      if (!radioValues?.isThree3D?.trim()) {
        newErrors.isThree3DErr = "3D option selection is required";
        isValid = false;
      }
      if (!radioValues?.isDataLabels?.trim()) {
        newErrors.isDataLabelsErr = "Data labels option is required";
        isValid = false;
      }
      if (!radioValues?.isShowLegend?.trim()) {
        newErrors.isShowLegendErr = "Show legend selection is required";
        isValid = false;
      }
      if (!radioValues?.isDisplayGraphPlugin?.trim()) {
        newErrors.isDisplayGraphPluginErr = "Display Graph Plugin option is required";
        isValid = false;
      }
      if (!radioValues?.isGraphScrollBarReq?.trim()) {
        newErrors.isGraphScrollBarReqErr = "Graph scrollbar requirement is needed";
        isValid = false;
      }
      // if (!radioValues?.isFullLabelReq?.trim()) {
      //   newErrors.isFullLabelReqErr = "Full label requirement is needed";
      //   isValid = false;
      // }
    }

    //  KPI-Specific Validations
    if (radioValues?.widgetViewed === "KPI") {
      if (!values?.kpiType?.trim()) {
        newErrors.kpiTypeErr = "KPI type is required";
        isValid = false;
      }
      if (!values?.kpiIconType?.trim()) {
        newErrors.kpiIconTypeErr = "KPI icon type is required";
        isValid = false;
      }
      if (!values?.kpiDefaultBgColor?.trim()) {
        newErrors.kpiDefaultBgColorErr = "KPI default background color is required";
        isValid = false;
      }
    }

    //  News Ticker Validations
    if (radioValues?.widgetViewed === "News_Ticker" && !values?.noOfNewsVisible?.trim()) {
      newErrors.noOfNewsVisibleErr = "Number of news visible is required";
      isValid = false;
    }

    //  Criteria Map Validations
    if (radioValues?.widgetViewed === "Criteria_Map" && !values?.mapName?.trim()) {
      newErrors.mapNameErr = "Map name is required";
      isValid = false;
    }

    //  Other Link Validations
    if (radioValues?.widgetViewed === "Other_Link") {
      if (otherLinkData?.length > 0 && !otherLinkData[otherLinkData?.length - 1]?.otherLinkName) {
        newErrors.otherLinkNameErr = "Other link name is required";
        isValid = false;
      }
      if (otherLinkData?.length > 0 && !otherLinkData[otherLinkData?.length - 1]?.otherLinkURL) {
        newErrors.otherLinkURLErr = "Other link URL is required";
        isValid = false;
      }
    }

    //  Single Query Parent Validations
    if (values?.widgetType === "singleQueryParent" && values?.sqChildJsonString?.length === 0) {
      if (!newRow?.SQCHILDWidgetId?.trim()) {
        newErrors.SQCHILDWidgetIdErr = "SQCHILD Widget ID is required";
        isValid = false;
      } else {
        newErrors.modeForSQCHILDColumnNoErr = "Mode for SQCHILD Column No is required";
        isValid = false;
      }
    }

    //  Query, WebService, Procedure Validations
    if (radioValues?.widgetViewed !== "Other_Link" && radioValues?.widgetViewed !== "Iframe") {
      if (radioValues?.selectedModeQuery === "Query" && rows?.length > 0 && !rows[rows?.length - 1]?.mainQuery?.trim()) {
        newErrors.mainQueryErr = "required";
        isValid = false;
      }
      if (radioValues?.selectedModeQuery === "WebSevice") {
        if (procedureRows?.length > 0 && !procedureRows[procedureRows?.length - 1]?.serviceReferenceNumber) {
          newErrors.serviceReferenceNumberErr = "required";
          isValid = false;
        }
        if (procedureRows?.length > 0 && !procedureRows[procedureRows?.length - 1]?.webserviceName) {
          newErrors.webserviceNameErr = "required";
          isValid = false;
        }
      }
      if (radioValues?.selectedModeQuery === "Procedure" && !values?.procedureName?.trim()) {
        newErrors.procedureNameErr = "Procedure name is required";
        isValid = false;
      }
    }

    setErrors(newErrors)

    if (!isValid) {
      if (newErrors.widgetForErr || newErrors.widgetNameDisplayErr || newErrors.widgetNameInternalErr || newErrors.widgetViewedErr || newErrors.isWidgetNameVisibleErr) {
        setTabIndex(1);
        setTabName({ value: 1, label: "About Widget" });
      } else if (newErrors.mainQueryErr || newErrors.serviceReferenceNumberErr || newErrors.webserviceNameErr || newErrors.procedureNameErr) {
        setTabIndex(2);
        setTabName({ value: 2, label: "Query Details" });
      } else if (newErrors.kpiTypeErr || newErrors.kpiIconTypeErr || newErrors.kpiDefaultBgColorErr || newErrors.noOfNewsVisibleErr || newErrors.mapNameErr || newErrors.defaultGraphTypeErr || newErrors.defaultPluginNameErr || newErrors.defaultPluginNameErr || newErrors.alphaGraph3DErr || newErrors.betaGraph3DErr || newErrors.xAxisLabelErr || newErrors.yAxisLabelErr || newErrors.isThree3DErr || newErrors.isDataLabelsErr || newErrors.isShowLegendErr || newErrors.isDisplayGraphPluginErr || newErrors.isGraphScrollBarReqErr) {
        setTabIndex(3);
        setTabName({ value: 3, label: "" });
      }
    } else {
      setShowConfirmSave(true);
    }
  }

  useEffect(() => {
    if (confirmSave) {
      if (actionMode === 'edit') {
        updateWidgetData();
      } else {
        saveWidgetData();
      }
    }
  }, [confirmSave])

  const widgetColumn = [
    {
      name: <input
        type="checkbox"
        // checked={selectAll}
        // onChange={(e) => handleSelectAll(e.target.checked, "gnumUserId")}
        disabled={true}
        className="form-check-input log-select"
      />,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, left: 10 }}>
          <span className="btn btn-sm text-white px-1 py-0 mr-1" >
            <input
              type="checkbox"
              checked={selectedOption[0]?.rptId === row?.rptId}
              onChange={(e) => { setSelectedOption([row]) }}
            />
          </span>
        </div>,
      width: "8%"
    },
    {
      name: dt('Widget ID'),
      selector: row => parseInt(row?.rptId),
      sortable: true,
      width: "10%"
    },
    {
      name: dt('Widget Name'),
      selector: row => row?.rptName,
      sortable: true,
    },
    {
      name: dt('Display Name'),
      selector: row => row?.rptDisplayName,
      sortable: true,
    },
    {
      name: dt('Type'),
      selector: row => row?.reportViewed,
      sortable: true,
    }
  ]

  const paramsColumn = [
    {
      name: <input
        type="checkbox"
        // checked={selectAll}
        // onChange={(e) => handleSelectAll(e.target.checked, "gnumUserId")}
        disabled={true}
        className="form-check-input log-select"
      />,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, left: 10 }}>
          <span className="btn btn-sm text-white px-1 py-0 mr-1" >
            <input
              type="checkbox"
            // checked={selectedRows.includes(row.gnumUserId)}
            // onChange={(e) => { handleRowSelect(row.gnumUserId) }}
            />
          </span>
        </div>,
      width: "8%"
    },
    {
      name: dt('ID'),
      selector: row => row.id,
      sortable: true,
      width: "8%"
    },
    {
      name: dt('Parameter Name'),
      selector: row => row?.jsonData?.parameterName,
      sortable: true,
    },
    {
      name: dt('Display Name'),
      selector: row => row?.jsonData?.parameterDisplayName,
      sortable: true,
    },
    {
      name: dt('Type'),
      selector: row => parameterType?.filter(dt => dt?.value === row?.jsonData?.parameterType)[0]?.label || "---",
      sortable: true,
    },
  ]


  return (
    <>
      <NavbarHeader />
      <div className='main-master-page'>
        {values?.widgetFor &&
          <div className='row w-100 m-0'>
            <div className='col-sm-6 p-0 global-button-group'>
              <GlobalButtonGroup isSave={true} isOpen={true} isReset={true} isParams={true} isWeb={true} onSave={handleSaveUpdate} onOpen={onOpenDataTable} onReset={reset} onParams={onOpenParams} onWeb={onOpenWebService} />
            </div>
            <div className='col-sm-6 p-0 global-tabs'>
              <TabNav isTabNav={true} tabNavData={tabNavMenus} setTabIndex={setTabIndex} tabName={tabName} setTabName={setTabName} />
            </div>
          </div>
        }
        <div className='form-card m-auto p-2'>
          {values?.widgetFor ?
            <div className='p-1'>

              {tabName?.value === 1 &&
                <AboutWidget handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} dashboardForDt={dashboardForDt} setValues={setValues} widgetDrpData={widgetDrpData} errors={errors} setErrors={setErrors} {...{ otherLinkData, setOtherLinkData, newRow, setNewRow }} dt={dt} />
              }

              {tabName?.value === 2 &&
                <QueryDetails handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} setValues={setValues} singleData={singleData} errors={errors} setErrors={setErrors} {...{ rows, setRows, procedureRows, setProcedureRows }} dt={dt} />
              }

              {tabName?.value === 3 &&
                <>
                  {radioValues?.widgetViewed === "Tabular" &&
                    <TableDetails handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} parentWidget={widgetDrpData} setValues={setValues} errors={errors} dt={dt} tabDrpData={tabDrpData} />
                  }

                  {radioValues?.widgetViewed === "Graph" &&
                    <GraphWidget handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} setValues={setValues} parentWidget={widgetDrpData} errors={errors} setErrors={setErrors} dt={dt} />
                  }

                  {radioValues?.widgetViewed === "KPI" &&
                    <KpiWidget handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} setValues={setValues} errors={errors} widgetDrpData={widgetDrpData} tabDrpData={tabDrpData} dt={dt} />
                  }

                  {radioValues?.widgetViewed === "Criteria_Map" &&
                    <MapWidget handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} setValues={setValues} parentWidget={widgetDrpData} errors={errors} dt={dt} />
                  }

                  {radioValues?.widgetViewed === "News_Ticker" &&
                    <NewsTickWidget handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} setValues={setValues} errors={errors} dt={dt} />
                  }
                </>

              }

              {(tabName?.value === 4 && (radioValues?.widgetViewed === "Criteria_Map" || radioValues?.widgetViewed === "Graph" || radioValues?.widgetViewed === "Tabular")) &&
                <ParamsDetail handleValueChange={handleValueChange} values={values} pageName={'widget'} parameterDrpData={parameterDrpData} availableOptions={availableOptions} setAvailableOptions={setAvailableOptions} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} errors={errors} dt={dt} />}

              {tabName?.value === 5 &&
                <JndiDetails handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} errors={errors} dt={dt} />}

              {tabName?.value === 6 &&
                <FooterDetails handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} errors={errors} dt={dt} />}

              {showWidgetTable &&
                <GlobalDataTable title={dt("Widget List")} column={widgetColumn} data={widgetFilterData} onModify={handleUpdateData} onDelete={handleDeleteParams} onClose={onTableClose} setSearchInput={setWidgetSearchInput} isShowBtn={true} />
              }
              {showParamsTable &&
                <GlobalDataTable title={dt("Parameter List")} column={paramsColumn} data={filterData} onModify={null} onDelete={null} onClose={onTableClose} setSearchInput={setSearchInput} isShowBtn={false} />
              }
              {showWebServiceTable &&
                <DataServiceTable data={dataServiceData} onModify={null} onDelete={null} setSearchInput={setSearchInput} onClose={onTableClose} isShowBtn={false} />
              }


              <b><h6 className='header-devider mt-4'></h6></b>

              <div className='text-center mt-2 pre-nxt-btn'>
                <button className='btn btn-sm ms-1'
                  onClick={() => previousTab()}
                  disabled={tabIndex > 1 ? false : true}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="dropdown-gear-icon me-2" />
                  {dt('Previous')}
                </button>
                {tabIndex === tabNavMenus?.length ? <></> :
                  <button className='btn btn-sm ms-1' onClick={() => saveTabsData()}>
                    {`${tabIndex < tabNavMenus?.length ? dt('Save & Next') : dt('Save')}`}
                    {tabIndex < tabNavMenus?.length &&
                      <FontAwesomeIcon icon={faArrowRight} className="dropdown-gear-icon ms-2" />
                    }
                  </button>
                }

              </div>
            </div>
            :
            <>
              <b><h6 className='header-devider m-0'>{dt('Widget Master - Basic Details')}</h6></b>
              <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Widget For')} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputSelect
                        id="widgetFor"
                        name="widgetFor"
                        placeholder="Select value..."
                        options={dashboardForDt}
                        className="backcolorinput"
                        value={values?.widgetFor}
                        onChange={(e) => { handleValueChange(e); localStorage?.setItem("dfor", e.target.value) }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        </div>
      </div>

    </>
  )
}

export default WidgetMaster

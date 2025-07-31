import React, { useContext, useEffect, useState } from 'react'
import GlobalButtonGroup from '../../components/commons/GlobalButtonGroup'
import NavbarHeader from '../../components/headers/NavbarHeader'
import { HISContext } from '../../contextApi/HISContext';
import InputSelect from '../../components/commons/InputSelect';
import InputField from '../../components/commons/InputField';
import TabNav from '../../components/commons/TabNav';
import AboutTab from '../../components/dashboardMasters/tabMaster/AboutTab';
import TabDetails from '../../components/dashboardMasters/tabMaster/TabDetails';
import WidgetMapping from '../../components/dashboardMasters/tabMaster/WidgetMapping';
import ParamsDetail from '../../components/dashboardMasters/tabMaster/ParamsDetail';
import JndiDetails from '../../components/dashboardMasters/widgetMaster/JndiDetails';
import FooterDetails from '../../components/dashboardMasters/tabMaster/FooterDetails';
import HelpDocs from '../../components/dashboardMasters/tabMaster/HelpDocs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import GlobalDataTable from '../../components/commons/GlobalDataTable';
import { ToastAlert } from '../../utils/commonFunction';
import { fetchPostData } from '../../../../utils/HisApiHooks';

const TabMaster = () => {

  const { dashboardForDt, getDashboardForDrpData, widgetDrpData, getAllWidgetData, getAllParameterData, parameterDrpData, getAllTabsData, allTabsData, setShowDataTable, setSelectedOption, selectedOption, actionMode, setActionMode, tabDrpData, setLoading, setShowConfirmSave, confirmSave, setConfirmSave, getDashConfigData, singleConfigData, dt } = useContext(HISContext);
  const [tabIndex, setTabIndex] = useState(1);
  const [tabName, setTabName] = useState({ value: 1, label: "About Tab" });
  const [showTabsTable, setShowTabsTable] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [singleData, setSingleData] = useState([]);
  const [filterData, setFilterData] = useState(allTabsData)
  const [rows, setRows] = useState([{ rptId: "", displayOrder: "", widgetWidth: "", widgetHeight: "0", widgetColor: "", widgetDisplay: "", sectionId: "1", animation: "" }]);
  const [isInputChanged, setIsInputChanged] = useState(false);

  const [values, setValues] = useState({
    "tabFor": "", "tabNameDisplay": "", "tabNameInternal": "", "parentTab": "", "ellipseInDisplay": "",
    "tabIconImage": "", "iconName": "", "id": '',
    //tab details
    "tabNameFontWeight": "500", "tabDetailBgColor": "", "tabTopPadding": "10", "buttonMarginHeading": "",
    "tabNameFontSize": "12", "tabNameTxtDecorat": "none", "tabDetailTitleColor": "",
    //parameter detail
    "parameterOption": "1", "loadOption": "ONWINDOWLOAD", "paraComboBgColor": "", "paraComboFontColor": "", "paraLabelFontColor": "", "paraRemark": "", 'allParameters': "",
    //jndi
    "jndiSavingData": "", "stmtTimeOut": "",
    //footer
    "footerAlignment": "", "footerQuery": "", "footerText": "", "webRefName": "", "webServiceName": "",
    //helpDocs
    "helpDocs": [],
    //widget
    "widgetMappingDetail": []
  })

  const [radioValues, setRadioValues] = useState({
    "isTabUsedForDrill": "No", "isTabNameInReportReq": "No", "isCssTabIconReq": "No",
    //tab details
    "showTabNameInDetail": "Yes", "widgetMaxMin": "No",
    //footer detail
    "isLegendCollapes": "Yes", "isMarqueeReq": "No", "isLegendBorderReq": "Yes",
  })

  //multi params
  const [availableOptions, setAvailableOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [errors, setErrors] = useState({ tabForErr: "", tabNameDisplayErr: "", tabNameInternalErr: "", tabNameFontWeightErr: "", tabNameFontSizeErr: "", tabNameTxtDecoratErr: "", showTabNameInDetailErr: "", displayOrderErr: "", widgetWidthErr: "", widgetHeightErr: "", fileNameForManualDocumentErr: "", displayNameForManualDocumentErr: "" });

  useEffect(() => {
    const localValues = localStorage.getItem('values');
    const localRadio = localStorage.getItem('radio');
    if (localValues && localValues !== '') {
      setValues(JSON.parse(localValues));
    }
    if (localRadio && localRadio !== '') {
      setRadioValues(JSON.parse(localRadio));
    }

  }, []);

  //to set value of dashboard for auto
  const dashFor = localStorage.getItem('dfor');
  useEffect(() => {
    if (dashFor) {
      setValues({ ...values, "tabFor": dashFor })
    }
  }, [dashFor])

  useEffect(() => {
    if (dashboardForDt?.length === 0) { getDashboardForDrpData(); }
    if (!singleConfigData) {
      getDashConfigData()
    }
  }, [])

  useEffect(() => {
    if (values?.tabFor) {
      getAllWidgetData(values?.tabFor);
      getAllParameterData(values?.tabFor)
      getAllTabsData(values?.tabFor)
    }
  }, [values?.tabFor])

  useEffect(() => {
    if (values?.allParameters !== "") {
      const selectedIds = values?.allParameters?.split(",")?.map(id => id?.trim());
      // const fdt = parameterDrpData?.filter(dt => selectedIds?.includes(dt?.value?.toString()));
      const fdt = selectedIds?.map(id => parameterDrpData?.find(dt => dt.value?.toString() === id))?.filter(Boolean);
      const availableOptions = parameterDrpData?.filter(dt => !selectedIds?.includes(dt?.value?.toString()));

      setSelectedOptions(fdt?.length > 0 ? fdt : []);
      setAvailableOptions(availableOptions);
    } else {
      setSelectedOptions([]);
      setAvailableOptions(parameterDrpData);
    }
  }, [values?.allParameters, parameterDrpData]);

  useEffect(() => {
    if (selectedOptions?.length > 0) {
      const selectedIdParams = selectedOptions?.length > 0 ? selectedOptions?.map(option => option?.value).join(",") : '';
      setValues({
        ...values,
        ['allParameters']: selectedIdParams
      })
    }
  }, [selectedOptions])

  //parameter search
  useEffect(() => {
    if (!searchInput) {
      setFilterData(allTabsData);
    } else {
      const lowercasedText = searchInput.toLowerCase();
      const newFilteredData = allTabsData.filter(row => {
        const paramId = row?.id?.toString() || "";
        const paramName = row?.jsonData?.dashboardName?.toLowerCase() || "";
        const paramDisplayName = row?.jsonData?.dashboardActualName?.toLowerCase() || "";

        return paramId?.includes(lowercasedText) || paramName.includes(lowercasedText) || paramDisplayName.includes(lowercasedText);
      });
      setFilterData(newFilteredData);
    }
  }, [searchInput, allTabsData]);

  const handleRadioChange = (e) => {
    const { name, value, type, checked } = e.target;
    const error = name + 'Err'
    setRadioValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error && name) {
      setErrors({ ...errors, [error]: '' })
    }
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

  const [tabNavMenus, setTabNavMenus] = useState([
    { value: 1, label: "About Tab" },
    { value: 2, label: "Configuration" },
    { value: 3, label: "Widget Mapping" },
    { value: 4, label: "Parameter Detail" },
    { value: 5, label: "JNDI Details" },
    { value: 6, label: "Footer Details" },
    { value: 7, label: "Help Docs" },

  ]);

  const saveMenuTabsData = () => {
    let nextTab = tabIndex + 1;
    if (tabNavMenus?.length >= nextTab) {
      setTabName(tabNavMenus[nextTab - 1])
      setTabIndex(nextTab)
    }
    localStorage.setItem('values', JSON.stringify(values));
    localStorage.setItem('radio', JSON.stringify(radioValues));
  }

  const previousTab = () => {
    let nextTab = tabIndex - 1;
    if (nextTab >= 1) {
      setTabName(tabNavMenus[nextTab - 1])
      setTabIndex(nextTab);
    }
  }

  const onOpenDataTable = () => {
    setShowDataTable(true)
    setShowTabsTable(true)
  }

  const onTableClose = () => {
    setShowTabsTable(false);
    setSearchInput('');
    setSelectedOption([]);
  }

  const handleUpdateData = () => {
    if (selectedOption?.length > 0) {
      const selectedRow = allTabsData?.filter(dt => dt?.id === selectedOption[0]?.id)
      reset()
      setSingleData(selectedRow);
      setActionMode('edit');
      setShowDataTable(false);
      setTabIndex(1);
      setTabName({ value: 1, label: "About Tab" });
      onTableClose();
      // setIsInputChanged(true)
    } else {
      ToastAlert('Please select a record', 'warning');
    }
  }

  useEffect(() => {
    if (singleData?.length > 0) {
      setLoading(true)
      const jsonData = singleData[0]?.jsonData || {};
      setValues({
        ...values,
        id: singleData[0]?.id,//
        tabFor: singleData[0]?.dashboardFor,//
        tabNameDisplay: jsonData?.dashboardName,///
        tabNameInternal: jsonData?.dashboardActualName,//
        parentTab: jsonData?.parentTabId,//
        ellipseInDisplay: jsonData?.ellipseAfterNoOfCharacterInTabDisplayName,//
        tabIconImage: jsonData?.iconImageName,//
        iconName: jsonData?.iconName,//
        // tab details:
        tabNameFontWeight: jsonData?.tabnameFontWeight,//
        tabDetailBgColor: jsonData?.tabBackgroundColor,
        tabTopPadding: jsonData?.tabTopPadding,//
        buttonMarginHeading: jsonData?.marginBottom,//
        tabNameFontSize: jsonData?.tabnameFontSize,//
        tabNameTxtDecorat: jsonData?.tabnameDecoration,//
        tabDetailTitleColor: jsonData?.tabTitleFontColor,//
        // parameter detail
        parameterOption: jsonData?.parameterOptions,//
        loadOption: jsonData?.tabLoadOption,//
        paraComboBgColor: jsonData?.tabParameterComboBGColor,//
        paraComboFontColor: jsonData?.tabParameterComboFontColor,//
        paraLabelFontColor: jsonData?.tabParameterLabelFontColor,//
        paraRemark: jsonData?.parameterRemarks,//
        allParameters: jsonData?.allParameters,
        // jndi
        jndiSavingData: jsonData?.JNDIid,//
        stmtTimeOut: jsonData?.statementTimeOut,//
        // footer
        footerAlignment: jsonData?.footerAlign,//
        footerQuery: jsonData?.lastUpdatedQuery,//
        footerText: jsonData?.footerText,//
        webRefName: jsonData?.footerserviceReferenceNo,//
        webServiceName: jsonData?.footerwebserviceUrl,//
        // helpDocs
        helpDocs: jsonData?.docJsonString ? JSON.parse(jsonData?.docJsonString) : [],
        // widget
        widgetMappingDetail: jsonData?.lstDashboardWidgetMapping || [],
      });

      setRadioValues({
        ...radioValues,
        isTabUsedForDrill: jsonData?.isTabUsedForDrillDown,//
        isTabNameInReportReq: jsonData?.tabNameInReportRequired,//
        isCssTabIconReq: jsonData?.isCSSTabIconRequired,//

        showTabNameInDetail: jsonData?.isShowTabNameInDetailTitle,//
        widgetMaxMin: jsonData?.widgetMaxMinSize,//

        isLegendCollapes: jsonData?.isLegendCollapes,//
        isMarqueeReq: jsonData?.isMarqueeRequired,//
        isLegendBorderReq: jsonData?.isLegendBorderRequired,//

      })
      setLoading(false)
    }
  }, [singleData]);


  const saveTabData = () => {
    setLoading(true);
    const {
      tabFor, tabNameDisplay, tabNameInternal, parentTab, ellipseInDisplay, tabIconImage, iconName,

      tabNameFontWeight, tabDetailBgColor, tabTopPadding, buttonMarginHeading, tabNameFontSize, tabNameTxtDecorat, tabDetailTitleColor,

      parameterOption, loadOption, paraComboBgColor, paraComboFontColor, paraLabelFontColor, paraRemark,

      footerAlignment, footerQuery, footerText, webRefName, webServiceName,
      // helpDocs
      helpDocs,
      // widget
      widgetMappingDetail,
      jndiSavingData, stmtTimeOut
    } = values;

    const {
      isTabUsedForDrill, isTabNameInReportReq, isCssTabIconReq,
      showTabNameInDetail, widgetMaxMin, isLegendCollapes,
      isMarqueeReq, isLegendBorderReq, } = radioValues;

    const selectedIdParams = selectedOptions?.length > 0 ? selectedOptions?.map(option => option?.value).join(",") : '';

    const val = {
      dashboardFor: tabFor,
      masterName: "DashboardMst",
      entryUserId: 101,
      jndiIdForGettingData: jndiSavingData,
      statementTimeout: stmtTimeOut,
      keyName: tabNameDisplay,
      jsonData: {
        //about
        dashboardName: tabNameDisplay, dashboardActualName: tabNameInternal, parentTabId: parentTab, ellipseAfterNoOfCharacterInTabDisplayName: ellipseInDisplay, iconImageName: tabIconImage, iconName: iconName, isTabUsedForDrillDown: isTabUsedForDrill, tabNameInReportRequired: isTabNameInReportReq, isCSSTabIconRequired: isCssTabIconReq,
        //tab
        tabnameFontWeight: tabNameFontWeight, tabBackgroundColor: tabDetailBgColor, tabTopPadding: tabTopPadding, marginBottom: buttonMarginHeading, tabnameFontSize: tabNameFontSize, tabnameDecoration: tabNameTxtDecorat, tabTitleFontColor: tabDetailTitleColor,
        //params
        parameterOptions: parameterOption, tabLoadOption: loadOption, tabParameterComboBGColor: paraComboBgColor, tabParameterComboFontColor: paraComboFontColor, tabParameterLabelFontColor: paraLabelFontColor, parameterRemarks: paraRemark,
        allParameters: selectedIdParams,
        //jndi
        statementTimeOut: stmtTimeOut, JNDIid: jndiSavingData,
        //footer and list
        footerAlign: footerAlignment, lastUpdatedQuery: footerQuery, footerText: footerText, footerserviceReferenceNo: webRefName, footerwebserviceUrl: webServiceName, docJsonString: JSON.stringify(helpDocs),
        lstDashboardWidgetMapping: widgetMappingDetail,

        //radios
        isShowTabNameInDetailTitle: showTabNameInDetail,
        widgetMaxMinSize: widgetMaxMin,
        isLegendCollapes: isLegendCollapes,
        isMarqueeRequired: isMarqueeReq,
        isLegendBorderRequired: isLegendBorderReq,

      }
    };

    fetchPostData("/hisutils/Tabsave", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Saved Successfully", "success");
        getAllTabsData(values?.tabFor)
        setActionMode('home');
        reset();
        setConfirmSave(false);
        setLoading(false)
      } else {
        ToastAlert(data?.message, "error");
        setConfirmSave(false);
        setLoading(false)
      }
    });
  };

  const updateTabData = () => {
    setLoading(true)
    const {
      tabFor, tabNameDisplay, tabNameInternal, parentTab, ellipseInDisplay, tabIconImage, iconName, id,

      tabNameFontWeight, tabDetailBgColor, tabTopPadding, buttonMarginHeading, tabNameFontSize, tabNameTxtDecorat, tabDetailTitleColor,

      parameterOption, loadOption, paraComboBgColor, paraComboFontColor, paraLabelFontColor, paraRemark,

      footerAlignment, footerQuery, footerText, webRefName, webServiceName,
      // helpDocs
      helpDocs,
      // widget
      widgetMappingDetail,
      jndiSavingData, stmtTimeOut
    } = values;

    const {
      isTabUsedForDrill, isTabNameInReportReq, isCssTabIconReq,
      showTabNameInDetail, widgetMaxMin, isLegendCollapes,
      isMarqueeReq, isLegendBorderReq, } = radioValues;
    const selectedIdParams = selectedOptions?.length > 0 ? selectedOptions?.map(option => option?.value).join(",") : '';

    const val = {
      id: id,
      dashboardFor: tabFor,
      masterName: "DashboardMst",
      entryUserId: 101,
      jndiIdForGettingData: jndiSavingData,
      statementTimeout: stmtTimeOut,
      keyName: tabNameDisplay,
      jsonData: {
        //about
        dashboardName: tabNameDisplay, dashboardActualName: tabNameInternal, parentTabId: parentTab, ellipseAfterNoOfCharacterInTabDisplayName: ellipseInDisplay, iconImageName: tabIconImage, iconName: iconName, isTabUsedForDrillDown: isTabUsedForDrill, tabNameInReportRequired: isTabNameInReportReq, isCSSTabIconRequired: isCssTabIconReq,
        //tab
        tabnameFontWeight: tabNameFontWeight, tabBackgroundColor: tabDetailBgColor, tabTopPadding: tabTopPadding, marginBottom: buttonMarginHeading, tabnameFontSize: tabNameFontSize, tabnameDecoration: tabNameTxtDecorat, tabTitleFontColor: tabDetailTitleColor,
        //params
        parameterOptions: parameterOption, tabLoadOption: loadOption, tabParameterComboBGColor: paraComboBgColor, tabParameterComboFontColor: paraComboFontColor, tabParameterLabelFontColor: paraLabelFontColor, parameterRemarks: paraRemark, allParameters: selectedIdParams,
        //jndi
        statementTimeOut: stmtTimeOut, JNDIid: jndiSavingData,
        //footer and list
        footerAlign: footerAlignment, lastUpdatedQuery: footerQuery, footerText: footerText, footerserviceReferenceNo: webRefName, footerwebserviceUrl: webServiceName, docJsonString: JSON.stringify(helpDocs),
        lstDashboardWidgetMapping: widgetMappingDetail,

        //radios
        isShowTabNameInDetailTitle: showTabNameInDetail,
        widgetMaxMinSize: widgetMaxMin,
        isLegendCollapes: isLegendCollapes,
        isMarqueeRequired: isMarqueeReq,
        isLegendBorderRequired: isLegendBorderReq,

      }
    };


    fetchPostData("/hisutils/TabUpdate", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Updated Successfully", "success");
        getAllTabsData(values?.tabFor)
        reset();
        setActionMode('home');
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

  const handleDeleteTab = () => {
    if (selectedOption?.length > 0) {
      setLoading(true)
      const val = { "id": selectedOption[0]?.id, "dashboardFor": values?.tabFor, "masterName": "DashboardMst" };
      fetchPostData("/hisutils/TabDelete", val).then((data) => {
        if (data?.status === 1) {
          ToastAlert('Deleted Successfully!', 'success');
          getAllTabsData(values?.tabFor)
          setSelectedOption([]);
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
    setLoading(true)
    let isValid = true;
    let newErrors = {}; // Collect errors first
    if (!values?.tabFor?.trim()) {
      newErrors.tabForErr = "tab for is required";
      isValid = false;
    }
    if (!values?.tabNameDisplay?.trim()) {
      newErrors.tabNameDisplayErr = "display name is required";
      isValid = false;
    }
    if (!values?.tabNameInternal?.trim()) {
      newErrors.tabNameInternalErr = "internal name is required";
      isValid = false;
    }
    if (!values?.tabNameFontWeight?.trim()) {
      newErrors.tabNameFontWeightErr = "font weight is required";
      isValid = false;
    }
    if (!values?.tabNameFontSize?.trim()) {
      newErrors.tabNameFontSizeErr = "font size is required";
      isValid = false;
    }
    if (!values?.tabNameTxtDecorat?.trim()) {
      newErrors.tabNameTxtDecoratErr = "decoration is required";
      isValid = false;
    }
    if (!radioValues?.showTabNameInDetail?.trim()) {
      newErrors.showTabNameInDetailErr = "tab name in detail is required";
      isValid = false;
    }
    if (rows?.length > 0 && !rows[rows?.length - 1]?.displayOrder) {
      newErrors.displayOrderErr = "required";
      isValid = false;
    }
    if (rows?.length > 0 && !rows[rows?.length - 1]?.widgetWidth) {
      newErrors.widgetWidthErr = "required";
      isValid = false;
    }
    if (rows?.length > 0 && !rows[rows?.length - 1]?.widgetHeight) {
      newErrors.widgetHeightErr = "required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      if (newErrors.tabForErr || newErrors.tabNameDisplayErr || newErrors.tabNameInternalErr) {
        setTabIndex(1);
        setTabName({ value: 1, label: "About Tab" });
      } else if (newErrors.showTabNameInDetailErr || newErrors.tabNameFontWeightErr || newErrors.tabNameFontSizeErr || newErrors.tabNameTxtDecoratErr) {
        setTabIndex(2);
        setTabName({ value: 2, label: "Configuration" });
      } else if (newErrors.displayOrderErr || newErrors.widgetWidthErr || newErrors.widgetHeightErr) {
        setTabIndex(3);
        setTabName({ value: 3, label: "Widget Mapping" });
      }
      setLoading(false)
    } else {
      setShowConfirmSave(true);
      setLoading(false)
    }
  }

  useEffect(() => {
    if (confirmSave) {
      if (actionMode === 'edit') {
        updateTabData();
      } else {
        saveTabData();
      }
    }
  }, [confirmSave])

  const reset = () => {
    setValues({
      "tabFor": "", "tabNameDisplay": "", "tabNameInternal": "", "parentTab": "", "ellipseInDisplay": "",
      "tabIconImage": "", "iconName": "",
      //tab details
      "tabNameFontWeight": "", "tabDetailBgColor": "", "tabTopPadding": "", "buttonMarginHeading": "",
      "tabNameFontSize": "", "tabNameTxtDecorat": "", "tabDetailTitleColor": "",
      //parameter detail
      "parameterOption": "1", "loadOption": "ONWINDOWLOAD", "paraComboBgColor": "", "paraComboFontColor": "", "paraLabelFontColor": "", "paraRemark": "",
      //jndi
      "jndiSavingData": "", "stmtTimeOut": "",
      //footer
      "footerAlignment": "", "footerQuery": "", "footerText": "", "webRefName": "", "webServiceName": "",
      //helpDocs
      "helpDocs": [],
      //widget
      "widgetMappingDetail": []
    })
    setRadioValues({
      "isTabUsedForDrill": "No", "isTabNameInReportReq": "No", "isCssTabIconReq": "No",
      //tab details
      "showTabNameInDetail": "Yes", "widgetMaxMin": "",
      //footer detail
      "isLegendCollapes": "Yes", "isMarqueeReq": "No", "isLegendBorderReq": "Yes",
    })
    setActionMode('home');
    setShowTabsTable(false);
    setShowDataTable(false);
    setTabIndex(1);
    // setTabName({ value: 1, label: "About Widget" })
    setTabName({ value: 1, label: "About Tab" });
    setErrors({ tabForErr: "", tabNameDisplayErr: "", tabNameInternalErr: "", tabNameFontWeightErr: "", tabNameFontSizeErr: "", tabNameTxtDecoratErr: "", showTabNameInDetailErr: "" });
    localStorage.removeItem('values');
    localStorage.removeItem('radio');
    setLoading(false)
    setRows([{ rptId: "", displayOrder: "", widgetWidth: "", widgetHeight: "0", widgetColor: "", widgetDisplay: "", sectionId: "1", animation: "" }])
    // setIsInputChanged(false)
  }

  const column = [
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
              checked={selectedOption[0]?.id === row?.id}
              onChange={(e) => { setSelectedOption([row]) }}
            />
          </span>
        </div>,
      width: "8%"
    },
    {
      name: dt('Tab ID'),
      selector: row => row.id,
      sortable: true,
      width: "8%"
    },
    {
      name: dt('Tab Display Name'),
      selector: row => row?.jsonData?.dashboardName || "---",
      sortable: true,
    },
    {
      name: dt('Tab Name'),
      selector: row => row?.jsonData?.dashboardActualName || "---",
      sortable: true,
    },
    {
      name: dt('Parent Name'),
      selector: row => allTabsData.filter(dt => dt?.jsonData?.parentTabId && dt?.jsonData?.dashboardId === row?.jsonData?.parentTabId)[0]?.jsonData?.dashboardName || "No Parent",
      // selector: row => row?.jsonData?.parentTabId || "---",
      sortable: true,
    },
  ]


  return (
    <>

      <NavbarHeader />
      <div className='main-master-page'>
        {values?.tabFor &&
          <div className='row w-100 m-0'>
            <div className='col-sm-6 p-0 global-button-group'>
              <GlobalButtonGroup isSave={true} isOpen={true} isReset={true} isParams={false} isWeb={false} onSave={handleSaveUpdate} onOpen={onOpenDataTable} onReset={reset} onParams={null} onWeb={null} />
            </div>
            <div className='col-sm-6 p-0 global-tabs'>
              <TabNav isTabNav={true} tabNavData={tabNavMenus} setTabIndex={setTabIndex} tabName={tabName} setTabName={setTabName} />
            </div>
          </div>
        }

        <div className='form-card m-auto p-2'>
          <div className='p-1'>
            {tabName?.value === 1 &&
              <AboutTab handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} dashboardForDt={dashboardForDt} setValues={setValues} tabDrpData={tabDrpData} errors={errors} dt={dt} />
            }
            {tabName?.value === 2 &&
              <TabDetails handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} errors={errors} dt={dt} />
            }
            {tabName?.value === 3 &&
              <WidgetMapping handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} widgetDrpData={widgetDrpData} setValues={setValues} rows={rows} setRows={setRows} errors={errors} setErrors={setErrors} dt={dt} />
            }
            {tabName?.value === 4 &&
              <ParamsDetail handleValueChange={handleValueChange} values={values} parameterDrpData={parameterDrpData} pageName={'tab'} availableOptions={availableOptions} setAvailableOptions={setAvailableOptions} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} dt={dt} />
            }
            {tabName?.value === 5 &&
              <JndiDetails handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} dt={dt} />
            }
            {tabName?.value === 6 &&
              <FooterDetails handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} dt={dt} />
            }
            {tabName?.value === 7 &&
              <HelpDocs handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} setValues={setValues} {...{ errors, setErrors }} dt={dt} />
            }


            <b><h6 className='header-devider mt-4'></h6></b>
            {values?.tabFor &&
              <div className='text-center mt-2 pre-nxt-btn'>
                <button className='btn btn-sm ms-1'
                  onClick={() => previousTab()}
                  disabled={tabIndex > 1 ? false : true}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="dropdown-gear-icon me-2" />
                  {dt('Previous')}
                </button>
                {tabIndex === tabNavMenus?.length ? <></> :
                  <button className='btn btn-sm ms-1' onClick={() => saveMenuTabsData()}>
                    {`${tabIndex < tabNavMenus?.length ? dt('Save & Next') : dt('Save')}`}
                    {tabIndex < tabNavMenus?.length &&
                      <FontAwesomeIcon icon={faArrowRight} className="dropdown-gear-icon ms-2" />
                    }
                  </button>
                }
              </div>
            }
          </div>
        </div>
        {showTabsTable &&
          <GlobalDataTable title={dt("Tab List")} column={column} data={filterData} onModify={handleUpdateData} onDelete={handleDeleteTab} setSearchInput={setSearchInput} onClose={onTableClose} isShowBtn={true} />
        }
      </div>
    </>
  )
}

export default TabMaster

import React, { useContext, useEffect, useState } from 'react'
import NavbarHeader from '../../components/headers/NavbarHeader'
import GlobalButtonGroup from '../../components/commons/GlobalButtonGroup'
import TabNav from '../../components/commons/TabNav'
import AboutDashboard from '../../components/dashboardMasters/dashboardMaster/AboutDashboard'
import TabDetails from '../../components/dashboardMasters/dashboardMaster/TabDetails'
import HeaderDetails from '../../components/dashboardMasters/dashboardMaster/HeaderDetails'
import ParamsDetails from '../../components/dashboardMasters/dashboardMaster/ParamsDetails'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { HISContext } from '../../contextApi/HISContext'
import { ToastAlert } from '../../utils/commonFunction'
import GlobalDataTable from '../../components/commons/GlobalDataTable'
import { fetchPostData } from '../../../../utils/HisApiHooks'
import { decryptAesOrRsa, encryptData } from '../../../../utils/SecurityConfig'

const DashboardMaster = () => {

  const { dashboardForDt, getDashboardForDrpData, getAllParameterData, parameterDrpData, getAllTabsData, setShowDataTable, setSelectedOption, selectedOption, actionMode, setActionMode, tabDrpData, getAllDashboardData, dashboardData, setLoading, setShowConfirmSave, confirmSave, setConfirmSave, getDashConfigData, singleConfigData, dt } = useContext(HISContext);

  const [tabIndex, setTabIndex] = useState(1);
  const [tabName, setTabName] = useState({ value: 1, label: "About Dashboard" });
  const [showDashboardTable, setShowDashboardTable] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [singleData, setSingleData] = useState([]);
  const [filterData, setFilterData] = useState(dashboardData)
  //multi params
  const [availableOptions, setAvailableOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState();

  const [availableOptionsTab, setAvailableOptionsTab] = useState([]);
  const [selectedOptionsTab, setSelectedOptionsTab] = useState();


  const [values, setValues] = useState({
    "dashboardFor": "", "dashNameDisplay": "", "dashNameInternal": "", "menuContainerBgColor": "", "dashTitlefontColor": "", "iconColor": "", "menuContainerBgImage": "", "cachingStatus": '', "dataLoad": "ALL", "id": "",
    //tab
    "tabDisplayStyle": "TOP", "tabIconType": "IMAGE", "timeInterval": "", "changeIntervalTime": "", "textshadowColor": "", "tabFontColor": "", "tabBgColorOnHover": "", "tabFontColorOnHover": '', "tabMenuWidthBigIcon": "3",
    "tabMenuHeightBigIcon": "", "tabShapesBigIcon": "",
    //header
    "headerHtml": "", "headerCss": "", "rptHeaderbyQuery": "",
    //parameter
    "parameterOption": "",
    'dashboardIds': "", 'allSelectedParaList': ""
  })

  const [radioValues, setRadioValues] = useState({
    "isPrintBtnReq": "Yes", "dashboardTheme": "Default",
    //tab
    "isTopBarVisible": "No", "isFixedLayout": "Yes", "isSidebarCollapse": "Yes",
    //header
    "isHeaderReq": "No", "showHeader": "Only in Big Icon Menu", "showHeaderInGlobalDash": "No", "rptHeaderTypePdfExl": "1", "isActive": "Yes",
  })
  const [errors, setErrors] = useState({ dashboardForErr: "", dashNameDisplayErr: "", dashNameInternalErr: "", rptHeaderbyQueryErr: "" });

  const [tabNavMenus, setTabNavMenus] = useState([
    { value: 1, label: "About Dashboard" },
    { value: 2, label: "Tab Details" },
    { value: 3, label: "Header Details" },
    { value: 4, label: "Parameter Detail" }
  ]);

  useEffect(() => {
    if (dashboardForDt?.length === 0) { getDashboardForDrpData(); }
    if (!singleConfigData) {
      getDashConfigData()
    }
  }, [])


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

  const dashFor = localStorage.getItem('dfor');
  useEffect(() => {
    if (dashFor) {
      setValues({ ...values, "dashboardFor": dashFor })
    }
  }, [dashFor])

  //parameter search
  useEffect(() => {
    if (!searchInput) {
      setFilterData(dashboardData);
    } else {
      const lowercasedText = searchInput.toLowerCase();
      const newFilteredData = dashboardData.filter(row => {
        const paramId = row?.id?.toString() || "";
        const paramName = row?.jsonData?.groupName?.toLowerCase() || "";
        const paramDisplayName = row?.jsonData?.groupUrl?.toLowerCase() || "";

        return paramId?.includes(lowercasedText) || paramName.includes(lowercasedText) || paramDisplayName.includes(lowercasedText);
      });
      setFilterData(newFilteredData);
    }
  }, [searchInput, dashboardData]);

  useEffect(() => {
    if (values?.dashboardFor) {
      getAllDashboardData(values?.dashboardFor);
      getAllParameterData(values?.dashboardFor)
      getAllTabsData(values?.dashboardFor)
    }
  }, [values?.dashboardFor])

  useEffect(() => {
    if (values?.allSelectedParaList !== "") {
      const selectedIds = values?.allSelectedParaList?.split(",")?.map(id => id?.trim());
      // const fdt = parameterDrpData?.filter(dt => selectedIds?.includes(dt?.value?.toString()));
      const fdt = selectedIds?.map(id => parameterDrpData?.find(dt => dt.value?.toString() === id))?.filter(Boolean);
      const availableOptions = parameterDrpData?.filter(dt => !selectedIds?.includes(dt?.value?.toString()));

      setSelectedOptions(fdt);
      setAvailableOptions(availableOptions);
    } else {
      setSelectedOptions([]);
      setAvailableOptions(parameterDrpData);
    }
  }, [values?.allSelectedParaList, parameterDrpData]);

  useEffect(() => {
    if (selectedOptions?.length > 0) {
      const selectedIdParams = selectedOptions?.length > 0 ? selectedOptions?.map(option => option?.value).join(",") : '';
      setValues({
        ...values,
        ['allSelectedParaList']: selectedIdParams
      })
    }
  }, [selectedOptions])

  useEffect(() => {
    if (values?.dashboardIds !== "") {
      const selectedIds = values?.dashboardIds?.split(",")?.map(id => id?.trim());
      // const fdt = tabDrpData?.filter(dt => selectedIds?.includes(dt?.value?.toString()));
      const fdt = selectedIds?.map(id => tabDrpData?.find(dt => dt.value?.toString() === id))?.filter(Boolean);
      const availableOptions = tabDrpData?.filter(dt => !selectedIds?.includes(dt?.value?.toString()));

      setSelectedOptionsTab(fdt);
      setAvailableOptionsTab(availableOptions);
    } else {
      setSelectedOptionsTab([]);
      setAvailableOptionsTab(tabDrpData);
    }
  }, [values?.dashboardIds, tabDrpData]);

  useEffect(() => {
    if (selectedOptionsTab?.length > 0) {
      const selectedIdParams = selectedOptionsTab?.length > 0 ? selectedOptionsTab?.map(option => option?.value).join(",") : '';
      setValues({
        ...values,
        ['dashboardIds']: selectedIdParams
      })
    }
  }, [selectedOptionsTab])

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

  useEffect(() => {
    if (singleData?.length > 0) {
      setLoading(true)
      const jsonData = singleData[0]?.jsonData || {};
      setValues({
        ...values,
        id: singleData[0]?.id,//
        dashboardFor: singleData[0]?.dashboardFor,//
        dashNameDisplay: jsonData?.groupName,//
        dashNameInternal: jsonData?.groupNameInternal,//
        menuContainerBgColor: jsonData?.dashboardMenuContainerBackground,//
        dashTitlefontColor: jsonData?.dashboardHeadingFontColor,//
        iconColor: jsonData?.iconColor,//
        menuContainerBgImage: jsonData?.dashboardMenuContainerBackgroundImage,//
        cachingStatus: jsonData?.cachingStatus,//
        dataLoad: jsonData?.dashboardDataLoad,//
        //tab  
        tabDisplayStyle: jsonData?.tabDisplayStyle,//
        tabIconType: jsonData?.iconType,//
        timeInterval: jsonData?.timeInterval,//
        changeIntervalTime: jsonData?.changeInterval,//
        textshadowColor: jsonData?.textShadowColour,//
        tabFontColor: jsonData?.tabFont,//
        tabBgColorOnHover: jsonData?.tabColourHover,//
        tabFontColorOnHover: jsonData?.tabFontColourHover,//
        tabMenuWidthBigIcon: jsonData?.tabIconWidth,//
        tabMenuHeightBigIcon: jsonData?.tabIconHeight,//
        tabShapesBigIcon: jsonData?.tabShape,//
        //header  
        headerHtml: jsonData?.headerHTML,//
        headerCss: jsonData?.headerCSS,//
        rptHeaderbyQuery: jsonData?.reportHeaderByQuery,//
        //parameter  
        parameterOption: jsonData?.parameterOptions,  //
        dashboardIds: jsonData?.dashboardIds,
        allSelectedParaList: jsonData?.allSelectedParaList,
      });

      setRadioValues({
        ...radioValues,
        isPrintBtnReq: jsonData?.printButton, // 
        dashboardTheme: jsonData?.dashboardTheme,  //

        //tab  
        isTopBarVisible: jsonData?.isTopTabBarVisible, // 
        isFixedLayout: jsonData?.isFixedLayout,  //
        isSidebarCollapse: jsonData?.isSidebarCollapse,  //

        //header  
        isHeaderReq: jsonData?.isHeaderRequired,  //
        showHeader: jsonData?.showHeader,  //
        showHeaderInGlobalDash: jsonData?.showHeaderGlobalDashboardOnly,  //
        rptHeaderTypePdfExl: jsonData?.isStaticHeaderRequired, // 
        isActive: jsonData?.isActive,  //

      })
      setLoading(false)
    }
  }, [singleData]);

  const saveDashboardData = () => {
    setLoading(true)
    const {
      dashboardFor, dashNameDisplay, dashNameInternal, menuContainerBgColor, dashTitlefontColor, iconColor, menuContainerBgImage, cachingStatus, dataLoad,
      //tab  
      tabDisplayStyle, tabIconType, timeInterval, changeIntervalTime, textshadowColor, tabFontColor,
      tabBgColorOnHover, tabFontColorOnHover, tabMenuWidthBigIcon, tabMenuHeightBigIcon, tabShapesBigIcon,
      //header  
      headerHtml, headerCss, rptHeaderbyQuery,
      //parameter  
      parameterOption } = values;

    const {
      isPrintBtnReq, dashboardTheme,
      //tab  
      isTopBarVisible, isFixedLayout, isSidebarCollapse,
      //header  
      isHeaderReq, showHeader, showHeaderInGlobalDash, rptHeaderTypePdfExl, isActive, } = radioValues;

    const selectedIdParams = selectedOptions?.length > 0 ? selectedOptions?.map(option => option?.value).join(",") : '';
    const selectedIdTabs = selectedOptionsTab?.length > 0 ? selectedOptionsTab?.map(option => option?.value).join(",") : '';

    const val = {
      dashboardFor: dashboardFor,
      masterName: "DashboardGroupingMst",
      entryUserId: 101,
      // jndiIdForGettingData: jndiSavingData,
      // statementTimeout: stmtTimeOut,
      keyName: dashNameDisplay,
      jsonData: {
        groupName: dashNameDisplay,
        groupNameInternal: dashNameInternal,
        dashboardMenuContainerBackground: menuContainerBgColor,
        dashboardHeadingFontColor: dashTitlefontColor,
        iconColor: iconColor,
        dashboardMenuContainerBackgroundImage: menuContainerBgImage,
        cachingStatus: cachingStatus,
        dashboardDataLoad: dataLoad,

        tabDisplayStyle: tabDisplayStyle,
        iconType: tabIconType,
        timeInterval: timeInterval,
        changeInterval: changeIntervalTime,
        textShadowColour: textshadowColor,
        tabFont: tabFontColor,
        tabColourHover: tabBgColorOnHover,
        tabFontColourHover: tabFontColorOnHover,
        tabIconWidth: tabMenuWidthBigIcon,
        tabIconHeight: tabMenuHeightBigIcon,
        tabShape: tabShapesBigIcon,

        headerHTML: headerHtml,
        headerCSS: headerCss,
        reportHeaderByQuery: rptHeaderbyQuery,
        parameterOptions: parameterOption,

        dashboardIds: selectedIdTabs,
        allSelectedParaList: selectedIdParams,

        printButton: isPrintBtnReq,
        dashboardTheme: dashboardTheme,
        isTopTabBarVisible: isTopBarVisible,
        isFixedLayout: isFixedLayout,
        isSidebarCollapse: isSidebarCollapse,
        isHeaderRequired: isHeaderReq,
        showHeader: showHeader,
        showHeaderGlobalDashboardOnly: showHeaderInGlobalDash,
        isStaticHeaderRequired: rptHeaderTypePdfExl,
        isActive: isActive,

      }
    };

    fetchPostData("/hisutils/dashboardSave", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Saved Successfully", "success");
        getAllDashboardData(values?.dashboardFor)
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

  const updateDashboardData = () => {
    setLoading(true)
    const {
      dashboardFor, dashNameDisplay, dashNameInternal, menuContainerBgColor, dashTitlefontColor, iconColor, menuContainerBgImage, cachingStatus, dataLoad, id,
      //tab  
      tabDisplayStyle, tabIconType, timeInterval, changeIntervalTime, textshadowColor, tabFontColor,
      tabBgColorOnHover, tabFontColorOnHover, tabMenuWidthBigIcon, tabMenuHeightBigIcon, tabShapesBigIcon,
      //header  
      headerHtml, headerCss, rptHeaderbyQuery,
      //parameter  
      parameterOption } = values;

    const {
      isPrintBtnReq, dashboardTheme,
      //tab  
      isTopBarVisible, isFixedLayout, isSidebarCollapse,
      //header  
      isHeaderReq, showHeader, showHeaderInGlobalDash, rptHeaderTypePdfExl, isActive, } = radioValues;
    const selectedIdParams = selectedOptions?.length > 0 ? selectedOptions?.map(option => option?.value).join(",") : '';
    const selectedIdTabs = selectedOptionsTab?.length > 0 ? selectedOptionsTab?.map(option => option?.value).join(",") : '';

    const val = {
      id: id,
      dashboardFor: dashboardFor,
      masterName: "DashboardGroupingMst",
      entryUserId: 101,
      // jndiIdForGettingData: jndiSavingData,
      // statementTimeout: stmtTimeOut,
      keyName: dashNameDisplay,
      jsonData: {
        groupName: dashNameDisplay,
        groupNameInternal: dashNameInternal,
        dashboardMenuContainerBackground: menuContainerBgColor,
        dashboardHeadingFontColor: dashTitlefontColor,
        iconColor: iconColor,
        dashboardMenuContainerBackgroundImage: menuContainerBgImage,
        cachingStatus: cachingStatus,
        dashboardDataLoad: dataLoad,

        tabDisplayStyle: tabDisplayStyle,
        iconType: tabIconType,
        timeInterval: timeInterval,
        changeInterval: changeIntervalTime,
        textShadowColour: textshadowColor,
        tabFont: tabFontColor,
        tabColourHover: tabBgColorOnHover,
        tabFontColourHover: tabFontColorOnHover,
        tabIconWidth: tabMenuWidthBigIcon,
        tabIconHeight: tabMenuHeightBigIcon,
        tabShape: tabShapesBigIcon,

        headerHTML: headerHtml,
        headerCSS: headerCss,
        reportHeaderByQuery: rptHeaderbyQuery,
        parameterOptions: parameterOption,

        dashboardIds: selectedIdTabs,
        allSelectedParaList: selectedIdParams,

        printButton: isPrintBtnReq,
        dashboardTheme: dashboardTheme,
        isTopTabBarVisible: isTopBarVisible,
        isFixedLayout: isFixedLayout,
        isSidebarCollapse: isSidebarCollapse,
        isHeaderRequired: isHeaderReq,
        showHeader: showHeader,
        showHeaderGlobalDashboardOnly: showHeaderInGlobalDash,
        isStaticHeaderRequired: rptHeaderTypePdfExl,
        isActive: isActive,

      }
    };

    fetchPostData("/hisutils/dashboardUpdate", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Updated Successfully", "success");
        getAllDashboardData(values?.dashboardFor)
        reset();
        setActionMode('home');
        setConfirmSave(false);
        setLoading(false)
      } else {
        ToastAlert(data?.message, "error");
        setConfirmSave(false);
        setLoading(false)
      }
    });
  };

  const handleDeleteDashboard = () => {
    if (selectedOption?.length > 0) {
      setLoading(true)
      const val = { "id": selectedOption[0]?.id, "dashboardFor": values?.dashboardFor, "masterName": "DashboardGroupingMst" };
      fetchPostData("/hisutils/dashboardDelete", val).then((data) => {
        if (data?.status === 1) {
          ToastAlert('Deleted Successfully!', 'success');
          getAllDashboardData(values?.dashboardFor)
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
    let isValid = true;
    let newErrors = {};
    if (!values?.dashboardFor?.trim()) {
      newErrors.dashboardForErr = "Dashboard for is required";
      isValid = false;
    }
    if (!values?.dashNameDisplay?.trim()) {
      newErrors.dashNameDisplayErr = "Display name is required";
      isValid = false;
    }
    if (!values?.dashNameInternal?.trim()) {
      newErrors.dashNameInternalErr = "Internal name is required";
      isValid = false;
    }
    if (radioValues?.rptHeaderTypePdfExl === '2' && !values?.rptHeaderbyQuery?.trim()) {
      newErrors.rptHeaderbyQueryErr = "query is required";
      isValid = false;
    }
    setErrors(newErrors);

    if (!isValid) {
      if (newErrors.dashboardForErr || newErrors.dashNameDisplayErr || newErrors.dashNameInternalErr) {
        setTabIndex(1);
        setTabName({ value: 1, label: "About Dashboard" });
      } else if (newErrors.rptHeaderbyQueryErr) {
        setTabIndex(3);
        setTabName({ value: 3, label: "Header Details" });
      }
    } else {
      setShowConfirmSave(true);
    }
  }

  useEffect(() => {
    if (confirmSave) {
      if (actionMode === 'edit') {
        updateDashboardData();
      } else {
        saveDashboardData();
      }
    }
  }, [confirmSave])

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
    setShowDashboardTable(true)
  }

  const onTableClose = () => {
    setShowDashboardTable(false);
    setSearchInput('');
    setSelectedOption([]);
  }

  const handleUpdateData = () => {
    if (selectedOption?.length > 0) {
      const selectedRow = dashboardData?.filter(dt => dt?.id === selectedOption[0]?.id)
      setSingleData(selectedRow);
      setActionMode('edit');
      setShowDataTable(false);
      setShowDashboardTable(false);
      setSelectedOption([]);
      setSearchInput('');
      // setIsInputChanged(true)

    } else {
      ToastAlert('Please select a record', 'warning');
    }
  }

  const reset = () => {
    setValues({
      "dashboardFor": dashFor, "dashNameDisplay": "", "dashNameInternal": "", "menuContainerBgColor": "", "dashTitlefontColor": "", "iconColor": "", "menuContainerBgImage": "", "cachingStatus": '', "dataLoad": "ALL",
      //tab
      "tabDisplayStyle": "TOP", "tabIconType": "IMAGE", "timeInterval": "", "changeIntervalTime": "", "textshadowColor": "", "tabFontColor": "", "tabBgColorOnHover": "", "tabFontColorOnHover": '', "tabMenuWidthBigIcon": "3",
      "tabMenuHeightBigIcon": "", "tabShapesBigIcon": "",
      //header
      "headerHtml": "", "headerCss": "", "rptHeaderbyQuery": "",
      //parameter
      "parameterOption": ""
    });

    setRadioValues({
      "isPrintBtnReq": "Yes", "dashboardTheme": "Default",
      //tab
      "isTopBarVisible": "No", "isFixedLayout": "Yes", "isSidebarCollapse": "Yes",
      //header
      "isHeaderReq": "No", "showHeader": "Only in Big Icon Menu", "showHeaderInGlobalDash": "No", "rptHeaderTypePdfExl": "1", "isActive": "Yes",
    });
    setErrors({ dashboardForErr: "", dashNameDisplayErr: "", dashNameInternalErr: "", rptHeaderbyQueryErr: "" });
    setActionMode('home');
    setShowDashboardTable(false);
    setShowDataTable(false);
    setTabIndex(1);
    // setTabName({ value: 1, label: "About Widget" })
    setTabName({ value: 1, label: "About Dashboard" });
    // setIsInputChanged(false)
    localStorage.removeItem('values');
    localStorage.removeItem('radio');
    setLoading(false)
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
      name: dt('Group ID'),
      selector: row => row.id,
      sortable: true,
      width: "10%"
    },
    {
      name: dt('Group Name'),
      selector: row => row?.jsonData?.groupName || "---",
      cell: row => <a
        href={`/HIS_dashboard/dashboard?groupId=${row?.id ? encodeURIComponent(btoa(row?.id)) : "0"}&dashboardFor=${row?.dashboardFor ? encodeURIComponent(btoa(row?.dashboardFor)) : ""}&isPreview=1`}
        target="_blank"
        rel="noopener noreferrer"
        className='text-decoration-none'
      >
        {row?.jsonData?.groupName}
      </a>,
      sortable: true,
    },
    {
      name: dt('URL'),
      selector: row => `/HIS_dashboard/dashboard?groupId=${row.id ? encodeURIComponent(btoa(row?.id)) : "0"}&dashboardFor=${row?.dashboardFor ? encodeURIComponent(btoa(row?.dashboardFor)) : ""}` || "---",
      sortable: true,
      wrap: true
    }
  ]


  return (
    <div>
      <NavbarHeader />
      <div className='main-master-page'>
        {values?.dashboardFor &&
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
              <AboutDashboard handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} setValues={setValues} dashboardForDt={dashboardForDt} errors={errors} dt={dt} />}
            {tabName?.value === 2 &&
              <TabDetails handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} availableOptions={availableOptionsTab} setAvailableOptions={setAvailableOptionsTab} selectedOptions={selectedOptionsTab} setSelectedOptions={setSelectedOptionsTab} dt={dt} />}
            {tabName?.value === 3 &&
              <HeaderDetails handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} setValues={setValues} errors={errors} dt={dt} />}
            {tabName?.value === 4 &&
              <ParamsDetails handleValueChange={handleValueChange} values={values} parameterDrpData={parameterDrpData} availableOptions={availableOptions} setAvailableOptions={setAvailableOptions} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} dt={dt} />}

            <b><h6 className='header-devider mt-4'></h6></b>
            {values?.dashboardFor &&
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
      </div>
      {showDashboardTable &&
        <GlobalDataTable title={dt("Group List")} column={column} data={filterData} onModify={handleUpdateData} onDelete={handleDeleteDashboard} setSearchInput={setSearchInput} onClose={onTableClose} isShowBtn={true} />
      }
    </div>
  )
}

export default DashboardMaster

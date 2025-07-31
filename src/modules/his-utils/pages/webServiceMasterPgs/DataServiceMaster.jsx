import React, { useContext, useEffect, useState } from 'react'
import NavbarHeader from '../../components/headers/NavbarHeader'
import GlobalButtonGroup from '../../components/commons/GlobalButtonGroup'
import InputSelect from '../../components/commons/InputSelect'
import InputField from '../../components/commons/InputField'
import { parameterType, serviceCategories, timeOutOptions } from '../../localData/DropDownData'
import DataServiceTable from '../../components/webServiceMasters/dataService/DataServiceTable'
import { HISContext } from '../../contextApi/HISContext'
import { ToastAlert } from '../../utils/commonFunction'
import GlobalDataTable from '../../components/commons/GlobalDataTable'
import { fetchPostData } from '../../../../utils/HisApiHooks'

const DataServiceMaster = () => {
  const { setShowDataTable, getAllServiceData, dataServiceData, selectedOption, setSelectedOption, setActionMode, actionMode, parameterData, getAllParameterData, setLoading, setShowConfirmSave, confirmSave, setConfirmSave, jndiServerDrpData, getDashConfigData, singleConfigData, dt } = useContext(HISContext);

  const [isCacheData, setIsCacheData] = useState(false);
  const [selectedMode, setSelectedMode] = useState("query");
  const [showWebServiceTable, setShowWebServiceTable] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [singleData, setSingleData] = useState([]);
  const [filterData, setFilterData] = useState(parameterData)
  const [showParamsTable, setShowParamsTable] = useState(false);

  const [values, setValues] = useState({
    "serviceCategory": "", "serviceDisplayName": "", "serviceCallingName": "", "procedureFuncName": "", "fetchQuery": "", "webJsonType": "dataHeadingColumnType", "jndiSavingData": "", "stmtTimeOut": "", "dashboardFor": "", "id": ""
  })

  const [errors, setErrors] = useState({ serviceCategoryErr: "", serviceDisplayNameErr: "", serviceCallingNameErr: "", fetchQueryErr: "", selectedModeErr: "", procedureFuncNameErr: "" });

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    const error = name + 'Err'
    if (name) {
      setValues({ ...values, [name]: value })
    }
    if (error && name) {
      setErrors({ ...errors, [error]: '' })
    }
  }

  useEffect(() => {
    if (dataServiceData?.length === 0) { getAllServiceData(); }
    if (parameterData?.length === 0) { getAllParameterData('CENTRAL DASHBOARD'); }
    if (!singleConfigData) {
      getDashConfigData()
    }
  }, [])

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

  const handleUpdateData = () => {
    if (selectedOption?.length > 0) {
      const selectedRow = dataServiceData?.filter(dt => dt?.id === selectedOption[0]?.id)
      setSingleData(selectedRow);
      setActionMode('edit');
      setShowDataTable(false);
      setShowWebServiceTable(false);
      setSelectedOption([]);
    } else {
      ToastAlert('Please select a record', 'warning');
    }
  }

  useEffect(() => {
    if (singleData?.length > 0) {
      const jsonData = singleData[0]?.jsonData || {};
      setValues({
        ...values,
        id: singleData[0]?.id,
        dashboardFor: singleData[0]?.dashboardFor,
        serviceCategory: jsonData?.serviceCategory,
        serviceDisplayName: jsonData?.serviceName,
        serviceCallingName: jsonData?.serviceInternalName,
        procedureFuncName: jsonData?.mainProcedureName,
        fetchQuery: jsonData?.mainFetchQuery,
        webJsonType: jsonData?.webserviceJsonType,
        jndiSavingData: jsonData?.JNDIid,
        stmtTimeOut: jsonData?.statementTimeOut,

      })
      setSelectedMode(jsonData?.modeOfQuery);
      setIsCacheData(jsonData?.isCacheData);
    }
  }, [singleData])

  const saveDataServiceData = () => {
    setLoading(true)
    const {
      serviceCategory, serviceDisplayName, serviceCallingName, procedureFuncName, fetchQuery, webJsonType,
      jndiSavingData, stmtTimeOut,
    } = values;
    const val = {
      dashboardFor: "GLOBAL",
      masterName: "DataServiceMst",
      entryUserId: 101,
      jndiIdForGettingData: jndiSavingData,
      statementTimeout: stmtTimeOut,
      keyName: serviceCallingName,
      jsonData: {
        serviceCategory: serviceCategory,
        serviceName: serviceDisplayName,
        serviceInternalName: serviceCallingName,
        mainProcedureName: procedureFuncName,
        mainFetchQuery: fetchQuery,
        webserviceJsonType: webJsonType,
        JNDIid: jndiSavingData,
        statementTimeOut: stmtTimeOut,
        modeOfQuery: selectedMode,
        isCacheData: isCacheData
      }
    };

    fetchPostData("/hisutils/DataServicesave", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Saved Successfully", "success");
        getAllServiceData();
        setActionMode('home');
        reset();
        setConfirmSave(false)
        setLoading(false)
      } else {
        ToastAlert(data?.message, "error");
        setConfirmSave(false)
        setLoading(false)
      }
    });
  };

  const updateDataServiceData = () => {
    setLoading(true)
    const {
      serviceCategory, serviceDisplayName, serviceCallingName, procedureFuncName, fetchQuery, webJsonType,
      jndiSavingData, stmtTimeOut, id
    } = values;
    const val = {
      id: id,
      dashboardFor: "GLOBAL",
      masterName: "DataServiceMst",
      entryUserId: 101,
      jndiIdForGettingData: jndiSavingData,
      statementTimeout: stmtTimeOut,
      keyName: serviceCallingName,
      jsonData: {
        serviceCategory: serviceCategory,
        serviceName: serviceDisplayName,
        serviceInternalName: serviceCallingName,
        mainProcedureName: procedureFuncName,
        mainFetchQuery: fetchQuery,
        webserviceJsonType: webJsonType,
        JNDIid: jndiSavingData,
        statementTimeOut: stmtTimeOut,
        modeOfQuery: selectedMode,
        isCacheData: isCacheData
      }
    };

    fetchPostData("/hisutils/DataServiceUpdate", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Updated Successfully", "success");
        getAllServiceData();
        setActionMode('home');
        reset();
        setConfirmSave(false)
        setLoading(false)
      } else {
        ToastAlert(data?.message, "error");
        setConfirmSave(false)
        setLoading(false)
      }
    });
  };

  const handleDeleteDataService = () => {
    if (selectedOption?.length > 0) {
      setLoading(true)
      const val = { "id": selectedOption[0]?.id, "dashboardFor": "GLOBAL", "masterName": "DataServiceMst" };
      fetchPostData("/hisutils/DataServiceDelete", val).then((data) => {
        if (data?.status === 1) {
          ToastAlert('Deleted Successfully!', 'success');
          getAllServiceData();
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
    if (!values?.serviceCategory?.trim()) {
      setErrors(prev => ({ ...prev, 'serviceCategoryErr': "service category is required" }));
      isValid = false;
    }
    if (!values?.serviceDisplayName?.trim()) {
      setErrors(prev => ({ ...prev, 'serviceDisplayNameErr': "display name is required" }));
      isValid = false;
    }
    if (!values?.serviceCallingName?.trim()) {
      setErrors(prev => ({ ...prev, 'serviceCallingNameErr': "calling name is required" }));
      isValid = false;
    }
    if ((selectedMode === "query" || selectedMode === "html") && !values?.fetchQuery?.trim()) {
      setErrors(prev => ({ ...prev, 'fetchQueryErr': "query is required" }));
      setErrors(prev => ({ ...prev, 'procedureFuncNameErr': "" }));
      isValid = false;
    }
    if (selectedMode !== "query" && selectedMode !== "html" && !values?.procedureFuncName?.trim()) {
      setErrors(prev => ({ ...prev, 'procedureFuncNameErr': "procedure is required" }));
      setErrors(prev => ({ ...prev, 'fetchQueryErr': "" }));
      isValid = false;
    }
    if (!selectedMode?.trim()) {
      setErrors(prev => ({ ...prev, 'selectedModeErr': "mode is required" }));
      isValid = false;
    }

    if (isValid) {
      setShowConfirmSave(true);
    }
  }

  useEffect(() => {
    if (confirmSave) {
      if (actionMode === 'edit') {
        updateDataServiceData();
      } else {
        saveDataServiceData();
      }
    }
  }, [confirmSave])

  const reset = () => {
    setValues({ "serviceCategory": "", "serviceDisplayName": "", "serviceCallingName": "", "procedureFuncName": "", "fetchQuery": "", "webJsonType": "dataHeadingColumnType", "jndiSavingData": "", "stmtTimeOut": "", "dashboardFor": "", "id": "" })
    setErrors({ serviceCategoryErr: "", serviceDisplayNameErr: "", serviceCallingNameErr: "", fetchQueryErr: "", selectedModeErr: "", procedureFuncNameErr: "" })
    setActionMode('home');
    setShowWebServiceTable(false);
    setShowDataTable(false);
    setLoading(false)
  }

  const onOpenWebService = () => {
    setShowDataTable(true);
    setShowWebServiceTable(true);
  }

  const onOpenDataParams = () => {
    setShowDataTable(true);
    setShowParamsTable(true);
  }

  const onTableClose = () => {
    setShowWebServiceTable(false);
    setSearchInput('');
    setSelectedOption([]);
    setShowParamsTable(false);
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
      name: dt('ID'),
      selector: row => row.id,
      sortable: true,
      width: "8%"
    },
    {
      name: dt('Parameter Name'),
      selector: row => row?.jsonData?.parameterName || "---",
      sortable: true,
    },
    {
      name: dt('Display Name'),
      selector: row => row?.jsonData?.parameterDisplayName || "---",
      sortable: true,
    },
    {
      name: dt('Type'),
      selector: row => parameterType?.filter(dt => dt?.value === row?.jsonData?.parameterType)[0]?.label || "---",
      sortable: true,
    },
  ]


  return (
    <div>
      <NavbarHeader />
      <div className='main-master-page'>
        <GlobalButtonGroup isSave={true} isOpen={true} isReset={true} isParams={true} isWeb={false} onSave={handleSaveUpdate} onOpen={onOpenWebService} onReset={reset} onParams={onOpenDataParams} onWeb={null} />
        <div className='form-card m-auto p-3'>
          <b><h6 className='header-devider mt-0 mb-1'>{dt('Data Service Master')}</h6></b>

          {/* SECTION DEVIDER service category*/}
          <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
            {/* //left columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Service Category')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="serviceCategory"
                    name="serviceCategory"
                    placeholder="Select value..."
                    options={serviceCategories}
                    className="backcolorinput"
                    value={values?.serviceCategory}
                    onChange={handleValueChange}
                  />
                  {errors?.serviceCategoryErr &&
                    <div className="required-input">
                      {errors?.serviceCategoryErr}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* SECTION DEVIDER for service name*/}
          <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
            {/* //left columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Service Display Name')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name='serviceDisplayName'
                    id="serviceDisplayName"
                    onChange={handleValueChange}
                    value={values?.serviceDisplayName}
                    onBlur={() => { setValues({ ...values, 'serviceCallingName': values?.serviceDisplayName }) }}
                  />
                  {errors?.serviceDisplayNameErr &&
                    <div className="required-input">
                      {errors?.serviceDisplayNameErr}
                    </div>
                  }
                </div>
              </div>
            </div>
            {/* right columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Service Name(For Calling Service)')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name='serviceCallingName'
                    id="serviceCallingName"
                    onChange={handleValueChange}
                    value={values?.serviceCallingName}
                  />
                  {errors?.serviceCallingNameErr &&
                    <div className="required-input">
                      {errors?.serviceCallingNameErr}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* SECTION DEVIDER mode of selection */}
          <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
            {/* //left columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">
                  {dt('Select Mode For Data')} :
                </label>
                {errors?.selectedModeErr &&
                  <div className="required-input">
                    {errors?.selectedModeErr}
                  </div>
                }
                <div className="col-sm-7 ps-0 align-content-center">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="selectedModeQuery"
                      name="selectedMode"
                      value={selectedMode}
                      onChange={(e) => setSelectedMode("query")}
                      checked={selectedMode === "query"}
                    />
                    <label className="form-check-label" htmlFor="dbYes">
                      {dt('By Query')}
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="selectedModeProcedure"
                      name="selectedMode"
                      value={selectedMode}
                      onChange={(e) => setSelectedMode("procedure")}
                      checked={selectedMode === "procedure"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      {dt('By Procedure For Query')}
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="selectedModeFunction"
                      name="selectedMode"
                      value={selectedMode}
                      onChange={(e) => setSelectedMode("function")}
                      checked={selectedMode === "function"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      {dt('By Function For Query')}
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="selectedModeHtml"
                      name="selectedMode"
                      value={selectedMode}
                      onChange={(e) => setSelectedMode("html")}
                      checked={selectedMode === "html"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      {dt('By HTML/Content Text')}
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="selectedModeProcedureDml"
                      name="selectedMode"
                      value={selectedMode}
                      onChange={(e) => setSelectedMode("procedureDml")}
                      checked={selectedMode === "procedureDml"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      {dt('By Procedure For DML')}
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="selectedModeFunctionDml"
                      name="selectedMode"
                      value={selectedMode}
                      onChange={(e) => setSelectedMode("functionDML")}
                      checked={selectedMode === "functionDML"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      {dt('By Function For DML')}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* right columns */}
            <div className='col-sm-6'>
              {(selectedMode !== "procedureDml" && selectedMode !== "functionDml") &&
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    {dt('Is Cache Data')} :
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isCacheData"
                        id="isCacheDataYes"
                        value={isCacheData}
                        onChange={(e) => setIsCacheData(true)}
                        checked={isCacheData}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt('Yes')}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isCacheData"
                        id="isCacheDataNo"
                        value={isCacheData}
                        onChange={(e) => setIsCacheData(false)}
                        checked={!isCacheData}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt('No')}
                      </label>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          {/* SECTION DEVIDER query and json type*/}
          <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
            {/* //left columns */}
            <div className='col-sm-6'>
              {(selectedMode !== "query" && selectedMode !== "html") &&
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Procedure/Function Name')} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputField
                      type="text"
                      className="backcolorinput"
                      placeholder="Enter..."
                      name='procedureFuncName'
                      id='procedureFuncName'
                      value={values?.procedureFuncName}
                      onChange={handleValueChange}
                    />
                    {errors?.procedureFuncNameErr &&
                      <div className="required-input">
                        {errors?.procedureFuncNameErr}
                      </div>
                    }
                  </div>
                </div>
              }
              {(selectedMode === "query" || selectedMode === "html") &&
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt('Fetch Query')} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <textarea
                      className="form-control backcolorinput"
                      placeholder="Enter..."
                      rows="2"
                      name='fetchQuery'
                      id='fetchQuery'
                      value={values?.fetchQuery}
                      onChange={handleValueChange}
                    ></textarea>
                    {errors?.fetchQueryErr &&
                      <div className="required-input">
                        {errors?.fetchQueryErr}
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
            {/* right columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt('Webservice Json Type')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="webJsonType"
                    name="webJsonType"
                    // placeholder="Select value..."
                    options={[{ value: "dataHeadingColumnType", label: "DataHeadingColumn Type" }, { value: "keyValueType", label: "KeyValue Type" }]}
                    className="backcolorinput"
                    value={values?.webJsonType}
                    onChange={handleValueChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION DEVIDER for json preview*/}
          <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
            {/* //left columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt('Webservice Json Preview')} : </label>
                {values?.webJsonType === "dataHeadingColumnType" &&
                  <div className="col-sm-7 ps-0 align-content-center">
                    <b><u>{dt('DATAHEADING-DATAVALUE FORMAT')}:-</u></b><br />
                    <br />
                    {"{"}
                    <br />
                    &nbsp;&nbsp;'dataHeading': ['parent_store', 'store_name'],
                    <br />
                    &nbsp;&nbsp;'dataValue': [
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;['Anuppur-CMHO', 'Anuppur-CMHO'],<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;['Neemuch-CMHO', 'Neemuch-CMHO']
                    <br />
                    &nbsp;&nbsp;]
                    <br />
                    {"}"}
                  </div>
                }
                {values?.webJsonType === "keyValueType" &&
                  <div className="col-sm-7 ps-0 align-content-center">
                    <b><u>{dt('KEY-VALUE FORMAT')}:-</u></b><br />
                    <br />
                    [
                    <br />
                    &nbsp;&nbsp;{`{`}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;'parent_store': 'Anuppur-CMHO',
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;'store_name': 'Anuppur-CMHO'
                    <br />
                    &nbsp;&nbsp;{`},`}
                    <br />
                    &nbsp;&nbsp;{`{`}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;'parent_store': 'Neemuch-CMHO',
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;'store_name': 'Neemuch'
                    <br />
                    &nbsp;&nbsp;{`}`}
                    <br />
                    ]
                  </div>
                }

              </div>
            </div>
          </div>

          {/* MAIN DEVIDER FOR JNDI */}
          <b><h6 className='header-devider m-0'>{dt('JNDI Details')}</h6></b>

          {/* SECTION DEVIDER jndi and time*/}
          <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
            {/* //left columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt('JNDI For Saving Data')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="jndiSavingData"
                    name="jndiSavingData"
                    // placeholder="Select"
                    options={jndiServerDrpData}
                    className="backcolorinput"
                    onChange={handleValueChange}
                    value={values?.jndiSavingData}
                  />
                </div>
              </div>
            </div>
            {/* right columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt('Statement Time Out')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="stmtTimeOut"
                    name="stmtTimeOut"
                    // placeholder="Select "
                    options={timeOutOptions}
                    className="backcolorinput"
                    onChange={handleValueChange}
                    value={values?.stmtTimeOut}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showWebServiceTable &&
        <DataServiceTable data={dataServiceData} onModify={handleUpdateData} onDelete={handleDeleteDataService} onClose={onTableClose} isShowBtn={true} />
      }
      {showParamsTable &&
        <GlobalDataTable title={dt("Parameter List")} column={column} data={filterData} onModify={null} onDelete={null} setSearchInput={setSearchInput} onClose={onTableClose} isShowBtn={false} />
      }
    </div>
  )
}

export default DataServiceMaster

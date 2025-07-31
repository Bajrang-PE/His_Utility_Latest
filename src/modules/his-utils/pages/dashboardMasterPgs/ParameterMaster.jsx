import React, { useContext, useEffect, useState } from 'react'
import NavbarHeader from '../../components/headers/NavbarHeader'
import InputSelect from '../../components/commons/InputSelect'
import InputField from '../../components/commons/InputField'
import Select from 'react-select'
import { faAdd, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GlobalButtonGroup from '../../components/commons/GlobalButtonGroup'
import { datePickFields, parameterAlignment, parameterType, parameterWidth, timeOutOptions, validationType } from '../../localData/DropDownData'
import { HISContext } from '../../contextApi/HISContext'
import GlobalDataTable from '../../components/commons/GlobalDataTable'
import { ToastAlert } from '../../utils/commonFunction'
import DataServiceTable from '../../components/webServiceMasters/dataService/DataServiceTable'
import { fetchPostData } from '../../../../utils/HisApiHooks'

const ParameterMaster = () => {

  const { parameterData, getAllParameterData, selectedOption, setSelectedOption, setShowDataTable, dashboardForDt, getDashboardForDrpData, actionMode, setActionMode, parameterDrpData, getAllServiceData, dataServiceData, setLoading, setShowConfirmSave, confirmSave, setConfirmSave, jndiServerDrpData, getDashConfigData, singleConfigData, dt } = useContext(HISContext);

  const [rows, setRows] = useState([{ optionValue: "", optionText: "" }]);
  const [showAsLabel, setShowAsLabel] = useState(false);
  const [isMultiSelectReq, setIsMultiSelectReq] = useState('No');
  const [singleData, setSingleData] = useState([]);
  const [values, setValues] = useState({
    "parameterFor": "", "parameterType": "1", "parameterInternal": "", "parameterDisplay": "", "placeHolder": "", "parameterWidth": "", "parameterAlignment": "", "paraLabelWidth": "", "paraLabelAlignment": "", "paraControlWidth": "", "paraControlAlignment": "", "mandatory": "", "defaultValueIfLeft": "", "defaultValue": "", "validation": "1", "maxLength": "", "minLength": "", "parentID": [], "modeForQuery": 'query', "query": "", "defaultOptValue": "", "defaultOptText": "", "defOptFilterVal": "", "defOptFilterTxt": "", "jndiSavingData": "1", "stmtTimeOut": "", "id": "", "shouldBeLess": "", "shouldBeGreater": "", "minDaysBefore": "", "maxDaysAfter": "", "parameterQueryForDate": ""
  })

  const [searchInput, setSearchInput] = useState('');
  const [showParamsTable, setShowParamsTable] = useState(false);
  const [showWebServiceTable, setShowWebServiceTable] = useState(false);
  const [filterData, setFilterData] = useState(parameterData)

  const [errors, setErrors] = useState({ parameterForErr: "", parameterTypeErr: "", parameterInternalErr: "", parameterDisplayErr: "", mandatoryErr: "", queryErr: "", parameterQueryForDateErr: "", defaultOptValueErr: "", defaultOptTextErr: "", defOptFilterValErr: "", defOptFilterTxtErr: "", listOptValErr: "", listOptTxtErr: "" });

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

  //to set value of dashboard for auto
  const dashFor = localStorage.getItem('dfor');
  useEffect(() => {
    if (dashFor) {
      setValues({ ...values, "parameterFor": dashFor })
    }
  }, [dashFor])

  useEffect(() => {
    if (values?.parameterFor) { getAllParameterData(values?.parameterFor); }
  }, [values?.parameterFor])

  useEffect(() => {
    if (!singleConfigData) {
      getDashConfigData()
    }
  }, [])

  useEffect(() => {
    if (dashboardForDt?.length === 0) { getDashboardForDrpData(); }
    if (dataServiceData?.length === 0) { getAllServiceData(); }
  }, [])

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

  // Handle input change
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Add a new row
  const handleAddRow = () => {
    if (rows?.length > 0 && !rows[rows?.length - 1]?.optionValue) {
      setErrors(prev => ({ ...prev, 'listOptValErr': "list option value is required" }));
    } else if (rows?.length > 0 && !rows[rows?.length - 1]?.optionText) {
      setErrors(prev => ({ ...prev, 'listOptTxtErr': "list option text is required" }));
    } else {
      setRows([...rows, { optionValue: "", optionText: "" }]);
      setErrors(prev => ({ ...prev, 'listOptValErr': "", 'listOptTxtErr': "" }));
    }
  };

  // Remove a row
  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  useEffect(() => {
    if (searchInput !== '' && searchInput !== null) {

    }
  }, [searchInput])

  const handleUpdateData = () => {
    if (selectedOption?.length > 0) {
      const selectedRow = parameterData?.filter(dt => dt?.id === selectedOption[0]?.id)
      setSingleData(selectedRow);
      setActionMode('edit');
      setShowParamsTable(false);
      setShowDataTable(false);
      setShowWebServiceTable(false);
      setSelectedOption([]);
      onTableClose()
    } else {
      ToastAlert('Please select a record', 'warning');
    }
  }

  const handleDeleteParams = () => {
    if (selectedOption?.length > 0) {
      setLoading(true)
      const val = { "id": selectedOption[0]?.id, "dashboardFor": values?.parameterFor, "masterName": "ParameterMst" };
      fetchPostData("/hisutils/parameterDelete", val).then((data) => {
        if (data?.status === 1) {
          ToastAlert('Deleted Successfully!', 'success');
          getAllParameterData(values?.parameterFor)
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

  const saveParametersData = () => {
    setLoading(true)
    const {
      parameterFor, parameterType, parameterInternal, parameterDisplay, placeHolder, parameterWidth, parameterAlignment, paraLabelWidth, paraLabelAlignment, paraControlWidth, paraControlAlignment, mandatory, defaultValueIfLeft, defaultValue, validation, maxLength, minLength, parentID, modeForQuery, query, defaultOptValue, defaultOptText, defOptFilterVal, defOptFilterTxt, jndiSavingData, stmtTimeOut,
      shouldBeLess, shouldBeGreater, minDaysBefore, maxDaysAfter, parameterQueryForDate
    } = values;

    const val = {
      dashboardFor: parameterFor, masterName: "ParameterMst", entryUserId: 101, keyName: parameterDisplay,
      jndiIdForGettingData: jndiSavingData, statementTimeout: stmtTimeOut,
      jsonData: {
        JNDIid: jndiSavingData, parentId: parentID, isMandatory: mandatory, modeForQuery: modeForQuery,
        defaultOption: {
          optionText: defaultOptText,
          optionValue: defaultOptValue,
        },
        parameterName: parameterInternal, parameterType: parameterType, labelAlignment: paraLabelAlignment, parameterQuery: query, parentAlignment: parameterAlignment, controlAlignment: paraControlAlignment, statementTimeOut: stmtTimeOut, parameterLabelWidth: paraLabelWidth, parameterDisplayName: parameterDisplay, parameterParentWidth: parameterWidth, showAsLableIfOneData: showAsLabel, parameterControlWidth: paraControlWidth,
        defaultOptionForFilter: {
          optionText: defOptFilterTxt,
          optionValue: defOptFilterVal,
        },

        maxDaysAfterCurrentDate: maxDaysAfter, minDaysBeforeCurrentDate: minDaysBefore, shouldBeGreaterThanField: shouldBeGreater, shouldBeLessThanField: shouldBeLess, parameterQueryForDate: parameterQueryForDate,

        placeHolder: placeHolder, defaultValueIfEmpty: defaultValueIfLeft,
        defaultValue: defaultValue, textBoxValidation: validation, textboxMaxlength: maxLength,
        textboxMinlength: minLength, isMultipleSelectionRequired: isMultiSelectReq,

        lstOption: rows
      }
    };

    fetchPostData("/hisutils/parametersave", val).then((data) => {
      if (data?.status == 1) {
        ToastAlert("Data Saved Successfully", "success");
        getAllParameterData(values?.parameterFor)
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

  const updateParametersData = () => {
    setLoading(false)
    const {
      parameterFor, parameterType, parameterInternal, parameterDisplay, placeHolder, parameterWidth, parameterAlignment, paraLabelWidth, paraLabelAlignment, paraControlWidth, paraControlAlignment, mandatory, defaultValueIfLeft, defaultValue, validation, maxLength, minLength, parentID, modeForQuery, query, defaultOptValue, defaultOptText, defOptFilterVal, defOptFilterTxt, jndiSavingData, stmtTimeOut, id, shouldBeLess, shouldBeGreater, minDaysBefore, maxDaysAfter, parameterQueryForDate
    } = values;

    const val = {
      id: id, dashboardFor: parameterFor, masterName: "ParameterMst", entryUserId: 101, keyName: parameterDisplay, jndiIdForGettingData: jndiSavingData, statementTimeout: stmtTimeOut,
      jsonData: {
        JNDIid: jndiSavingData, parentId: parentID, isMandatory: mandatory, modeForQuery: modeForQuery,
        defaultOption: {
          optionText: defaultOptText,
          optionValue: defaultOptValue,
        },
        parameterName: parameterInternal, parameterType: parameterType, labelAlignment: paraLabelAlignment, parameterQuery: query, parentAlignment: parameterAlignment, controlAlignment: paraControlAlignment, statementTimeOut: stmtTimeOut, parameterLabelWidth: paraLabelWidth, parameterDisplayName: parameterDisplay, parameterParentWidth: parameterWidth, showAsLableIfOneData: showAsLabel, parameterControlWidth: paraControlWidth,
        defaultOptionForFilter: {
          optionText: defOptFilterTxt,
          optionValue: defOptFilterVal,
        },
        maxDaysAfterCurrentDate: maxDaysAfter, minDaysBeforeCurrentDate: minDaysBefore, shouldBeGreaterThanField: shouldBeGreater, shouldBeLessThanField: shouldBeLess, parameterQueryForDate: parameterQueryForDate,

        placeHolder: placeHolder, defaultValueIfEmpty: defaultValueIfLeft,
        defaultValue: defaultValue, textBoxValidation: validation, textboxMaxlength: maxLength,
        textboxMinlength: minLength, isMultipleSelectionRequired: isMultiSelectReq,

        lstOption: rows
      }
    };

    fetchPostData("/hisutils/parameterUpdate", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Updated Successfully", "success");
        getAllParameterData(values?.parameterFor)
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

  const handleSaveUpdate = () => {
    let isValid = true;
    if (!values?.parameterFor?.trim()) {
      setErrors(prev => ({ ...prev, 'parameterForErr': "parameter for is required" }));
      isValid = false;
    }
    if (!values?.parameterType?.trim()) {
      setErrors(prev => ({ ...prev, 'parameterTypeErr': "parameter typr is required" }));
      isValid = false;
    }
    if (!values?.parameterInternal?.trim()) {
      setErrors(prev => ({ ...prev, 'parameterInternalErr': "internal name is required" }));
      isValid = false;
    }
    if (!values?.parameterDisplay?.trim()) {
      setErrors(prev => ({ ...prev, 'parameterDisplayErr': "display name is required" }));
      isValid = false;
    }
    if (!values?.mandatory?.trim()) {
      setErrors(prev => ({ ...prev, 'mandatoryErr': "mandatory is required" }));
      isValid = false;
    }
    if (values?.modeForQuery === "query" && values?.parameterType !== '2' && values?.parameterType !== '4' && !values?.query?.trim()) {
      setErrors(prev => ({ ...prev, 'queryErr': "query is required" }));
      isValid = false;
    }
    if (values?.parameterType === '4' && !values?.parameterQueryForDate?.trim()) {
      setErrors(prev => ({ ...prev, 'parameterQueryForDateErr': "query is required" }));
      isValid = false;
    }
    if (values?.parameterType !== '2' && values?.parameterType !== '4' && !values?.defaultOptValue?.trim()) {
      setErrors(prev => ({ ...prev, 'defaultOptValueErr': "default Value is required" }));
      isValid = false;
    }
    if (values?.parameterType !== '2' && values?.parameterType !== '4' && !values?.defaultOptText?.trim()) {
      setErrors(prev => ({ ...prev, 'defaultOptTextErr': "default text is required" }));
      isValid = false;
    }
    if (values?.parameterType !== '2' && values?.parameterType !== '4' && !values?.defOptFilterVal?.trim()) {
      setErrors(prev => ({ ...prev, 'defOptFilterValErr': "filter value is required" }));
      isValid = false;
    }
    if (values?.parameterType !== '2' && values?.parameterType !== '4' && !values?.defOptFilterTxt?.trim()) {
      setErrors(prev => ({ ...prev, 'defOptFilterTxtErr': "filter text is required" }));
      isValid = false;
    }
    if (values?.parameterType !== '2' && values?.parameterType !== '4' && values?.modeForQuery === "multiRowOption" && rows?.length > 0 && !rows[rows?.length - 1]?.optionValue) {
      setErrors(prev => ({ ...prev, 'listOptValErr': "list option value is required" }));
      isValid = false;
    }
    if (values?.parameterType !== '2' && values?.parameterType !== '4' && values?.modeForQuery === "multiRowOption" && rows?.length > 0 && !rows[rows?.length - 1]?.optionText) {
      setErrors(prev => ({ ...prev, 'listOptTxtErr': "list option text is required" }));
      isValid = false;
    }

    if (isValid) {
      setShowConfirmSave(true);
    }
  }

  useEffect(() => {
    if (confirmSave) {
      if (actionMode === 'edit') {
        updateParametersData();
      } else {
        saveParametersData();
      }
    }
  }, [confirmSave])


  const returnAlignment = (val) => {
    if (val === "left" || val === "Left") {
      return "left";
    } else if (val === 'right' || val === "Right") {
      return 'right';
    } else if (val === 'center' || val === "Center") {
      return 'center';
    }
  }

  useEffect(() => {
    if (singleData?.length > 0) {
      const jsonData = singleData[0]?.jsonData || {};
      setIsMultiSelectReq(jsonData?.isMultipleSelectionRequired || "No")
      setValues({
        ...values,
        id: singleData[0]?.id,
        parameterFor: singleData[0]?.dashboardFor || "",
        parameterType: jsonData.parameterType || "",
        parameterInternal: jsonData.parameterName || "",
        parameterDisplay: jsonData.parameterDisplayName || "",
        placeHolder: jsonData.placeHolder || "",

        parameterWidth: jsonData.parameterParentWidth || "",
        parameterAlignment: returnAlignment(jsonData.parentAlignment) || "",
        paraLabelWidth: jsonData.parameterLabelWidth || "",
        paraLabelAlignment: returnAlignment(jsonData.labelAlignment) || "",
        paraControlWidth: jsonData.parameterControlWidth || "",
        paraControlAlignment: returnAlignment(jsonData.controlAlignment) || "",

        mandatory: jsonData.isMandatory || "",
        defaultValueIfLeft: jsonData.defaultValueIfEmpty || "",
        defaultValue: jsonData.defaultValue || "",
        validation: jsonData.textBoxValidation || "",
        maxLength: jsonData.textboxMaxlength || "",
        minLength: jsonData.textboxMinlength || "",

        parentID: jsonData.parentId || [],
        modeForQuery: jsonData.modeForQuery || "",
        query: jsonData.parameterQuery || "",
        defaultOptValue: jsonData.defaultOption?.optionText || "",
        defaultOptText: jsonData.defaultOption?.optionValue || "",
        defOptFilterVal: jsonData.defaultOptionForFilter?.optionValue || "",
        defOptFilterTxt: jsonData.defaultOptionForFilter?.optionText || "",
        jndiSavingData: singleData[0]?.jndiIdForGettingData || "",
        stmtTimeOut: singleData[0]?.statementTimeout || "",

        maxDaysAfter: jsonData?.maxDaysAfterCurrentDate || "",
        minDaysBefore: jsonData?.minDaysBeforeCurrentDate || "",
        shouldBeGreater: jsonData?.shouldBeGreaterThanField || "",
        shouldBeLess: jsonData?.shouldBeLessThanField || "",
        parameterQueryForDate: jsonData?.parameterQueryForDate || "",
      });
      setRows(jsonData?.lstOption?.length > 0 ? jsonData?.lstOption : [])
    }
  }, [singleData]);


  const onOpenDataTable = () => {
    setShowDataTable(true);
    setShowParamsTable(true);
  }

  const onOpenWebService = () => {
    setShowDataTable(true);
    setShowWebServiceTable(true);
  }

  const onTableClose = () => {
    setShowParamsTable(false);
    setShowWebServiceTable(false);
    setSearchInput('');
    setSelectedOption([]);
  }

  const reset = () => {
    setValues({ "parameterFor": "", "parameterType": "combo", "parameterInternal": "", "parameterDisplay": "", "placeHolder": "", "parameterWidth": "", "parameterAlignment": "", "paraLabelWidth": "", "paraLabelAlignment": "", "paraControlWidth": "", "paraControlAlignment": "", "mandatory": "", "defaultValueIfLeft": "", "defaultValue": "", "validation": "", "maxLength": "", "minLength": "", "parentID": [], "modeForQuery": 'query', "query": "", "defaultOptValue": "", "defaultOptText": "", "defOptFilterVal": "", "defOptFilterTxt": "", "jndiSavingData": "", "stmtTimeOut": "", "id": "", "shouldBeLess": "", "shouldBeGreater": "", "minDaysBefore": "", "maxDaysAfter": "" })
    setActionMode('home');
    setShowParamsTable(false);
    setShowDataTable(false);
    setShowWebServiceTable(false);
    setRows([{ optionValue: "", optionText: "" }]);
    setErrors({ parameterForErr: "", parameterTypeErr: "", parameterInternalErr: "", parameterDisplayErr: "", mandatoryErr: "", queryErr: "", parameterQueryForDateErr: "", defaultOptValueErr: "", defaultOptTextErr: "", defOptFilterValErr: "", defOptFilterTxtErr: "", listOptValErr: "", listOptTxtErr: "" });
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
    <>
      <NavbarHeader />
      <div className='main-master-page'>
        {values?.parameterFor &&
          <GlobalButtonGroup isSave={true} isOpen={true} isReset={true} isParams={false} isWeb={true} onSave={handleSaveUpdate} onOpen={onOpenDataTable} onReset={reset} onParams={null} onWeb={onOpenWebService} />
        }
        <div className='form-card m-auto p-2'>
          <div className='p-1'>
            <b><h6 className='header-devider m-0'>{dt("Parameter Master")}</h6></b>
            {/* <div > */}
            {/* SECTION DEVIDER para type and for*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Parameter For")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputSelect
                      id="parameterFor"
                      name="parameterFor"
                      placeholder={dt("Select value...")}
                      options={dashboardForDt}
                      className="backcolorinput"
                      value={values?.parameterFor}
                      onChange={(e) => { handleValueChange(e); localStorage?.setItem("dfor", e.target.value) }}
                      disabled={actionMode === 'edit' ? true : false}
                    />
                    {errors?.parameterForErr &&
                      <div className="required-input">
                        {errors?.parameterForErr}
                      </div>
                    }
                  </div>
                </div>
              </div>
              {/* right columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Parameter Type")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputSelect
                      className="backcolorinput"
                      id="parameterType"
                      name="parameterType"
                      // placeholder={dt("Select value...")}
                      options={parameterType}
                      value={values?.parameterType}
                      onChange={(e) => { handleValueChange(e); }}
                      disabled={actionMode === 'edit' ? true : false}
                    />
                    {errors?.parameterTypeErr &&
                      <div className="required-input">
                        {errors?.parameterTypeErr}
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION DEVIDER para name and place holder */}
            <div iv className='role-theme user-form db-connection-grid' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              {/* <div className='col-sm-6'> */}
              <div className="form-group row" style={{ paddingBottom: "1px" }}>
                <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Parameter (For Internal Use)")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder={dt("Enter value...")}
                    name='parameterInternal'
                    id="parameterInternal"
                    onChange={handleValueChange}
                    value={values?.parameterInternal}
                    onBlur={() => { setValues({ ...values, 'parameterDisplay': values?.parameterInternal }) }}
                  />
                  {errors?.parameterInternalErr &&
                    <div className="required-input">
                      {errors?.parameterInternalErr}
                    </div>
                  }
                </div>
              </div>
              <div className="form-group row" style={{ paddingBottom: "1px" }}>
                <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("Parameter Name (For Display)")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder={dt("Enter value...")}
                    name='parameterDisplay'
                    id="parameterDisplay"
                    onChange={handleValueChange}
                    value={values?.parameterDisplay}
                  />
                  {errors?.parameterDisplayErr &&
                    <div className="required-input">
                      {errors?.parameterDisplayErr}
                    </div>
                  }
                </div>
              </div>
              {/* </div> */}
              {/* right columns */}
              {/* <div className='col-sm-6'> */}

              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt("Place Holder")}  : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder={dt("Enter value...")}
                    name='placeHolder'
                    id="placeHolder"
                    onChange={handleValueChange}
                    value={values?.placeHolder}
                  />
                </div>
              </div>
              {values?.parameterType === '1' &&
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    {dt("Show As Label If One Data Available")} :
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="showAsLabel"
                        id="showAsLabelYes"
                        value={showAsLabel}
                        onChange={(e) => setShowAsLabel(true)}
                        checked={showAsLabel}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt("Yes")}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="showAsLabel"
                        id="showAsLabelNo"
                        value={showAsLabel}
                        onChange={(e) => setShowAsLabel(false)}
                        checked={!showAsLabel}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt("No")}
                      </label>
                    </div>
                  </div>
                </div>
              }
            </div>
            {/* </div> */}

            <b><h6 className='header-devider my-1'>{dt("Parameter Layout")}</h6></b>
            {/* SECTION DEVIDER para width to control alignment*/}
            <div iv className='role-theme user-form db-connection-grid' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              {/* <div className='col-sm-6'> */}
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt("Parameter Width")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="parameterWidth"
                    name="parameterWidth"
                    options={parameterWidth}
                    placeholder={dt("Select value...")}
                    className="backcolorinput"
                    onChange={handleValueChange}
                    value={values?.parameterWidth}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt("Parameter Alignment")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="parameterAlignment"
                    name="parameterAlignment"
                    placeholder={dt("Select value...")}
                    options={parameterAlignment}
                    className="backcolorinput"
                    onChange={handleValueChange}
                    value={values?.parameterAlignment}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt("Parameter Label Width")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="paraLabelWidth"
                    name="paraLabelWidth"
                    placeholder={dt("Select value...")}
                    options={parameterWidth}
                    className="backcolorinput"
                    onChange={handleValueChange}
                    value={values?.paraLabelWidth}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt("Parameter Label Alignment")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="paraLabelAlignment"
                    name="paraLabelAlignment"
                    placeholder={dt("Select value...")}
                    options={parameterAlignment}
                    className="backcolorinput"
                    onChange={handleValueChange}
                    value={values?.paraLabelAlignment}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt("Parameter Control Width")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="paraControlWidth"
                    name="paraControlWidth"
                    placeholder={dt("Select value...")}
                    options={parameterWidth}
                    className="backcolorinput"
                    onChange={handleValueChange}
                    value={values?.paraControlWidth}
                  />
                </div>
              </div>
              {/* </div> */}
              {/* right columns */}
              {/* <div className='col-sm-6'> */}


              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt("Parameter Control Alignment")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputSelect
                    id="paraControlAlignment"
                    name="paraControlAlignment"
                    placeholder={dt("Select value...")}
                    options={parameterAlignment}
                    className="backcolorinput"
                    onChange={handleValueChange}
                    value={values?.paraControlAlignment}
                  />
                </div>
              </div>
            </div>
            {/* </div> */}

            {/* SECTION DEVIDER mandatory and default*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Mandatory")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputSelect
                      id="mandatory"
                      name="mandatory"
                      placeholder={dt("Select")}
                      options={[{ value: "Yes", label: dt("Yes") }, { value: "No", label: dt("No") }]}
                      className="backcolorinput"
                      onChange={handleValueChange}
                      value={values?.mandatory}
                    />
                    {errors?.mandatoryErr &&
                      <div className="required-input">
                        {errors?.mandatoryErr}
                      </div>
                    }
                  </div>
                </div>
              </div>
              {/* right columns */}
              {(values?.parameterType === '2' || values?.parameterType === '4') &&
                <div className='col-sm-6'>
                  <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label fix-label pe-0">{dt("Default Value (If Left Empty)")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter...")}
                        name='defaultValueIfLeft'
                        id='defaultValueIfLeft'
                        onChange={handleValueChange}
                        value={values?.defaultValueIfLeft}
                      />
                    </div>
                  </div>
                </div>
              }
            </div>

            {/* SECTION DEVIDER default value to min length - text*/}
            {values?.parameterType === '2' &&
              <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                  <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label pe-0">{dt("Default Value")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter value...")}
                        name='defaultValue'
                        id='defaultValue'
                        onChange={handleValueChange}
                        value={values?.defaultValue}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">{dt("Max Length")}  : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter value...")}
                        name='maxLength'
                        id='maxLength'
                        onChange={handleValueChange}
                        value={values?.maxLength}
                      />
                    </div>
                  </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">{dt("Validation")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputSelect
                        id="validation"
                        name="validation"
                        // placeholder={dt("Select value...")}
                        options={validationType}
                        className="backcolorinput"
                        onChange={handleValueChange}
                        value={values?.validation}
                      />
                    </div>
                  </div>
                  <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label fix-label pe-0">{dt("Min Length")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter value...")}
                        name='minLength'
                        id='minLength'
                        onChange={handleValueChange}
                        value={values?.minLength}
                      />
                    </div>
                  </div>

                </div>
              </div>
            }

            {/* SECTION DEVIDER parent and mode query*/}
            {(values?.parameterType !== '2' && values?.parameterType !== '4') &&
              <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">{dt("Parent ID")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <Select
                        id='parentID'
                        name='parentID'
                        options={parameterDrpData}
                        isMulti
                        placeholder={dt("Select value...")}
                        className="backcolorinput react-select-multi"
                        value={values?.parentID}
                        onChange={(e) => setValues({ ...values, ['parentID']: e })}
                      // isSearchable={true}
                      />
                    </div>
                  </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">{dt("Mode For Query")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputSelect
                        id="modeForQuery"
                        name="modeForQuery"
                        // placeholder={dt("Select")}
                        options={[{ value: 'query', label: dt("By Query") }, { value: 'multiRowOption', label: dt("By Multi Row Option") }]}
                        required
                        className="backcolorinput"
                        value={values?.modeForQuery}
                        onChange={handleValueChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* SECTION DEVIDER query */}
            {(values?.parameterType !== '2') &&
              <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                  {values?.parameterType === "4" &&
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("Query For Default Date")} : </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <textarea
                          className="form-control backcolorinput"
                          placeholder={dt("Enter value...")}
                          name="parameterQueryForDate"
                          id="parameterQueryForDate"
                          rows="1"
                          onChange={handleValueChange}
                          value={values?.parameterQueryForDate}
                        ></textarea>
                        {errors?.parameterQueryForDateErr &&
                          <div className="required-input">
                            {errors?.parameterQueryForDateErr}
                          </div>
                        }
                      </div>
                    </div>
                  }
                  {(values?.modeForQuery === "query" && values?.parameterType !== "4") &&
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("Query")} : </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <textarea
                          className="form-control backcolorinput"
                          placeholder={dt("Enter value...")}
                          name="query"
                          id="query"
                          rows="1"
                          onChange={handleValueChange}
                          value={values?.query}
                        ></textarea>
                        {errors?.queryErr &&
                          <div className="required-input">
                            {errors?.queryErr}
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
                {/* right columns */}
                {/* <div className='col-sm-6'>
                </div> */}
              </div>
            }

            {/* SECTION DEVIDER for date limits*/}
            {values?.parameterType === '4' &&
              <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">{dt("Should Be Less Than Field")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputSelect
                        id="shouldBeLess"
                        name="shouldBeLess"
                        placeholder={dt("Not Required")}
                        options={datePickFields}
                        className="backcolorinput"
                        onChange={handleValueChange}
                        value={values?.shouldBeLess}
                      />
                    </div>
                  </div>
                  <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label fix-label pe-0">{dt("Min Days Selection Before Current Date")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter...")}
                        name='minDaysBefore'
                        id='minDaysBefore'
                        onChange={handleValueChange}
                        value={values?.minDaysBefore}
                      />
                    </div>
                  </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">{dt("Should Be Greater Than Field")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputSelect
                        id="shouldBeGreater"
                        name="shouldBeGreater"
                        placeholder={dt("Not Required")}
                        options={datePickFields}
                        className="backcolorinput"
                        onChange={handleValueChange}
                        value={values?.shouldBeGreater}
                      />
                    </div>
                  </div>
                  <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label fix-label pe-0">{dt("Max Days Selection After Current Date")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter...")}
                        name='maxDaysAfter'
                        id='maxDaysAfter'
                        onChange={handleValueChange}
                        value={values?.maxDaysAfter}
                      />
                    </div>
                  </div>
                </div>

              </div>
            }

            {/* MAIN DEVIDER for list options */}
            {(values?.modeForQuery === "multiRowOption" && values?.parameterType !== '4' && values?.parameterType !== '2') &&
              <>
                <b><h6 className='header-devider mt-2'>{dt("List Options")}</h6></b>
                <div className="mx-4">
                  <div className="row mb-1">
                    <div className="col-4 text-center">
                      <label className="form-label req">{dt("Option Value")}</label>
                    </div>
                    <div className="col-4 text-center">
                      <label className="form-label">{dt("Option Text")}</label>
                    </div>
                    <div className='col-2'>
                      <button
                        className="btn btn-outline-secondary btn-sm me-1 p-1"
                        onClick={() => handleAddRow()}
                      >
                        <FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size='sm' />
                      </button>
                    </div>
                  </div>
                  {rows.map((row, index) => (
                    <div className="row mb-1" key={index}>
                      <div className="col-4">
                        <InputField
                          type="text"
                          className="backcolorinput"
                          placeholder={dt("Option Value")}
                          value={row.optionValue}
                          onChange={(e) => handleInputChange(index, "optionValue", e.target.value)}
                        />
                        {(errors?.listOptValErr && !row?.optionValue) &&
                          <div className="required-input">
                            {errors?.listOptValErr}
                          </div>
                        }
                      </div>
                      <div className="col-4">
                        <InputField
                          type="text"
                          className="backcolorinput"
                          placeholder={dt("Option Text")}
                          value={row.optionText}
                          onChange={(e) => handleInputChange(index, "optionText", e.target.value)}
                        />
                        {(errors?.listOptTxtErr && !row?.optionText) &&
                          <div className="required-input">
                            {errors?.listOptTxtErr}
                          </div>
                        }
                      </div>
                      <div className="col-2 d-flex">

                        {rows.length > 0 && (
                          <button
                            className="btn btn-outline-secondary btn-sm me-1 p-1"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <FontAwesomeIcon icon={faMinus} className="dropdown-gear-icon" size='sm' />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <b><h6 className='header-devider m-0' style={{ padding: "10px" }}></h6></b>
              </>
            }
            {/* SECTION DEVIDER for default values */}
            {(values?.parameterType !== '2' && values?.parameterType !== '4') &&
              <div className="">
                {/* HEADING TEXT */}
                <div className="row">
                  <div className='' style={{ width: "20%" }}>
                  </div>
                  <div className="col-4">
                    <label className="form-label">{dt("Option Value")}</label>
                  </div>
                  <div className="col-4">
                    <label className="form-label">{dt("Option Text")}</label>
                  </div>
                </div>
                {/* DEFAULT OPTION 1 */}
                <div className="row mb-1">
                  <label className="col-form-label fix-label pe-0 required-label" style={{ width: "20%" }}>{dt("Default Option")} : </label>
                  <div className="col-4">
                    <InputField
                      type="text"
                      name='defaultOptValue'
                      id='defaultOptValue'
                      className="backcolorinput"
                      placeholder={dt("Enter value...")}
                      value={values?.defaultOptValue}
                      onChange={handleValueChange}
                    />
                    {errors?.defaultOptValueErr &&
                      <div className="required-input">
                        {errors?.defaultOptValueErr}
                      </div>
                    }
                  </div>
                  <div className="col-4">
                    <InputField
                      type="text"
                      name="defaultOptText"
                      id='defaultOptText'
                      className="backcolorinput"
                      placeholder={dt("Enter text...")}
                      value={values?.defaultOptText}
                      onChange={handleValueChange}
                    />
                    {errors?.defaultOptTextErr &&
                      <div className="required-input">
                        {errors?.defaultOptTextErr}
                      </div>
                    }
                  </div>
                </div>
                {/* DEFAULT OPTION FOR FILTER */}
                <div className="row mb-1" >
                  <label className="col-form-label fix-label pe-0 required-label" style={{ width: "20%" }}>{dt("Default Option For Filter")} : </label>
                  <div className="col-4">
                    <InputField
                      type="text"
                      name='defOptFilterVal'
                      id='defOptFilterVal'
                      className="backcolorinput"
                      placeholder={dt("Enter value...")}
                      value={values?.defOptFilterVal}
                      onChange={handleValueChange}
                    />
                    {errors?.defOptFilterValErr &&
                      <div className="required-input">
                        {errors?.defOptFilterValErr}
                      </div>
                    }
                  </div>
                  <div className="col-4">
                    <InputField
                      type="text"
                      name='defOptFilterTxt'
                      id='defOptFilterTxt'
                      className="backcolorinput"
                      placeholder={dt("Option Text")}
                      value={values?.defOptFilterTxt}
                      onChange={handleValueChange}
                    />
                    {errors?.defOptFilterTxtErr &&
                      <div className="required-input">
                        {errors?.defOptFilterTxtErr}
                      </div>
                    }
                  </div>
                </div>
              </div>
            }

            {/* SECTION DEVIDER is multiple req*/}
            {(values?.parameterType !== '2' && values?.parameterType !== '4') &&
              <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">
                      {dt("Is Multiple Selection Required")} :
                    </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isMultiSelectReq"
                          id="isMultiSelectReqYes"
                          value={'Yes'}
                          onChange={(e) => setIsMultiSelectReq('Yes')}
                          checked={isMultiSelectReq === 'Yes'}
                        />
                        <label className="form-check-label" htmlFor="dbYes">
                          {dt("Yes")}
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="isMultiSelectReq"
                          id="isMultiSelectReqNo"
                          value={'No'}
                          onChange={(e) => setIsMultiSelectReq("No")}
                          checked={isMultiSelectReq === 'No'}
                        />
                        <label className="form-check-label" htmlFor="dbNo">
                          {dt("No")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* right columns */}
              </div>
            }

            {/* MAIN DEVIDER FOR JNDI */}
            <b><h6 className='header-devider m-0'>{dt("JNDI Details")}</h6></b>

            {/* SECTION DEVIDER jndi and time*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">{dt("JNDI For Saving Data")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputSelect
                      id="jndiSavingData"
                      name="jndiSavingData"
                      // placeholder={dt("Select")}
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
                  <label className="col-sm-5 col-form-label pe-0">{dt("Statement Time Out")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputSelect
                      id="stmtTimeOut"
                      name="stmtTimeOut"
                      // placeholder={dt("Select")}
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
          <b><h6 className='header-devider m-0' style={{ padding: "10px" }}></h6></b>
          {/* </div> */}
        </div>

        {showParamsTable &&
          <GlobalDataTable title={dt("Parameter List")} column={column} data={filterData} onModify={handleUpdateData} onDelete={handleDeleteParams} setSearchInput={setSearchInput} onClose={onTableClose} isShowBtn={true} />
        }
        {showWebServiceTable &&
          <DataServiceTable data={dataServiceData} onModify={null} onDelete={null} setSearchInput={setSearchInput} onClose={onTableClose} isShowBtn={false} />
        }

      </div >
    </>
  )
}

export default ParameterMaster

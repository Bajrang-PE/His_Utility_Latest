import React, { useContext, useEffect, useRef, useState } from 'react'
import NavbarHeader from '../../components/headers/NavbarHeader'
import InputField from '../../components/commons/InputField'
import InputSelect from '../../components/commons/InputSelect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faDatabase, faEdit, faFile, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons'
import { serverName } from '../../localData/DropDownData'
import { ToastAlert } from '../../utils/commonFunction'
import { HISContext } from '../../contextApi/HISContext'
import { fetchData, fetchPostData } from '../../../../utils/HisApiHooks'
import LogoUploader from '../../components/commons/LogoUploader'
import { decryptAesOrRsa } from '../../../../utils/SecurityConfig'
import { jwtDecode } from "jwt-decode";
import SessionClock from '../../components/commons/SessionClock'

const DbConfigMaster = () => {
  const { dashboardForDt, getDashboardForDrpData, setSelectedOption, setLoading, setShowConfirmSave, confirmSave, setConfirmSave, singleConfigData, getDashConfigData, clearAllCache, dt } = useContext(HISContext);

  const [values, setValues] = useState({
    "configurationFor": '', "serverName": "WEBSPHERE", "jndiServer": '', "jndiServer1": '', "jndiServer2": '', "jndiServer3": '', "driverClass": "", "userName": "", "connectionURL": "", "password": "", "staticReportHead1": "", "staticReportHead2": "", "staticReportHead3": "", "reportHeaderByQuery": "", "logoImageUrl": "", "staticDefaultLimit": "", "logoImageUrl1": "", "logoImageUrl2": "", "logoImageUrl3": ""
  })

  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({
    "serviceReferenceNo": '',
    "serviceReferenceName": "",
    "serviceInitialServerURL": "",
    "serviceUserName": "",
    "servicePassword": "",
    "defaultMethod": "1"
  });
  // FOR RADIO BUTTONS
  const [isDbConnReq, setIsDbConnReq] = useState('1');
  const [isDashboardCached, setIsDashboardCached] = useState('Yes');
  const [isConsoleReq, setIsConsoleReq] = useState('Yes');
  const [isAccessReq, setIsAccessReq] = useState('No');
  const [isErrorReq, setIsErrorReq] = useState('Yes');
  const [isLogoReq, setIsLogoReq] = useState('Yes');
  const [logoPosition, setLogoPosition] = useState({
    "logo1Position": "left", "logo2Position": "right", "logo3Position": "top"
  });
  const [headingAlignment, setHeadingAlignment] = useState("Left");
  const [isLimitRecReq, setIsLimitRecReq] = useState('No');
  const [isHeadByQueryReq, setIsHeadByQueryReq] = useState('No');
  const [logoCounts, setLogoCounts] = useState('1');
  const [isEditing, setIsEditing] = useState(null);

  const [errors, setErrors] = useState({
    "configurationForErr": '', "serverNameErr": '', "driverClassErr": '', "connectionURLErr": '', "userNameErr": '', "passwordErr": '', "staticReportHead1Err": '', "reportHeaderByQueryErr": '', "jndiServerErr": '', "jndiServer1Err": '', "isDashboardCachedErr": '',
  })

  //to set value of dashboard for auto
  const dashFor = localStorage.getItem('dfor');
  useEffect(() => {
    if (dashFor) {
      setValues({ ...values, "configurationFor": dashFor })
    }
  }, [dashFor])

  useEffect(() => {
    const init = async () => {
      await getDashConfigData();
      if (dashboardForDt?.length === 0) { getDashboardForDrpData(); }
    };

    init();
  }, [])

  useEffect(() => {
    if (singleConfigData) {
      const dtd = singleConfigData?.databaseConfigVO;
      setValues({
        ...values,
        configurationFor: dtd?.dashboardFor,
        serverName: dtd?.serverName || "WEBSPHERE",
        jndiServer: dtd?.jndiForPrimaryServer,
        jndiServer1: dtd?.jndiForSecondaryServer1,
        jndiServer2: dtd?.jndiForSecondaryServer2,
        jndiServer3: dtd?.jndiForSecondaryServer3,
        driverClass: dtd?.driverClassName,
        userName: dtd?.userName,
        connectionURL: dtd?.url,
        password: dtd?.password,
        staticReportHead1: dtd?.reportHeader1,
        staticReportHead2: dtd?.reportHeader2,
        staticReportHead3: dtd?.reportHeader3,
        reportHeaderByQuery: dtd?.reportHeaderByQuery,
        logoImageUrl: dtd?.logoImage,
        logoImageUrl1: dtd?.logos[0]?.image,
        logoImageUrl2: dtd?.logos[1]?.image,
        logoImageUrl3: dtd?.logos[2]?.image,
        staticDefaultLimit: dtd?.setDefaultLimit,
      })
      setIsDbConnReq(dtd?.isDbConnectionReq || "1");
      setIsDashboardCached(dtd?.isDashboardConfigurationCached || "Yes");
      setIsConsoleReq(dtd?.isLogAllMsgs || "Yes");
      setIsAccessReq(dtd?.isLogAllAccess || "No");
      setIsErrorReq(dtd?.isLogAllError || "Yes");
      setIsLogoReq(dtd?.isLogoRequired || "Yes");
      setLogoPosition({
        "logo1Position": dtd?.logos[0]?.position || 'left',
        "logo2Position": dtd?.logos[1]?.position || "right",
        "logo3Position": dtd?.logos[2]?.position || "top"
      });
      setHeadingAlignment(dtd?.headingAlignment || "Left");
      setIsLimitRecReq(dtd?.isLimitRequired || "No");
      setRows(dtd?.lstWebServiceClientConfigVO || [])
      setLogoCounts(dtd?.logoCounts || '1')
      setIsHeadByQueryReq(dtd?.isHeadByQueryReq || "No")
      localStorage?.setItem("dfor", dtd?.dashboardFor);
    }
  }, [singleConfigData])

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

  const handleLogoChange = (name, base64String) => {
    setValues((prev) => ({ ...prev, [name]: base64String }));
  };


  const handleEditRow = (index) => {
    setIsEditing(index);
    setNewRow(rows[index]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (field, value) => {
    const err = field + 'Err'
    setNewRow({ ...newRow, [field]: value });
    // setErrors(prev => ({ ...prev, [err]: "" }));
  };

  const clearRow = () => {
    setNewRow({ "serviceReferenceNo": '', "serviceReferenceName": "", "serviceInitialServerURL": "", "serviceUserName": "", "servicePassword": "", "defaultMethod": "1" });
    setIsEditing(null);
  }

  const handleAddRow = () => {
    if (isEditing !== null) {
      const updatedRows = [...rows];
      updatedRows[isEditing] = newRow;
      setRows(updatedRows);
      // setValues({ ...values, ['helpDocs']: updatedRows })
      setIsEditing(null);
    } else {
      // let oldDt = values?.helpDocs?.length > 0 ? values?.helpDocs : [];
      if (rows?.length > 0) {
        setRows([...rows, newRow]);
      } else {
        setRows([newRow]);
      }
      // oldDt?.push(newRow)
      // setValues({ ...values, ['helpDocs']: oldDt })
    }
    setNewRow({ "serviceReferenceNo": '', "serviceReferenceName": "", "serviceInitialServerURL": "", "serviceUserName": "", "servicePassword": "", "defaultMethod": "1" });
  };


  const checkDatabaseConnection = () => {
    fetchData("/hisutils/check-db-connection").then((data) => {
      if (data?.status === 1) {
        ToastAlert(data?.message)
      } else {
        ToastAlert(data?.message, 'error')
      }
    })
  }


  const saveConfiguration = () => {
    setLoading(true);
    const { configurationFor, serverName, jndiServer, jndiServer1, jndiServer2, jndiServer3, driverClass, userName, connectionURL, password, staticReportHead1, staticReportHead2, staticReportHead3, reportHeaderByQuery, logoImageUrl, staticDefaultLimit, logoImageUrl1, logoImageUrl2, logoImageUrl3 } = values;

    const val = {
      "databaseConfigVO": {
        "dashboardFor": configurationFor,
        "driverClassName": driverClass,
        "userName": userName,
        "url": connectionURL,
        "password": password,
        "serverName": serverName,
        "jndiForPrimaryServer": jndiServer,
        "jndiForSecondaryServer1": jndiServer1,
        "jndiForSecondaryServer2": jndiServer2,
        "jndiForSecondaryServer3": jndiServer3,
        "isDbConnectionReq": isDbConnReq,
        "reportHeader1": staticReportHead1,
        "reportHeader2": staticReportHead2,
        "reportHeader3": staticReportHead3,
        "reportHeaderByQuery": reportHeaderByQuery,
        // "logoImage": logoImageUrl,
        "logos": [
          { image: logoImageUrl1, position: logoPosition?.logo1Position },
          { image: logoImageUrl2, position: logoPosition?.logo2Position },
          { image: logoImageUrl3, position: logoPosition?.logo3Position },
        ].slice(0, parseInt(logoCounts)),
        "isDashboardConfigurationCached": isDashboardCached,
        "maxServiceReferenceNo": 2,
        "lstWebServiceClientConfigVO": rows?.length > 0 ? rows : [],
        "isLogoRequired": isLogoReq,
        // "logoPosition": logoPosition,
        "headingAlignment": headingAlignment,
        "isLogAllAccess": isAccessReq,
        "isLogAllError": isErrorReq,
        "isLogAllMsgs": isConsoleReq,
        "isLimitRequired": isLimitRecReq,
        "setDefaultLimit": staticDefaultLimit,
        "logoCounts": logoCounts,
        "isHeadByQueryReq": isHeadByQueryReq
      }
    }

    fetchPostData("/hisutils/dashboard-config-save", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert(data?.message, "success");
        reset();
        setConfirmSave(false);
        setSelectedOption([])
        setLoading(false)
        getDashConfigData()
      } else {
        ToastAlert(data?.message, "error");
        setConfirmSave(false);
        setLoading(false)
      }
    });
  }

  const handleSaveConfig = () => {
    let isValid = true;
    if (!values?.configurationFor?.trim()) {
      setErrors(prev => ({ ...prev, 'configurationForErr': "configuration for is required" }));
      isValid = false;
    }
    if (!values?.serverName?.trim()) {
      setErrors(prev => ({ ...prev, 'serverNameErr': "server name is required" }));
      isValid = false;
    }

    if (isDbConnReq === '1' && !values?.driverClass?.trim()) {
      setErrors(prev => ({ ...prev, 'driverClassErr': "driver class is required" }));
      isValid = false;
    }
    if (isDbConnReq === '1' && !values?.connectionURL?.trim()) {
      setErrors(prev => ({ ...prev, 'connectionURLErr': "connection url is required" }));
      isValid = false;
    }
    if (isDbConnReq === '1' && !values?.userName?.trim()) {
      setErrors(prev => ({ ...prev, 'userNameErr': "user name is required" }));
      isValid = false;
    }
    if (isDbConnReq === '1' && !values?.password?.trim()) {
      setErrors(prev => ({ ...prev, 'passwordErr': "password is required" }));
      isValid = false;
    }
    if (isDbConnReq === '0' && !values?.jndiServer?.trim()) {
      setErrors(prev => ({ ...prev, 'jndiServerErr': "primary server is required" }));
      isValid = false;
    }
    if (isDbConnReq === '0' && !values?.jndiServer1?.trim()) {
      setErrors(prev => ({ ...prev, 'jndiServer1Err': "secondary server is required" }));
      isValid = false;
    }

    if (!values?.staticReportHead1?.trim()) {
      setErrors(prev => ({ ...prev, 'staticReportHead1Err': "report header is required" }));
      isValid = false;
    }
    if (!values?.reportHeaderByQuery?.trim() && isHeadByQueryReq === 'Yes') {
      setErrors(prev => ({ ...prev, 'reportHeaderByQueryErr': "this field is required" }));
      isValid = false;
    }
    if (!isDashboardCached?.trim()) {
      setErrors(prev => ({ ...prev, 'isDashboardCachedErr': "this field is required" }));
      isValid = false;
    }

    if (isValid) {
      setShowConfirmSave(true)
    }
  }

  useEffect(() => {
    if (confirmSave) {
      saveConfiguration();
    }
  }, [confirmSave])

  const reset = () => {
    setValues({ "configurationFor": dashFor, "serverName": "WEBSPHERE", "jndiServer": '', "jndiServer1": '', "jndiServer2": '', "jndiServer3": '', "driverClass": "", "userName": "", "connectionURL": "", "password": "", "staticReportHead1": "", "staticReportHead2": "", "staticReportHead3": "", "reportHeaderByQuery": "", "logoImageUrl": "", "staticDefaultLimit": "", "logoImageUrl1": "", "logoImageUrl2": "", "logoImageUrl3": "" });

    setErrors({ "configurationForErr": '', "serverNameErr": '', "driverClassErr": '', "connectionURLErr": '', "userNameErr": '', "passwordErr": '', "staticReportHead1Err": '', "reportHeaderByQueryErr": '', "jndiServerErr": '', "jndiServer1Err": '', "isDashboardCachedErr": '', });
    setLoading(false)
    setRows([])
    setLogoPosition({ "logo1Position": "left", "logo2Position": "right", "logo3Position": "top" })
  }



  return (
    <>
      <NavbarHeader />
      <div className='main-master-page'>
        <div className='form-card m-auto p-2'>
          <b><h6 className='header-devider m-0 ps-1'>{dt("Configuration Master")}</h6></b>
          {/* <form action=""> */}
          <div className='py-2 px-2'>

            {/* SECTION DEVIDER config for and server*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Configuration For")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputSelect
                      id="configurationFor"
                      name="configurationFor"
                      placeholder={dt("Select value...")}
                      options={dashboardForDt}
                      className="backcolorinput"
                      value={values?.configurationFor}
                      onChange={(e) => { handleValueChange(e); localStorage?.setItem("dfor", e.target.value) }}
                      errorMessage={errors?.configurationForErr}
                    />
                  </div>
                </div>
              </div>
              {/* right columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Server Name")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputSelect
                      className="backcolorinput"
                      // placeholder={dt("Select value...")}
                      id="serverName"
                      name="serverName"
                      options={serverName}
                      value={values?.serverName}
                      onChange={handleValueChange}
                      errorMessage={errors?.serverNameErr}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION DEVIDER is dbconn req */}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    {dt("Is DB Connection String Required")}:
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isDbConnReq"
                        id="isDbConnReqYes"
                        value={isDbConnReq}
                        onChange={(e) => setIsDbConnReq('1')}
                        checked={isDbConnReq === "1"}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt("Yes")}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isDbConnReq"
                        id="isDbConnReqNo"
                        value={isDbConnReq}
                        onChange={(e) => setIsDbConnReq('0')}
                        checked={isDbConnReq === '0'}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt("No")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* right columns */}
              {/* <div className='col-sm-6'>
                                </div> */}
            </div>

            {/* SECTION DEVIDER */}
            {/* IF DB CONNECTION STRING NO */}
            {isDbConnReq === '0' &&
              <div iv className='role-theme db-connection-grid' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                {/* <div className='col-sm-6'> */}
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0 required-label align-content-center">{dt("JNDI for Primary Server")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputField
                      type="text"
                      className="backcolorinput"
                      placeholder={dt("For Saving Dashboard Master,Running Data service")}
                      name='jndiServer'
                      id='jndiServer'
                      value={values?.jndiServer}
                      onChange={handleValueChange}
                      errorMessage={errors?.jndiServerErr}

                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0 required-label align-content-center">{dt("JNDI for Secondary Server 1(Reporting Server)")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputField
                      type="text"
                      className="backcolorinput"
                      placeholder={dt("For Running Dashboard")}
                      name='jndiServer1'
                      id='jndiServer1'
                      value={values?.jndiServer1}
                      onChange={handleValueChange}
                      errorMessage={errors?.jndiServer1Err}

                    />
                  </div>
                </div>
                {/* </div> */}
                {/* right columns */}
                {/* <div className='col-sm-6'> */}
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label fix-label pe-0 align-content-center">{dt("JNDI for Secondary Server 2(Reporting Server)")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputField
                      type="text"
                      className="backcolorinput"
                      placeholder={dt("For Running Dashboard")}
                      name='jndiServer2'
                      id='jndiServer2'
                      value={values?.jndiServer2}
                      onChange={handleValueChange}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label fix-label pe-0 align-content-center">{dt("JNDI for Secondary Server 3(Reporting Server)")} : </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <InputField
                      type="text"
                      className="backcolorinput"
                      placeholder={dt("For Running Dashboard")}
                      name='jndiServer3'
                      id='jndiServer3'
                      value={values?.jndiServer3}
                      onChange={handleValueChange}
                    />
                  </div>
                </div>
                {/* </div> */}
              </div>
            }
            {/* SECTION DEVIDER */}
            {/* IF DB CONNECTION STRING YES */}
            {isDbConnReq === '1' &&
              <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Driver Class Name")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter value...")}
                        name='driverClass'
                        id='driverClass'
                        value={values?.driverClass}
                        onChange={handleValueChange}
                        errorMessage={errors?.driverClassErr}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0 required-label">{dt("UserName")}  : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter value...")}
                        name='userName'
                        id='userName'
                        value={values?.userName}
                        onChange={handleValueChange}
                        errorMessage={errors?.userNameErr}
                      />
                    </div>
                  </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("Connection URL")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter value...")}
                        name='connectionURL'
                        id='connectionURL'
                        value={values?.connectionURL}
                        onChange={handleValueChange}
                        errorMessage={errors?.connectionURLErr}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("Password")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="password"
                        className="backcolorinput"
                        placeholder={dt("Enter value...")}
                        name='password'
                        id='password'
                        value={values?.password}
                        onChange={handleValueChange}
                        errorMessage={errors?.passwordErr}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* SECTION DEVIDER 4 logs radio*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0 required-label">
                    {dt("Is Dashboard Configuration Cached")} :
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isDashboardCachedYes"
                        name="isDashboardCached"
                        value={isDashboardCached}
                        onChange={(e) => setIsDashboardCached('Yes')}
                        checked={isDashboardCached === 'Yes'}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt("Yes")}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isDashboardCachedNo"
                        name="isDashboardCached"
                        value={isDashboardCached}
                        onChange={(e) => setIsDashboardCached('No')}
                        checked={isDashboardCached === 'No'}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt("No")}
                      </label>
                    </div>
                    {errors?.isDashboardCachedErr &&
                      <div className="required-input">
                        {errors?.isDashboardCachedErr}
                      </div>
                    }
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    {dt("Is Access Log Required")} :
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isAccessReqYes"
                        name="isAccessReq"
                        value={isAccessReq}
                        onChange={(e) => setIsAccessReq('Yes')}
                        checked={isAccessReq === 'Yes'}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt("Yes")}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isAccessReqNo"
                        name="isAccessReq"
                        value={isAccessReq}
                        onChange={(e) => setIsAccessReq('No')}
                        checked={isAccessReq === 'No'}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt("No")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* right columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    {dt("Is Console Log Required")} :
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isConsoleReqYes"
                        name="isConsoleReq"
                        value={isConsoleReq}
                        onChange={(e) => setIsConsoleReq('Yes')}
                        checked={isConsoleReq === 'Yes'}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt("Yes")}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isConsoleReqNo"
                        name="isConsoleReq"
                        value={isConsoleReq}
                        onChange={(e) => setIsConsoleReq('No')}
                        checked={isConsoleReq === 'No'}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt("No")}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    {dt("Is Error Log Required")} :
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isErrorReqYes"
                        name="isErrorReq"
                        value={isErrorReq}
                        onChange={(e) => setIsErrorReq('Yes')}
                        checked={isErrorReq === 'Yes'}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt("Yes")}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isErrorReqNo"
                        name="isErrorReq"
                        value={isErrorReq}
                        onChange={(e) => setIsErrorReq('No')}
                        checked={isErrorReq === 'No'}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt("No")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <b><h6 className='header-devider my-1 ps-1'>{dt("Header Details")}</h6></b>

            {/* SECTION DEVIDER static header and report header*/}
            <div iv className='role-theme user-form db-connection-grid' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              {/* <div className='col-sm-6'> */}
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Static Report Header1")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder={dt("Enter value...")}
                    name='staticReportHead1'
                    id='staticReportHead1'
                    value={values?.staticReportHead1}
                    onChange={handleValueChange}
                    errorMessage={errors?.staticReportHead1Err}
                    isSpecialChrs={true}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt("Static Report Header2")}  : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder={dt("Enter value...")}
                    name='staticReportHead2'
                    id='staticReportHead2'
                    value={values?.staticReportHead2}
                    onChange={handleValueChange}
                    isSpecialChrs={true}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-5 col-form-label fix-label pe-0">{dt("Static Report Header3")} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder={dt("Enter value...")}
                    name='staticReportHead3'
                    id='staticReportHead3'
                    value={values?.staticReportHead3}
                    onChange={handleValueChange}
                    isSpecialChrs={true}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">
                  {dt("Heading Alignment")}:
                </label>
                <div className="col-sm-7 ps-0 align-content-center">

                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="headingAlignmentLeft"
                      name="headingAlignment"
                      value={headingAlignment}
                      onChange={(e) => setHeadingAlignment("Left")}
                      checked={headingAlignment === "Left"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      {dt("Left")}
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="headingAlignmentRight"
                      name="headingAlignment"
                      value={headingAlignment}
                      onChange={(e) => setHeadingAlignment("right")}
                      checked={headingAlignment === "right"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      {dt("Right")}
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="headingAlignmentCenter"
                      name="headingAlignment"
                      value={headingAlignment}
                      onChange={(e) => setHeadingAlignment("Center")}
                      checked={headingAlignment === "Center"}
                    />
                    <label className="form-check-label" htmlFor="dbYes">
                      {dt("Center")}
                    </label>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>

            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    {dt("Is Header By Query Required")}:
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isHeadByQueryReqYes"
                        name="isHeadByQueryReq"
                        value={isHeadByQueryReq}
                        onChange={(e) => setIsHeadByQueryReq('Yes')}
                        checked={isHeadByQueryReq === 'Yes'}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt("Yes")}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isHeadByQueryReqNo"
                        name="isHeadByQueryReq"
                        value={isHeadByQueryReq}
                        onChange={(e) => setIsHeadByQueryReq('No')}
                        checked={isHeadByQueryReq === 'No'}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt("No")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* right columns */}
              <div className='col-sm-6'>
                {isHeadByQueryReq === "Yes" &&
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("Report Header By Query")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <textarea
                        className="form-control backcolorinput"
                        placeholder={dt("Enter value...")}
                        rows="1"
                        name='reportHeaderByQuery'
                        id='reportHeaderByQuery'
                        value={values?.reportHeaderByQuery}
                        onChange={handleValueChange}
                      ></textarea>
                      {errors?.reportHeaderByQueryErr &&
                        <div className="required-input">
                          {errors?.reportHeaderByQueryErr}
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <b><h6 className='header-devider my-1 ps-1'>{dt("Logo Details")} -  <i><span className='required-label'>{dt("click on icon to uplaod logos")}</span></i></h6></b>
            {/* SECTION DEVIDER logo details*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    {dt("Is Logo Required")}:
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isLogoReqYes"
                        name="isLogoReq"
                        value={isLogoReq}
                        onChange={(e) => setIsLogoReq('Yes')}
                        checked={isLogoReq === 'Yes'}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt("Yes")}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isLogoReqNo"
                        name="isLogoReq"
                        value={isLogoReq}
                        onChange={(e) => setIsLogoReq('No')}
                        checked={isLogoReq === 'No'}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt("No")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* right columns */}
              {isLogoReq === 'Yes' &&
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">
                      {dt("Logo Counts")}:
                    </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="logoPositionTop"
                          name="logoCounts"
                          value={logoCounts}
                          onChange={(e) => setLogoCounts("1")}
                          checked={logoCounts === "1"}
                        />
                        <label className="form-check-label" htmlFor="dbYes">
                          1
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="logoPositionLeft"
                          name="logoPosition"
                          value={logoCounts}
                          onChange={(e) => setLogoCounts("2")}
                          checked={logoCounts === "2"}
                        />
                        <label className="form-check-label" htmlFor="dbNo">
                          2
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="logoPositionLeft"
                          name="logoPosition"
                          value={logoCounts}
                          onChange={(e) => setLogoCounts("3")}
                          checked={logoCounts === "3"}
                        />
                        <label className="form-check-label" htmlFor="dbNo">
                          3
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            {isLogoReq === 'Yes' &&
              <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                  {(logoCounts === "1" || logoCounts === "2" || logoCounts === "3") &&
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">{dt("Logo 1 File")} : </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <LogoUploader
                          name="logoImageUrl1"
                          value={values.logoImageUrl1}
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  }
                  {(logoCounts === "2" || logoCounts === "3") &&
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">{dt("Logo 2 File")} : </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <LogoUploader
                          name="logoImageUrl2"
                          value={values.logoImageUrl2}
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  }
                  {logoCounts === "3" &&
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">{dt("Logo 3 File")} : </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <LogoUploader
                          name='logoImageUrl3'
                          value={values.logoImageUrl3}
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  }
                </div>
                {/* right columns */}

                <div className='col-sm-6'>
                  {(logoCounts === "1" || logoCounts === "2" || logoCounts === "3") &&
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">
                        {dt("Logo 1 Position")}:
                      </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo1PositionLeft"
                            name="logo1Position"
                            value={logoPosition?.logo1Position}
                            onChange={(e) => setLogoPosition({ ...logoPosition, "logo1Position": "left" })}
                            checked={logoPosition?.logo1Position === "left"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            {dt("Left")}
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo1PositionTop"
                            name="logo1Position"
                            value={logoPosition?.logo1Position}
                            onChange={(e) => setLogoPosition({ ...logoPosition, "logo1Position": "top" })}
                            checked={logoPosition?.logo1Position === "top"}
                          />
                          <label className="form-check-label" htmlFor="dbYes">
                            {dt("Center")}
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo1PositionRight"
                            name="logo1Position"
                            value={logoPosition?.logo1Position}
                            onChange={(e) => setLogoPosition({ ...logoPosition, "logo1Position": "right" })}
                            checked={logoPosition?.logo1Position === "right"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            {dt("Right")}
                          </label>
                        </div>
                      </div>
                    </div>
                  }
                  {(logoCounts === "2" || logoCounts === "3") &&
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">
                        {dt("Logo 2 Position")}:
                      </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo2PositionLeft"
                            name="logo2Position"
                            value={logoPosition?.logo2Position}
                            onChange={(e) => setLogoPosition({ ...logoPosition, "logo2Position": "left" })}
                            checked={logoPosition?.logo2Position === "left"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            {dt("Left")}
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo2PositionTop"
                            name="logo2Position"
                            value={logoPosition?.logo2Position}
                            onChange={(e) => setLogoPosition({ ...logoPosition, "logo2Position": "top" })}
                            checked={logoPosition?.logo2Position === "top"}
                          />
                          <label className="form-check-label" htmlFor="dbYes">
                            {dt("Center")}
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo2PositionRight"
                            name="logo2Position"
                            value={logoPosition?.logo2Position}
                            onChange={(e) => setLogoPosition({ ...logoPosition, "logo2Position": "right" })}
                            checked={logoPosition?.logo2Position === "right"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            {dt("Right")}
                          </label>
                        </div>
                      </div>
                    </div>
                  }
                  {logoCounts === "3" &&
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">
                        {dt("Logo 3 Position")}:
                      </label>
                      <div className="col-sm-7 ps-0 align-content-center">

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo3PositionLeft"
                            name="logo3Position"
                            value={logoPosition?.logo3Position}
                            onChange={(e) => setLogoPosition({ ...logoPosition, "logo3Position": "left" })}
                            checked={logoPosition?.logo3Position === "left"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            {dt("Left")}
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo3PositionTop"
                            name="logo3Position"
                            value={logoPosition?.logo3Position}
                            onChange={(e) => setLogoPosition({ ...logoPosition, "logo3Position": "top" })}
                            checked={logoPosition?.logo3Position === "top"}
                          />
                          <label className="form-check-label" htmlFor="dbYes">
                            {dt("Center")}
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo3PositionRight"
                            name="logo3Position"
                            value={logoPosition?.logo3Position}
                            onChange={(e) => setLogoPosition({ ...logoPosition, "logo3Position": "right" })}
                            checked={logoPosition?.logo3Position === "right"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            {dt("Right")}
                          </label>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            {/* SECTION DEVIDER default limits*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
              {/* //left columns */}
              <div className='col-sm-6'>
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    {dt("\"Limit Records\" Feature Required")}:
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isLimitRecReqYes"
                        name="isLimitRecReq"
                        value={isLimitRecReq}
                        onChange={(e) => setIsLimitRecReq('Yes')}
                        checked={isLimitRecReq === 'Yes'}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        {dt("Yes")}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isLimitRecReqNo"
                        name="isLimitRecReq"
                        value={isLimitRecReq}
                        onChange={(e) => setIsLimitRecReq('No')}
                        checked={isLimitRecReq === 'No'}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        {dt("No")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* right columns */}
              {isLimitRecReq === 'Yes' &&
                <div className='col-sm-6'>
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">{dt("Static Set Default Limit")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder={dt("Enter value...")}
                        name='staticDefaultLimit'
                        id='staticDefaultLimit'
                        value={values?.staticDefaultLimit}
                        onChange={handleValueChange}
                      />
                    </div>
                  </div>
                </div>
              }
            </div>

            <div className="table-responsive row pt-1">
              <table className="table table-borderless text-center mb-0">
                <thead className="text-white">
                  <tr className='header-devider m-0'>
                    <th style={{ width: "15%" }}>{dt("Service Reference Name")}</th>
                    <th style={{ width: "25%" }}>{dt("Server URL")}</th>
                    <th style={{ width: "15%" }}>{dt("Default Method")}</th>
                    <th style={{ width: "15%" }}>{dt("Service User Name")}</th>
                    <th style={{ width: "15%" }}>{dt("Service Password")}</th>
                    <th style={{ width: "15%" }}>{dt("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <InputField
                        type="text"
                        className="backcolorinput"
                        name='serviceReferenceName'
                        id='serviceReferenceName'
                        value={newRow?.serviceReferenceName}
                        onChange={(e) => handleInputChange("serviceReferenceName", e.target.value)}


                      />
                    </td>
                    <td>
                      <InputField
                        type="text"
                        className="backcolorinput"
                        name='serviceInitialServerURL'
                        id='serviceInitialServerURL'
                        value={newRow?.serviceInitialServerURL}
                        onChange={(e) => handleInputChange("serviceInitialServerURL", e.target.value)}
                      />
                    </td>
                    <td>
                      <InputSelect
                        className="backcolorinput"
                        options={[{ value: 1, label: "GET" }, { value: 2, label: "POST" }]}
                        id="defaultMethod"
                        name="defaultMethod"
                        value={newRow?.defaultMethod}
                        onChange={(e) => handleInputChange("defaultMethod", e.target.value)}
                      >
                      </InputSelect>
                    </td>
                    <td>
                      <InputField
                        type="text"
                        className="backcolorinput"
                        name="serviceUserName"
                        id='serviceUserName'
                        value={newRow?.serviceUserName}
                        onChange={(e) => handleInputChange("serviceUserName", e.target.value)}
                      />
                    </td>
                    <td>
                      <InputField
                        type="password"
                        className="backcolorinput"
                        name="servicePassword"
                        id='servicePassword'
                        value={newRow?.servicePassword}
                        onChange={(e) => handleInputChange("servicePassword", e.target.value)}
                        maxLength={20}
                      />
                    </td>
                    <td className='px-0 action-buttons'>
                      <button className='btn btn-sm me-1 py-0 px-0' style={{ background: "#34495e", color: "white" }} onClick={() => handleAddRow()}><FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size='sm' />{isEditing !== null ? dt("Modify") : dt("Add")}</button>

                      <button className='btn btn-sm ms-1 py-0 px-0' style={{ background: "#34495e", color: "white" }} onClick={() => clearRow()}><FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon" size='sm' />{dt("Clear")}</button>
                    </td>
                  </tr>
                  {rows?.map((row, index) => (
                    <tr className='table-row-form text-start' key={index}>
                      <td>{row?.serviceReferenceName || "---"}</td>
                      <td>{row?.serviceInitialServerURL || "---"}</td>
                      <td>{row?.defaultMethod || "---"}</td>
                      <td>{row?.serviceUserName || "---"}</td>
                      <td>{("*")?.repeat(row?.servicePassword?.length)}</td>
                      <td className=''>
                        <div className='text-center'>
                          <button
                            className="btn btn-warning btn-sm me-1 py-0 px-1"
                            onClick={() => handleEditRow(index)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="dropdown-gear-icon" size='xs' />
                          </button>
                          <button
                            className="btn btn-danger btn-sm ms-1 py-0 px-1"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="dropdown-gear-icon" size='xs' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* </form> */}
          <div className='text-center py-1 rounded-2 configuration-buttons'>
            <button className='btn btn-sm me-1' onClick={() => handleSaveConfig()}><FontAwesomeIcon icon={faFile} className="dropdown-gear-icon me-1" />{dt("Save")}</button>
            <button className='btn btn-sm ms-1 me-1' onClick={() => checkDatabaseConnection()}><FontAwesomeIcon icon={faDatabase} className="dropdown-gear-icon me-1" />{dt("Test DB Connection")}</button>
            <button className='btn btn-sm ms-1 me-1' onClick={reset}><FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon me-1" />{dt("Reset")}</button>
            <button className='btn btn-sm ms-1 me-1' onClick={getDashConfigData}><FontAwesomeIcon icon={faDatabase} className="dropdown-gear-icon me-1" />{dt("Refresh Data")}</button>
            <button className='btn btn-sm ms-1' onClick={clearAllCache}>
              <FontAwesomeIcon icon={faDatabase} className="dropdown-gear-icon me-1" />
              {dt("Clear All Cached Data")}
            </button>
          </div>
          {/* <SessionClock /> */}
        </div>
      </div>
    </>
  )
}

export default DbConfigMaster

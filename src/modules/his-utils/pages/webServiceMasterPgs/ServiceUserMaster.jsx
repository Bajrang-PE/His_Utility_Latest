import React, { useContext, useEffect, useState } from 'react'
import NavbarHeader from '../../components/headers/NavbarHeader'
import GlobalButtonGroup from '../../components/commons/GlobalButtonGroup'
import InputField from '../../components/commons/InputField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faMinus } from '@fortawesome/free-solid-svg-icons'
import InputSelect from '../../components/commons/InputSelect'
import { HISContext } from '../../contextApi/HISContext'
import { ToastAlert } from '../../utils/commonFunction'
import GlobalDataTable from '../../components/commons/GlobalDataTable'
import { fetchPostData } from '../../../../utils/HisApiHooks'

const ServiceUserMaster = () => {
  const { setShowDataTable, getAllServiceData, dataServiceDrpData, selectedOption, setSelectedOption, setActionMode, actionMode, getUserServiceData, userServiceData, setLoading, setShowConfirmSave, confirmSave, setConfirmSave, dt } = useContext(HISContext);

  const [values, setValues] = useState({
    "username": "", "password": "", "id": '', "dashboardFor": ""
  })
  const [errors, setErrors] = useState({ usernameErr: "", passwordErr: "", serviceIdErr: "" });
  const [previlegeFor, setPrevilegeFor] = useState('allServices')
  const [rows, setRows] = useState([{ serviceId: "", noOfServiceUsageAllowed: "-1" }]);
  const [showServiceUserTable, setShowServiceUserTable] = useState(false)
  const [singleData, setSingleData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterData, setFilterData] = useState(userServiceData)

  useEffect(() => {
    if (dataServiceDrpData?.length === 0) { getAllServiceData(); }
    if (userServiceData?.length === 0) { getUserServiceData(); }
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

  useEffect(() => {
    if (!searchInput) {
      setFilterData(userServiceData);
    } else {
      const lowercasedText = searchInput.toLowerCase();
      const newFilteredData = userServiceData.filter(row => {
        const paramId = row?.id?.toString() || "";
        const paramName = row?.jsonData?.userName?.toLowerCase() || "";
        const paramDisplayName = row?.jsonData?.previlege?.toLowerCase() || "";

        return paramId?.includes(lowercasedText) || paramName.includes(lowercasedText) || paramDisplayName.includes(lowercasedText);
      });
      setFilterData(newFilteredData);
      console.log(newFilteredData, 'newFilteredData')
    }
  }, [searchInput, userServiceData]);

  const handleUpdateData = () => {
    if (selectedOption?.length > 0) {
      const selectedRow = userServiceData?.filter(dt => dt?.id === selectedOption[0]?.id)
      setSingleData(selectedRow);
      setActionMode('edit');
      setShowDataTable(false);
      setShowServiceUserTable(false);
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
        username: jsonData?.userName,
        password: jsonData?.password
      })
      setPrevilegeFor(jsonData?.previlege);
      setRows(jsonData?.lstServiceMapped?.length > 0 ? jsonData?.lstServiceMapped : []);
    }
  }, [singleData])

  const saveServiceUserData = () => {
    setLoading(true)
    const {
      username, password, id, dashboardFor
    } = values;
    const val = {
      dashboardFor: "GLOBAL",
      masterName: "ServiceUserMst",
      entryUserId: 101,
      keyName: username,
      jsonData: {
        userName: username,
        password: password,
        isLogsRequired: "",
        previlege: previlegeFor,
        lstServiceMapped: rows
      }
    };

    fetchPostData("/hisutils/ServiceUsersave", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Saved Successfully", "success");
        getUserServiceData();
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

  const updateServiceUserData = () => {
    setLoading(true)
    const {
      username, password, id, dashboardFor
    } = values;
    const val = {
      id: id,
      dashboardFor: "GLOBAL",
      masterName: "ServiceUserMst",
      entryUserId: 101,
      keyName: username,
      jsonData: {
        userName: username,
        password: password,
        isLogsRequired: "",
        previlege: previlegeFor,
        lstServiceMapped: rows
      }
    };

    fetchPostData("/hisutils/ServiceUserUpdate", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Updated Successfully", "success");
        getUserServiceData();
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

  const handleDeleteServiceUser = () => {
    if (selectedOption?.length > 0) {
      setLoading(true)
      const isReset = window.confirm('Do you want to reset whole form!');
      if (isReset) {
        const val = { "id": selectedOption[0]?.id, "dashboardFor": "GLOBAL", "masterName": "ServiceUserMst" };
        fetchPostData("/hisutils/ServiceUserDelete", val).then((data) => {
          if (data?.status === 1) {
            ToastAlert('Deleted Successfully!', 'success');
            getUserServiceData();
            setSelectedOption([]);
            reset();
            setLoading(false)
          } else {
            ToastAlert(data?.message, 'error');
            setLoading(false)
          }
        })
      } else {
        setSelectedOption([]);
      }
    } else {
      ToastAlert('Please select a record', 'warning');
    }
  }

  const handleSaveUpdate = () => {
    let isValid = true;
    if (!values?.username?.trim()) {
      setErrors(prev => ({ ...prev, 'usernameErr': "user name is required" }));
      isValid = false;
    }
    if (!values?.password?.trim()) {
      setErrors(prev => ({ ...prev, 'passwordErr': "password is required" }));
      isValid = false;
    }

    if (previlegeFor === "selectedServices" && rows?.length > 0 && !rows[rows?.length - 1]?.serviceId) {
      setErrors(prev => ({ ...prev, 'serviceIdErr': "please select service name" }));
      isValid = false;
    }

    if (isValid) {
      setShowConfirmSave(true);
    }
  }

  useEffect(() => {
    if (confirmSave) {
      if (actionMode === 'edit') {
        updateServiceUserData();
      } else {
        saveServiceUserData();
      }
    }
  }, [confirmSave])

  const reset = () => {
    setValues({ "username": "", "password": "", "id": '', "dashboardFor": "" });
    setRows([{ serviceId: "", noOfServiceUsageAllowed: "-1" }]);
    setErrors({ usernameErr: "", passwordErr: "", serviceIdErr: "" })
    setPrevilegeFor('allServices');
    setActionMode('home');
    setShowServiceUserTable(false);
    setShowDataTable(false);
    setLoading(false)
  }

  // Handle input change
  const handleInputChange = (index, field, value) => {
    if (field && value) {
      setErrors({ ...errors, [field + "Err"]: '' })
    }
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Add a new row
  const handleAddRow = () => {
    if (rows?.length > 0 && !rows[rows?.length - 1]?.serviceId) {
      setErrors(prev => ({ ...prev, 'serviceIdErr': "please select service name" }));
    } else {
      setRows([...rows, { serviceId: "", noOfServiceUsageAllowed: "-1" }]);
    }
  };

  // Remove a row
  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

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
      width: "10%"
    },
    {
      name: dt('Service User Name'),
      selector: row => row?.jsonData?.userName || "---",
      sortable: true,
    },
    {
      name: dt('Previlege For'),
      selector: row => row?.jsonData?.previlege || "---",
      sortable: true,
    },
  ]

  const onOpenUserService = () => {
    setShowDataTable(true);
    setShowServiceUserTable(true);
  }

  const onTableClose = () => {
    setShowServiceUserTable(false);
    setSearchInput('');
    setSelectedOption([]);
  }

  return (
    <div>
      <NavbarHeader />
      <div className='main-master-page'>
        <GlobalButtonGroup isSave={true} isOpen={true} isReset={true} isParams={false} isWeb={false} onSave={handleSaveUpdate} onOpen={onOpenUserService} onReset={reset} onParams={null} onWeb={null} />
        <div className='form-card m-auto p-3'>
          <b><h6 className='header-devider mt-0 mb-1'>{dt('Service User Master')}</h6></b>
          {/* SECTION DEVIDER*/}
          <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
            {/* //left columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">{dt('UserName')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name='username'
                    id="username"
                    onChange={handleValueChange}
                    value={values?.username}
                  />
                  {errors?.usernameErr &&
                    <div className="required-input">
                      {errors?.usernameErr}
                    </div>
                  }
                </div>
              </div>
            </div>
            {/* right columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Password')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name='password'
                    id="password"
                    onChange={handleValueChange}
                    value={values?.password}
                  />
                  {errors?.passwordErr &&
                    <div className="required-input">
                      {errors?.passwordErr}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* SECTION DEVIDER Previlege For */}
          <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
            {/* //left columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">
                  {dt('Previlege For')} :
                </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="previlegeForAll"
                      name="previlegeFor"
                      value={previlegeFor}
                      onChange={(e) => setPrevilegeFor("allServices")}
                      checked={previlegeFor === "allServices"}
                    />
                    <label className="form-check-label" htmlFor="dbYes">
                      {dt('All Services')}
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="previlegeFor"
                      id="previlegeForSelected"
                      value={previlegeFor}
                      onChange={(e) => setPrevilegeFor("selectedServices")}
                      checked={previlegeFor === "selectedServices"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      {dt('Selected Services')}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {previlegeFor !== "selectedServices" &&
            <b><h6 className='header-devider m-1' style={{ padding: "10px" }}></h6></b>
          }
          {previlegeFor === "selectedServices" &&
            <>
              <b><h6 className='header-devider mt-0 mb-1'>{dt('Service Previleges')}</h6></b>
              <div className="table-responsive">
                <table className="table text-center mb-0 table-bordered">
                  <thead className="text-white">
                    <tr className='m-0' style={{ fontSize: "smaller" }}>
                      <th style={{ width: "40%" }}>
                        <span className='required-label'>
                          {dt('Service Name')}
                        </span>
                      </th>
                      <th style={{ width: "20%" }}>
                        <span className='required-label'>
                          {dt('No. of use in one day')}
                          {dt('( "-1" means indefinite usage)')}

                        </span>
                      </th>
                      <th style={{ width: "10%" }}>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleAddRow()}
                          style={{ padding: "0 4px" }}
                        >
                          <FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size='sm' />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <InputSelect
                            type="text"
                            className="backcolorinput w-50 m-auto"
                            name='serviceName'
                            id='serviceName'
                            options={dataServiceDrpData}
                            value={row.serviceId}
                            onChange={(e) => handleInputChange(index, "serviceId", e.target.value)}
                            placeholder="Select Value..."
                          />
                        </td>
                        <td>
                          <InputField
                            type="number"
                            className="backcolorinput w-50 m-auto"
                            name='serverUrl'
                            id='serverUrl'
                            value={row.noOfServiceUsageAllowed}
                            onChange={(e) => handleInputChange(index, "noOfServiceUsageAllowed", e.target.value)}
                            placeholder="Enter counts..."
                          />
                        </td>
                        <td className='px-0'>
                          {rows.length > 0 && (
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleRemoveRow(index)}
                              style={{ padding: "0 4px" }}
                            >
                              <FontAwesomeIcon icon={faMinus} className="dropdown-gear-icon" size='sm' />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {errors?.serviceIdErr &&
                      <div className="required-input">
                        {errors?.serviceIdErr}
                      </div>
                    }
                  </tbody>
                </table>
              </div>
            </>
          }

        </div>
      </div>
      {showServiceUserTable &&
        <GlobalDataTable title={dt("Service User List")} column={column} data={filterData} onModify={handleUpdateData} onDelete={handleDeleteServiceUser} setSearchInput={setSearchInput} onClose={onTableClose} isShowBtn={true} />
      }
    </div>
  )
}

export default ServiceUserMaster

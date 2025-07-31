import React, { useContext, useEffect, useState } from 'react'
import NavbarHeader from '../../components/headers/NavbarHeader'
import InputField from '../../components/commons/InputField'
import GlobalButtonGroup from '../../components/commons/GlobalButtonGroup'
import { HISContext } from '../../contextApi/HISContext'
import GlobalDataTable from '../../components/commons/GlobalDataTable'
import { ToastAlert } from '../../utils/commonFunction'
import { fetchPostData } from '../../../../utils/HisApiHooks'

const DbSubmenuMaster = () => {
  const { setShowDataTable, selectedOption, setSelectedOption, setActionMode, actionMode, dashboardSubmenuData, getDashboardSubmenuData, setLoading, setShowConfirmSave, confirmSave, setConfirmSave,dt } = useContext(HISContext);

  const [showServiceUserTable, setShowServiceUserTable] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [singleData, setSingleData] = useState([]);
  const [filterData, setFilterData] = useState(dashboardSubmenuData)
  const [submenuId, setSubmenuId] = useState('')

  const [values, setValues] = useState({
    "subMenuValue": "", "mobileIcon": "", "mobilebgColor": "", "mobileFontColor": ""
  });

  const [errors, setErrors] = useState({ subMenuValueErr: "", mobileIconErr: "" });

  useEffect(() => {
    if (dashboardSubmenuData?.length === 0) { getDashboardSubmenuData(); }
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
      setFilterData(dashboardSubmenuData);
    } else {
      const lowercasedText = searchInput.toLowerCase();
      const newFilteredData = dashboardSubmenuData.filter(row => {
        const paramId = row?.subMenuId?.toString() || "";
        const paramName = row?.subMenuValue?.toLowerCase() || "";

        return paramId?.includes(lowercasedText) || paramName.includes(lowercasedText);
      });
      setFilterData(newFilteredData);
    }
  }, [searchInput, dashboardSubmenuData]);

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
              checked={selectedOption[0]?.subMenuId === row?.subMenuId}
              onChange={(e) => { setSelectedOption([row]) }}
            />
          </span>
        </div>,
      width: "8%"
    },
    {
      name: dt('ID'),
      selector: row => row.subMenuId,
      sortable: true,
      width: "10%"
    },
    {
      name: dt('Submenu Value'),
      selector: row => row?.subMenuValue || "---",
      sortable: true,
    },
  ]

  const handleUpdateData = () => {
    if (selectedOption?.length > 0) {
      const selectedRow = dashboardSubmenuData?.filter(dt => dt?.subMenuId === selectedOption[0]?.subMenuId)
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
      setValues({
        ...values,
        subMenuValue: singleData[0]?.subMenuValue,
        mobileIcon: singleData[0]?.mobIcon,
        mobilebgColor: singleData[0]?.mobBcolor,
        mobileFontColor: singleData[0]?.mobFontcolor,
      })
      setSubmenuId(singleData[0]?.subMenuId)
    }
  }, [singleData])

  const saveSubmenuData = () => {
    setLoading(true)
    const { subMenuValue, mobileIcon, mobilebgColor, mobileFontColor } = values;
    const val = {
      subMenuValue: subMenuValue,
      mobIcon: mobileIcon,
      mobBcolor: mobilebgColor,
      mobFontcolor: mobileFontColor,
      seatId: 10001
    };

    fetchPostData("/hisutils/DashboardsubMenuSave", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Saved Successfully", "success");
        getDashboardSubmenuData();
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

  const updateSubmenuData = () => {
    setLoading(true)
    const { subMenuValue, mobileIcon, mobilebgColor, mobileFontColor } = values;
    const val = {
      subMenuId: submenuId,
      subMenuValue: subMenuValue,
      mobIcon: mobileIcon,
      mobBcolor: mobilebgColor,
      mobFontcolor: mobileFontColor,
      seatId: 10001,
      // displayOrder: 0
    };

    fetchPostData("/hisutils/DashboardsubMenuupdate", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert("Data Updated Successfully", "success");
        getDashboardSubmenuData();
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

  const handleDeleteSubmenu = () => {
    if (selectedOption?.length > 0) {
      setLoading(true)
      const isReset = window.confirm('Do you want to delete this record ?');
      if (isReset) {
        fetchPostData(`/hisutils/DashboardsubMenudelete/${selectedOption[0]?.subMenuId}`).then((data) => {
          if (data?.status === 1) {
            ToastAlert('Deleted Successfully!', 'success');
            getDashboardSubmenuData();
            setSelectedOption([]);
            reset();
            setConfirmSave(false);
            setLoading(false)
          } else {
            ToastAlert(data?.message, 'error');
            setConfirmSave(false);
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
    if (!values?.subMenuValue?.trim()) {
      setErrors(prev => ({ ...prev, 'subMenuValueErr': "Submenu Value is required" }));
      isValid = false;
    }
    if (!values?.mobileIcon?.trim()) {
      setErrors(prev => ({ ...prev, 'mobileIconErr': "Mobile Icon is required" }));
      isValid = false;
    }

    if (isValid) {
      setShowConfirmSave(true);
    }
  }

  useEffect(() => {
    if (confirmSave) {
      if (actionMode === 'edit') {
        updateSubmenuData();
      } else {
        saveSubmenuData();
      }
    }
  }, [confirmSave])

  const reset = () => {
    setValues({ "subMenuValue": "", "mobileIcon": "", "mobilebgColor": "", "mobileFontColor": "" });
    setErrors({ subMenuValueErr: "", mobileIconErr: "" });
    setActionMode('home');
    setShowServiceUserTable(false);
    setShowDataTable(false);
    setSubmenuId('')
    setLoading(false)
  }


  const onOpenSubmenuTable = () => {
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
        <GlobalButtonGroup isSave={true} isOpen={true} isReset={true} isParams={false} isWeb={false} onSave={handleSaveUpdate} onOpen={onOpenSubmenuTable} onReset={reset} onParams={null} onWeb={null} />
        <div className='form-card m-auto p-3'>
          <b><h6 className='header-devider mt-0 mb-1'>{dt('Dashboard SubMenu Master')} </h6></b>
          {/* SECTION DEVIDER*/}
          <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
            {/* //left columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">{dt('SubMenu Value')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name='subMenuValue'
                    id="subMenuValue"
                    onChange={handleValueChange}
                    value={values?.subMenuValue}
                  />
                  {errors?.subMenuValueErr &&
                    <div className="required-input">
                      {errors?.subMenuValueErr}
                    </div>
                  }
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt('Mobile BgColor')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="color"
                    className="backcolorinput "
                    placeholder="Enter value..."
                    name='mobilebgColor'
                    id="mobilebgColor"
                    onChange={handleValueChange}
                    value={values?.mobilebgColor}
                  />
                </div>
              </div>
            </div>
            {/* right columns */}
            <div className='col-sm-6'>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Mobile Icon')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name='mobileIcon'
                    id="mobileIcon"
                    onChange={handleValueChange}
                    value={values?.mobileIcon}
                  />
                  {errors?.mobileIconErr &&
                    <div className="required-input">
                      {errors?.mobileIconErr}
                    </div>
                  }
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">{dt('Mobile FontColor')} : </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="color"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name='mobileFontColor'
                    id="mobileFontColor"
                    onChange={handleValueChange}
                    value={values?.mobileFontColor}
                  />
                </div>
              </div>
            </div>
          </div>
          <b><h6 className='header-devider m-1' style={{ padding: "10px" }}></h6></b>
        </div>
      </div>

      {showServiceUserTable &&
        <GlobalDataTable title={dt("Dashboard Submenu List")} column={column} data={filterData} onModify={handleUpdateData} onDelete={handleDeleteSubmenu} setSearchInput={setSearchInput} onClose={onTableClose} isShowBtn={true} />
      }
    </div>
  )
}

export default DbSubmenuMaster

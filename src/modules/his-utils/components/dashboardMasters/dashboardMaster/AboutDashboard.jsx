import React from 'react'
import InputSelect from '../../commons/InputSelect'
import InputField from '../../commons/InputField'
import { cachingStatusForWidgetOptions, dataLoadOptions } from '../../../localData/DropDownData'

const AboutDashboard = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, setValues, dashboardForDt, errors, dt } = props;

    return (
        <div>
            <b><h6 className='header-devider m-0'>{dt("Dashboard Master")}</h6></b>

            {/* SECTION DEVIDER Dashboard for */}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Dashboard For")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="dashboardFor"
                                name="dashboardFor"
                                placeholder={dt("Select value...")}
                                options={dashboardForDt}
                                className="backcolorinput"
                                value={values?.dashboardFor}
                                onChange={(e) => { handleValueChange(e); localStorage?.setItem("dfor", e.target.value) }}
                            />
                            {errors?.dashboardForErr &&
                                <div className="required-input">
                                    {errors?.dashboardForErr}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION DEVIDER tab name,parent,ellipse,css,icon */}
            <div iv className='role-theme user-form db-connection-grid' style={{ paddingBottom: "1px" }}>
                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Dashboard Name (For Display)")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <InputField
                            type="text"
                            className="backcolorinput"
                            placeholder={dt("Enter value...")}
                            name='dashNameDisplay'
                            id="dashNameDisplay"
                            onChange={handleValueChange}
                            value={values?.dashNameDisplay}
                            onBlur={() => { setValues({ ...values, 'dashNameInternal': values?.dashNameDisplay }) }}
                        />
                        {errors?.dashNameDisplayErr &&
                            <div className="required-input">
                                {errors?.dashNameDisplayErr}
                            </div>
                        }
                    </div>
                </div>
                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("Dashboard Name (For Internal)")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <InputField
                            type="text"
                            className="backcolorinput"
                            placeholder={dt("Enter value...")}
                            name='dashNameInternal'
                            id="dashNameInternal"
                            onChange={handleValueChange}
                            value={values?.dashNameInternal}
                        />
                        {errors?.dashNameInternalErr &&
                            <div className="required-input">
                                {errors?.dashNameInternalErr}
                            </div>
                        }
                    </div>
                </div>
                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label pe-0">{dt("Menu Container Background Color")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <InputField
                            type="color"
                            className="backcolorinput"
                            placeholder={dt("Enter value...")}
                            name='menuContainerBgColor'
                            id="menuContainerBgColor"
                            onChange={handleValueChange}
                            value={values?.menuContainerBgColor}
                        />
                    </div>
                </div>
                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label fix-label pe-0">{dt("Dashboard Title Font Color")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <InputField
                            type="color"
                            className="backcolorinput"
                            placeholder={dt("Enter value...")}
                            name='dashTitlefontColor'
                            id="dashTitlefontColor"
                            onChange={handleValueChange}
                            value={values?.dashTitlefontColor}
                        />
                    </div>
                </div>
                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label pe-0 ">{dt("Icon Color")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <InputField
                            type="color"
                            className="backcolorinput"
                            placeholder={dt("Enter value...")}
                            name='iconColor'
                            id="iconColor"
                            onChange={handleValueChange}
                            value={values?.iconColor}
                        />
                    </div>
                </div>
                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label pe-0">{dt("Menu Container Background Image")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <InputSelect
                            id="menuContainerBgImage"
                            name="menuContainerBgImage"
                            placeholder={dt("No Image")}
                            options={[{ value: 'background11.png', label: "background11.png" }]}
                            className="backcolorinput"
                            value={values?.menuContainerBgImage}
                            onChange={handleValueChange}
                        />
                    </div>
                </div>
                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label pe-0">{dt("Caching Status")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <InputSelect
                            id="cachingStatus"
                            name="cachingStatus"
                            options={cachingStatusForWidgetOptions}
                            placeholder={dt("Select value...")}
                            className="backcolorinput"
                            onChange={handleValueChange}
                            value={values?.cachingStatus}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">
                        {dt("Is Print Button Required")} :
                    </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="isPrintBtnReq"
                                id="isPrintBtnReqYes"
                                value={'Yes'}
                                onChange={handleRadioChange}
                                checked={radioValues?.isPrintBtnReq === 'Yes'}
                            />
                            <label className="form-check-label" htmlFor="dbYes">
                                {dt("Yes")}
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="isPrintBtnReq"
                                id="isPrintBtnReqNo"
                                value={'No'}
                                onChange={handleRadioChange}
                                checked={radioValues?.isPrintBtnReq === 'No'}
                            />
                            <label className="form-check-label" htmlFor="dbNo">
                                {dt("No")}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">
                        {dt("Dashboard Theme")} :
                    </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="dashboardTheme"
                                id="dashboardThemeYes"
                                value={'Default'}
                                onChange={handleRadioChange}
                                checked={radioValues?.dashboardTheme === 'Default'}
                            />
                            <label className="form-check-label" htmlFor="dbDefault">
                                {dt("Default")}
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="dashboardTheme"
                                id="dashboardThemeNo"
                                value={'Dark'}
                                onChange={handleRadioChange}
                                checked={radioValues?.dashboardTheme === 'Dark'}
                            />
                            <label className="form-check-label" htmlFor="dbDark">
                                {dt("Dark")}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-5 col-form-label pe-0">{dt("Data Load")} : </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                        <InputSelect
                            id="dataLoad"
                            name="dataLoad"
                            options={dataLoadOptions}
                            className="backcolorinput"
                            onChange={handleValueChange}
                            value={values?.dataLoad}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AboutDashboard

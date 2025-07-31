import React from 'react'

const HeaderDetails = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, setValues, errors, dt } = props;
    return (
        <div>
            <b><h6 className='header-devider m-0'>{dt("Dashboard Master - Header Details")}</h6></b>
            {/* SECTION DEVIDER*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Is Header required")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isHeaderReq"
                                    id="isHeaderReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isHeaderReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isHeaderReq"
                                    id="isHeaderReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isHeaderReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION DEVIDER*/}
            {radioValues?.isHeaderReq === 'Yes' &&
                <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                    {/* //left columns */}
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt("Header HTML")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <textarea
                                    className="form-control backcolorinput"
                                    placeholder={dt("Enter value...")}
                                    name="headerHtml"
                                    id='headerHtml'
                                    rows="2"
                                    onChange={handleValueChange}
                                    value={values?.headerHtml}
                                ></textarea>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt("Show Header")} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="showHeader"
                                        id="showHeaderYes"
                                        value={'Only in Big Icon Menu'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.showHeader === 'Only in Big Icon Menu'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt("Only in Big Icon Menu")}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="showHeader"
                                        id="showHeaderNo"
                                        value={'All Tabs'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.showHeader === 'All Tabs'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt("All Tabs")}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt("Header CSS")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <textarea
                                    className="form-control backcolorinput"
                                    placeholder={dt("Enter value...")}
                                    name="headerCss"
                                    id='headerCss'
                                    rows="2"
                                    onChange={handleValueChange}
                                    value={values?.headerCss}
                                ></textarea>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt("Show Header in Global Dashboard Only")} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="showHeaderInGlobalDash"
                                        id="showHeaderInGlobalDashYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.showHeaderInGlobalDash === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt("Yes")}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="showHeaderInGlobalDash"
                                        id="showHeaderInGlobalDashNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.showHeaderInGlobalDash === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt("No")}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* SECTION DEVIDER*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Report Header Type (For PDF AND EXL)")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="rptHeaderTypePdfExl"
                                    id="rptHeaderTypePdfExlYes"
                                    value={'1'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.rptHeaderTypePdfExl === '1'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Static")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="rptHeaderTypePdfExl"
                                    id="rptHeaderTypePdfExlNo"
                                    value={'2'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.rptHeaderTypePdfExl === '2'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("By Query")}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Is Active")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isActive"
                                    id="isActiveYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isActive === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isActive"
                                    id="isActiveNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isActive === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION DEVIDER*/}
            {radioValues?.rptHeaderTypePdfExl === '2' &&
                <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                    {/* //left columns */}
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Report Header By Query")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <textarea
                                    className="form-control backcolorinput"
                                    placeholder={dt("Enter value...")}
                                    name="rptHeaderbyQuery"
                                    id='rptHeaderbyQuery'
                                    rows="2"
                                    onChange={handleValueChange}
                                    value={values?.rptHeaderbyQuery}
                                ></textarea>
                                {errors?.rptHeaderbyQueryErr &&
                                    <div className="required-input">
                                        {errors?.rptHeaderbyQueryErr}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="ps-0 align-content-start">
                            <b>{dt("queryFormat")} :-</b><br />
                            <i> <span>{dt(`select col1 as "ReportHeader1",col2 as "ReportHeader2", col3 as "ReportHeader3" , col4 as "LogoImageURL", col5 as "LogoPosition", col6 as "logoAlignment",col8 as "logoCoordinates", col7 as "IsLogoRequired" from table where condition`)}</span></i>
                        </div>
                    </div>
                </div>
            }

        </div>

    )
}

export default HeaderDetails

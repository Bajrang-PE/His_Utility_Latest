import React, { useEffect, useState } from 'react'
import InputSelect from '../../commons/InputSelect'
import InputField from '../../commons/InputField'
import { cachingStatusForWidgetOptions, widgetRefreshTimeOptions, widgetTypeOptions } from '../../../localData/DropDownData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faMinus } from '@fortawesome/free-solid-svg-icons'

const AboutWidget = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, dashboardForDt, setValues, widgetDrpData, errors, otherLinkData, setOtherLinkData, newRow, setNewRow, setErrors,dt } = props;

    const [rows, setRows] = useState([]);
    const [isEditing, setIsEditing] = useState(null);


    const handleInputChange = (field, e) => {
        const selectedOption = widgetDrpData.find(option => option.value == e.target.value);
        const selectedLabel = selectedOption ? selectedOption.label : "";
        if (e.target.name === 'SQCHILDWidgetId') {
            setNewRow({ ...newRow, [field]: e.target.value, ['drillSQCHILDWidgetName']: selectedLabel })
        } else {
            setNewRow({ ...newRow, [field]: e.target.value });
        }
    };

    useEffect(() => {
        if (values?.lstOtherLink?.length > 0 && radioValues?.widgetViewed === "Other_Link") {
            setOtherLinkData(values?.lstOtherLink);
        }
    }, [values?.lstOtherLink, radioValues?.selectedModeQuery])

    useEffect(() => {
        if (values?.sqChildJsonString?.length > 0) {
            setRows(values?.sqChildJsonString)
        }
    }, [values?.sqChildJsonString])

    // Handle input change
    const handleInputLinkChange = (index, field, value) => {
        const updatedRows = [...otherLinkData];
        updatedRows[index][field] = value;
        setOtherLinkData(updatedRows);
        setValues({ ...values, ['lstOtherLink']: updatedRows })
    };

    const handleAddLinkRow = () => {
        if (otherLinkData?.length > 0 && !otherLinkData[otherLinkData?.length - 1]?.otherLinkName) {
            setErrors(prev => ({ ...prev, 'otherLinkNameErr': "required" }));
        } else if (otherLinkData?.length > 0 && !otherLinkData[otherLinkData?.length - 1]?.otherLinkURL) {
            setErrors(prev => ({ ...prev, 'otherLinkURLErr': "required" }));
        } else {
            setOtherLinkData([...otherLinkData, { otherLinkName: "", otherLinkURL: "" }]);
            setErrors(prev => ({ ...prev, 'otherLinkURLErr': "", 'otherLinkNameErr': "" }));
        }
    };

    const handleRemoveLinkRow = (index) => {
        const updatedRows = otherLinkData.filter((_, i) => i !== index);
        setOtherLinkData(updatedRows);
    };

    // Add a new row
    const handleAddRow = () => {
        if (!newRow?.modeForSQCHILDColumnNo?.trim() || !newRow?.SQCHILDWidgetId?.trim()) {
            if (!newRow?.SQCHILDWidgetId?.trim()) {
                setErrors(prev => ({ ...prev, 'SQCHILDWidgetIdErr': "required" }));
            } else {
                setErrors(prev => ({ ...prev, 'modeForSQCHILDColumnNoErr': "required" }));
            }
        } else {
            if (isEditing !== null) {
                const updatedRows = [...rows];
                updatedRows[isEditing] = newRow;
                setRows(updatedRows);
                setValues({ ...values, ['sqChildJsonString']: updatedRows })
                setIsEditing(null);
            } else {
                let oldDt = values?.sqChildJsonString?.length > 0 ? values?.sqChildJsonString : [];
                setRows([...rows, newRow]);
                oldDt?.push(newRow)
                setValues({ ...values, ['sqChildJsonString']: oldDt })
            }
            setNewRow({ modeForSQCHILDColumnNo: "", SQCHILDWidgetId: "", drillSQCHILDWidgetName: "" });
            setErrors(prev => ({ ...prev, 'modeForSQCHILDColumnNoErr': "", 'SQCHILDWidgetIdErr': "" }));
        }
    };

    const handleEditRow = (index) => {
        setIsEditing(index);
        setNewRow(rows[index]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        setValues({ ...values, ['sqChildJsonString']: updatedRows })
    };

    return (
        <>
            <b><h6 className='header-devider m-0'>{dt('Widget Master - Basic Details')}</h6></b>
            {/* SECTION DEVIDER widget type and for*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
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
                                errorMessage={errors?.widgetForErr}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Widget Type')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput"
                                id="widgetType"
                                name="widgetType"
                                // placeholder="Select value..."
                                options={widgetTypeOptions}
                                value={values?.widgetType}
                                onChange={handleValueChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {values?.widgetType === "singleQueryParent" &&
                <div className="table-responsive row p-1">
                    <table className="table table-borderless text-center mb-0">
                        <thead className="text-white">
                            <tr className='header-devider m-0'>
                                <th style={{ width: "35%" }}>{dt('Column No.')}</th>
                                <th style={{ width: "45%" }}>{dt('Widget')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <InputField
                                        type="text"
                                        className="backcolorinput"
                                        name='modeForSQCHILDColumnNo'
                                        id='modeForSQCHILDColumnNo'
                                        value={newRow?.modeForSQCHILDColumnNo}
                                        onChange={(e) => handleInputChange("modeForSQCHILDColumnNo", e)}
                                        errorMessage={errors?.modeForSQCHILDColumnNoErr}
                                    />
                                </td>
                                <td>
                                    <InputSelect
                                        // type="text"
                                        className="backcolorinput"
                                        name='SQCHILDWidgetId'
                                        id='SQCHILDWidgetId'
                                        options={widgetDrpData}
                                        value={newRow?.SQCHILDWidgetId}
                                        onChange={(e) => handleInputChange("SQCHILDWidgetId", e)}
                                        placeholder={'Select Widget'}
                                        errorMessage={errors?.SQCHILDWidgetIdErr}
                                    />
                                </td>
                                <td className='px-0 action-buttons'>
                                    <button className='btn btn-sm me-1 py-0 px-0' style={{ background: "#34495e", color: "white" }} onClick={() => handleAddRow()}><FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size='sm' />{dt('Add')}</button>
                                </td>
                            </tr>
                            {rows.map((row, index) => (
                                <tr className='table-row-form text-start' key={index}>
                                    <td>{row?.modeForSQCHILDColumnNo}</td>
                                    <td>{row?.drillSQCHILDWidgetName}</td>
                                    <td className=''>
                                        <div className='text-center'>
                                            <button
                                                className="btn btn-secondary btn-sm me-1 py-0 px-1"
                                                onClick={() => handleEditRow(index)}
                                            >{dt('Edit')}
                                                {/* <FontAwesomeIcon icon={faEdit} className="dropdown-gear-icon" size='xs' /> */}
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm ms-1 py-0 px-1"
                                                onClick={() => handleRemoveRow(index)}
                                            >{dt('Delete')}
                                                {/* <FontAwesomeIcon icon={faTrash} className="dropdown-gear-icon" size='xs' /> */}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <b><h6 className='header-devider mt-1'></h6></b>
                </div>
            }

            {/* SECTION DEVIDER widget viewed and is visible*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">
                           {dt('Widget Viewed')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="widgetViewedTabular"
                                    name="widgetViewed"
                                    value={"Tabular"}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.widgetViewed === "Tabular"}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Tabular')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="widgetViewedGraph"
                                    name="widgetViewed"
                                    value={"Graph"}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.widgetViewed === "Graph"}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('Graph')} 
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="widgetViewedKpi"
                                    name="widgetViewed"
                                    value={"KPI"}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.widgetViewed === "KPI"}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('KPI')} 
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="widgetViewedMap"
                                    name="widgetViewed"
                                    value={"Criteria_Map"}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.widgetViewed === "Criteria_Map"}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('Map')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="widgetViewedNewsTicker"
                                    name="widgetViewed"
                                    value={"News_Ticker"}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.widgetViewed === "News_Ticker"}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('News Ticker')} 
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="widgetViewedOtherLink"
                                    name="widgetViewed"
                                    value={"Other_Link"}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.widgetViewed === "Other_Link"}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt(' Other Link')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="widgetViewedIframe"
                                    name="widgetViewed"
                                    value={"Iframe"}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.widgetViewed === "Iframe"}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('Iframe')} 
                                </label>
                            </div>
                            {errors?.widgetViewedErr &&
                                <div className="required-input">
                                    {errors?.widgetViewedErr}
                                </div>
                            }

                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">
                           {dt('Is Widget Name Visible?')}  :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isWidgetNameVisible"
                                    id="isWidgetNameVisibleYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isWidgetNameVisible === "Yes"}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                   {dt('Yes')} 
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isWidgetNameVisible"
                                    id="isWidgetNameVisibleNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isWidgetNameVisible === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('No')} 
                                </label>
                            </div>
                            {errors?.isWidgetNameVisibleErr &&
                                <div className="required-input">
                                    {errors?.isWidgetNameVisibleErr}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION DEVIDER widget name*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Widget Name(For Display)')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='widgetNameDisplay'
                                id="widgetNameDisplay"
                                onChange={handleValueChange}
                                value={values?.widgetNameDisplay}
                                onBlur={() => { setValues({ ...values, 'widgetNameInternal': values?.widgetNameDisplay }) }}
                                errorMessage={errors?.widgetNameDisplayErr}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Widget Name(Internal)')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='widgetNameInternal'
                                id="widgetNameInternal"
                                onChange={handleValueChange}
                                value={values?.widgetNameInternal}
                                errorMessage={errors?.widgetNameInternalErr}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION DEVIDER widget refresh and delay time*/}
            {(radioValues?.widgetViewed !== "Other_Link" && radioValues?.widgetViewed !== "Iframe") &&
                <>
                    <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                        {/* //left columns */}
                        <div className='col-sm-6'>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">{dt('Widget Refresh Time')} : </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <InputSelect
                                        id="widgetRefreshTime"
                                        name="widgetRefreshTime"
                                        // placeholder="Select value..."
                                        options={widgetRefreshTimeOptions}
                                        className="backcolorinput"
                                        value={values?.widgetRefreshTime}
                                        onChange={handleValueChange}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* right columns */}
                        <div className='col-sm-6'>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">{dt('Widget Refresh Delay Time')} : </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <InputSelect
                                        className="backcolorinput"
                                        id="widgetRefreshDelayTime"
                                        name="widgetRefreshDelayTime"
                                        // placeholder="Select value..."
                                        options={widgetRefreshTimeOptions}
                                        value={values?.widgetRefreshDelayTime}
                                        onChange={handleValueChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* SECTION DEVIDER caching status and alignment*/}
                    <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                        {/* //left columns */}
                        <div className='col-sm-6'>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">{dt('Caching Status')} : </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <InputSelect
                                        id="cachingStatus"
                                        name="cachingStatus"
                                        options={cachingStatusForWidgetOptions}
                                        placeholder="Select value..."
                                        className="backcolorinput"
                                        onChange={handleValueChange}
                                        value={values?.cachingStatus}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* right columns */}
                        <div className='col-sm-6'>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">
                                    {dt('Widget Heading Alignment')} :
                                </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="widgetHeadingAlignLeft"
                                            name="widgetHeadingAlign"
                                            value={'left'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.widgetHeadingAlign === "left"}
                                        />
                                        <label className="form-check-label" htmlFor="dbYes">
                                           {dt('Left')} 
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="widgetHeadingAlignCenter"
                                            name="widgetHeadingAlign"
                                            value={'center'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.widgetHeadingAlign === "center"}
                                        />
                                        <label className="form-check-label" htmlFor="dbNo">
                                           {dt('Center')} 
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="widgetHeadingAlignRight"
                                            name="widgetHeadingAlign"
                                            value={'right'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.widgetHeadingAlign === "right"}
                                        />
                                        <label className="form-check-label" htmlFor="dbNo">
                                           {dt('Right')} 
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION DEVIDER widget purpose*/}
                    {/* <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                        <div className='col-sm-6'>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">
                                    Widget Purpose :
                                </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="widgetPurposeDownload"
                                            name="widgetPurpose"
                                            value={'Download'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.widgetPurpose === "Download"}
                                        />
                                        <label className="form-check-label" htmlFor="dbYes">
                                            Download
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="widgetPurposeHtml"
                                            name="widgetPurpose"
                                            value={'HTML'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.widgetPurpose === "HTML"}
                                        />
                                        <label className="form-check-label" htmlFor="dbNo">
                                            HTML
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* SECTION DEVIDER LIMIT and record required */}
                    {/* {radioValues?.widgetPurpose === "HTML" && */}
                        <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                            {/* //left columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-5 col-form-label pe-0">{dt('LIMIT')} : </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <InputField
                                            type="text"
                                            className="backcolorinput"
                                            placeholder="Enter value..."
                                            name='limit'
                                            id="limit"
                                            onChange={handleValueChange}
                                            value={values?.limit}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* right columns */}
                            <div className='col-sm-6'>

                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">
                                        {dt('Is Records Limited Line Required')} :
                                    </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isRecordLimitReqYes"
                                                name="isRecordLimitReq"
                                                value={'Yes'}
                                                onChange={handleRadioChange}
                                                checked={radioValues?.isRecordLimitReq === "Yes"}
                                            />
                                            <label className="form-check-label" htmlFor="dbYes">
                                               {dt('Yes')} 
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isRecordLimitReqNo"
                                                name="isRecordLimitReq"
                                                value={'No'}
                                                onChange={handleRadioChange}
                                                checked={radioValues?.isRecordLimitReq === "No"}
                                            />
                                            <label className="form-check-label" htmlFor="dbNo">
                                                {dt('No')}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    {/* } */}

                    {/* SECTION DEVIDER heading border margin */}
                    <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                        {/* //left columns */}
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label pe-0">{dt('Widget Heading Color')} : </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <InputField
                                        type="color"
                                        className="backcolorinput"
                                        placeholder="Enter value..."
                                        name='widgetHadingClr'
                                        id="widgetHadingClr"
                                        onChange={handleValueChange}
                                        value={values?.widgetHadingClr}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label pe-0">{dt('Widget Top Margin')} : </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <InputField
                                        type="text"
                                        className="backcolorinput"
                                        placeholder="Enter value..."
                                        name='widgetTopMargin'
                                        id="widgetTopMargin"
                                        onChange={handleValueChange}
                                        value={values?.widgetTopMargin}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* right columns */}
                        <div className='col-sm-6'>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">
                                    {dt('Widget Border Required')} :
                                </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="isWidgetBorderReq"
                                            id="isWidgetBorderReqYes"
                                            value={'Yes'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.isWidgetBorderReq === 'Yes'}
                                        />
                                        <label className="form-check-label" htmlFor="dbYes">
                                           {dt('Yes')} 
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="isWidgetBorderReq"
                                            id="isWidgetBorderReqNo"
                                            value={'No'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.isWidgetBorderReq === 'No'}
                                        />
                                        <label className="form-check-label" htmlFor="dbNo">
                                           {dt('No')} 
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            }

            {/* IF OTHER LINK SELECTED */}
            {radioValues?.widgetViewed === "Other_Link" &&
                <div className="table-responsive row p-2">
                    <table className="table table-borderless text-center mb-0">
                        <thead className="text-white">
                            <tr className='header-devider m-0'>
                                <th style={{ width: "40%" }}>{dt('Other Link Name')}</th>
                                <th style={{ width: "40%" }}>{dt('Other Link URL')}</th>
                                <th >
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleAddLinkRow()}
                                        style={{ padding: "0 4px" }}
                                    >
                                        <FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size='sm' />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherLinkData?.map((row, index) => (
                                <tr>
                                    <td>
                                        <InputField
                                            type="text"
                                            className="backcolorinput"
                                            name='otherLinkName'
                                            id={`otherLinkName-${index}`}
                                            value={row?.otherLinkName}
                                            onChange={(e) => handleInputLinkChange(index, 'otherLinkName', e.target.value)}
                                            errorMessage={!row?.otherLinkName && errors?.otherLinkNameErr}
                                        />
                                    </td>


                                    <td>
                                        <InputField
                                            type="text"
                                            className="backcolorinput"
                                            name='otherLinkURL'
                                            id={`otherLinkURL-${index}`}
                                            value={row?.otherLinkURL}
                                            onChange={(e) => handleInputLinkChange(index, 'otherLinkURL', e.target.value)}
                                            errorMessage={!row?.otherLinkURL && errors?.otherLinkURLErr}
                                        />
                                    </td>

                                    <td className='px-0'>
                                        {/* {procedureRows.length > 0 && ( */}
                                        <div>
                                            <button
                                                className="btn btn-outline-secondary btn-sm ms-1"
                                                onClick={() => handleRemoveLinkRow(index)}
                                                style={{ padding: "0 4px" }}
                                            >
                                                <FontAwesomeIcon icon={faMinus} className="dropdown-gear-icon" size='sm' />
                                            </button>
                                        </div>
                                        {/* )} */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

            {/* IF IFRAME SELECTED */}
            {radioValues?.widgetViewed === "Iframe" &&
                <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                    {/* //left columns */}
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Enter URL for Iframe')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type={'text'}
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='urlForIframe'
                                    id="urlForIframe"
                                    onChange={handleValueChange}
                                    value={values?.urlForIframe}
                                />
                            </div>
                        </div>
                    </div>
                    {/* right columns */}
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Is SSO Url')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isSsoUrl"
                                        id="isSsoUrlYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isSsoUrl === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                       {dt('Yes')} 
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isSsoUrl"
                                        id="isSsoUrlNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isSsoUrl === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt('No')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default AboutWidget

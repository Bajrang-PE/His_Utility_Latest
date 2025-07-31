import React, { useEffect, useState } from 'react'
import InputField from '../../commons/InputField'
import InputSelect from '../../commons/InputSelect'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { headingDisplayStyleOptions, isActionButtonReqOptions } from '../../../localData/DropDownData'

const TableDetails = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, setValues, parentWidget,dt } = props;

    const [rows, setRows] = useState([]);
    const [newRow, setNewRow] = useState({ modeForOpeningPopup: "", drillWidgetName: "", titleMsg: "", drillDownType: "", popupWidgetId: "" });

    useEffect(() => {
        if (values?.popUpDetails?.length > 0) {
            setRows(values?.popUpDetails)
        }
    }, [values?.popUpDetails])

    const [isEditing, setIsEditing] = useState(null);

    const handleInputChange = (field, e) => {
        console.log(e, 'e')
        if (e.target.name === 'popupWidgetId') {
            setNewRow({ ...newRow, [field]: e.target.value, ['drillWidgetName']: e.target.label })
        } else {
            setNewRow({ ...newRow, [field]: e.target.value });
        }
    };

    const handleAddRow = () => {
        if (isEditing !== null) {
            const updatedRows = [...rows];
            updatedRows[isEditing] = newRow;
            setRows(updatedRows);
            setValues({ ...values, ['popUpDetails']: updatedRows })
            setIsEditing(null);
        } else {
            let oldDt = values?.popUpDetails?.length > 0 ? values?.popUpDetails : [];
            setRows([...rows, newRow]);
            oldDt?.push(newRow)
            setValues({ ...values, ['popUpDetails']: oldDt })
        }
        setNewRow({ modeForOpeningPopup: "", drillWidgetName: "", titleMsg: "", drillDownType: "", popupWidgetId: "" });
    };

    const handleEditRow = (index) => {
        setIsEditing(index);
        setNewRow(rows[index]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        setValues({ ...values, ['popUpDetails']: updatedRows })
    };


    return (
        <>
            <b><h6 className='header-devider m-0'>{dt('Table Heading Related Details')}</h6></b>
            {/* SECTION DEVIDER table heading*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                           {dt('Is Table Heading Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTableHeadingReq"
                                    id="isTableHeadingReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTableHeadingReq === "Yes"}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTableHeadingReq"
                                    id="isTableHeadingReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTableHeadingReq === "No"}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('No')} 
                                </label>
                            </div>
                        </div>
                    </div>
                    {radioValues?.isTableHeadingReq === "Yes" &&
                        <>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">{dt('Heading Background Color')} : </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <InputField
                                        type="color"
                                        className="backcolorinput "
                                        placeholder="Enter value..."
                                        name='headingBgColor'
                                        id="headingBgColor"
                                        onChange={handleValueChange}
                                        value={values?.headingBgColor}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">{dt('Heading Display Style')} : </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <InputSelect
                                        className="backcolorinput "
                                        placeholder="select value..."
                                        name='headingDisplayStyle'
                                        id="headingDisplayStyle"
                                        options={headingDisplayStyleOptions}
                                        onChange={handleValueChange}
                                        value={values?.headingDisplayStyle}
                                    />
                                </div>
                            </div>
                        </>
                    }

                </div>

                {/* right columns */}
                {radioValues?.isTableHeadingReq === "Yes" &&
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Table Heading Alignment')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="tableHeadingAlignDType"
                                        name="tableHeadingAlign"
                                        value={'0'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.tableHeadingAlign === "0"}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt('As per Data Type')}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="tableHeadingAlignCenter"
                                        name="tableHeadingAlign"
                                        value={'1'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.tableHeadingAlign === "1"}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt('Center')}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Heading Font Color')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type="color"
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='headingFontColor'
                                    id="headingFontColor"
                                    onChange={handleValueChange}
                                    value={values?.headingFontColor}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Is First Row Heading')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isFirstRowHeading"
                                        id="isFirstRowHeadingYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isFirstRowHeading === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt('Yes')}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isFirstRowHeading"
                                        id="isFirstRowHeadingNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isFirstRowHeading === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt('No')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <b><h6 className='header-devider m-0'>{dt('Table - Pagination and Records')}</h6></b>
            {/* SECTION DEVIDER pagination and records*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Pagination Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isPaginationReq"
                                    id="isPaginationReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isPaginationReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isPaginationReq"
                                    id="isPaginationReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isPaginationReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                    {radioValues?.isPaginationReq === 'Yes' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Records per Page')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type="text"
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='recordsPerPage'
                                    id="recordsPerPage"
                                    onChange={handleValueChange}
                                    value={values?.recordsPerPage}
                                />
                            </div>
                        </div>
                    }
                    {radioValues?.isDataTblReq === 'Yes' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Is Heading Fixed')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isHeadingFixed"
                                        id="isHeadingFixedYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isHeadingFixed === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt('Yes')}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isHeadingFixed"
                                        id="isHeadingFixedNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isHeadingFixed === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                       {dt('No')} 
                                    </label>
                                </div>
                            </div>
                        </div>
                    }
                    {(radioValues?.isDataTblReq === 'Yes' && radioValues?.isHeadingFixed === 'Yes') &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Data Scroll Height')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type="text"
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='DataScrollHeight'
                                    id="DataScrollHeight"
                                    onChange={handleValueChange}
                                    value={values?.DataScrollHeight}
                                />
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                           {dt('Is Last row Total')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLastRowTotal"
                                    id="isLastRowTotalYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLastRowTotal === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                   {dt('Yes')} 
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLastRowTotal"
                                    id="isLastRowTotalNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLastRowTotal === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    {radioValues?.isDataTblReq === 'Yes' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Is Index Number Required')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isIndexNumReq"
                                        id="isIndexNumReqYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isIndexNumReq === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt('Yes')}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isIndexNumReq"
                                        id="isIndexNumReqNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isIndexNumReq === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt('No')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Search Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isSearchReq"
                                    id="isSearchReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isSearchReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                   {dt('Yes')} 
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isSearchReq"
                                    id="isSearchReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isSearchReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('No')} 
                                </label>
                            </div>
                        </div>
                    </div>
                    {radioValues?.isPaginationReq === 'Yes' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Page per Block')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type="text"
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='pagePerBlock'
                                    id="pagePerBlock"
                                    onChange={handleValueChange}
                                    value={values?.pagePerBlock}
                                />
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Card view(for Mobile)')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isCardViewMobile"
                                    id="isCardViewMobileYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isCardViewMobile === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isCardViewMobile"
                                    id="isCardViewMobileNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isCardViewMobile === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <b><h6 className='header-devider m-0'>{dt('Table - Parent and Widgets')}</h6></b>
            {/* SECTION DEVIDER parents and widgets*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Parent Widget')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='parentWidget'
                                id="parentWidget"
                                options={parentWidget}
                                onChange={handleValueChange}
                                value={values?.parentWidget}
                            />
                        </div>
                    </div>
                    {values?.parentWidget &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Is Hide Parent')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isHideParent"
                                        id="isHideParentYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isHideParent === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt('Yes')}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isHideParent"
                                        id="isHideParentNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isHideParent === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                       {dt('No')} 
                                    </label>
                                </div>
                            </div>
                        </div>
                    }
                    {radioValues?.isShowPrntHeadChild === 'Yes' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Column Nos. to Display')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type='text'
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='columnNoToDisplay'
                                    id="columnNoToDisplay"
                                    onChange={handleValueChange}
                                    value={values?.columnNoToDisplay}
                                />
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Left Column Nos. to be fixed')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='leftClmNoToFixed'
                                id="leftClmNoToFixed"
                                onChange={handleValueChange}
                                value={values?.leftClmNoToFixed}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Linked Widget')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <Select
                                id='linkedWidget'
                                name='linkedWidget'
                                options={parentWidget}
                                isMulti
                                placeholder="Select value..."
                                className="backcolorinput react-select-multi"
                                value={values?.linkedWidget}
                                onChange={(e) => setValues({ ...values, ['linkedWidget']: e })}
                            // isSearchable={true}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Show Parent Heading in Child')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isShowPrntHeadChild"
                                    id="isShowPrntHeadChildYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isShowPrntHeadChild === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isShowPrntHeadChild"
                                    id="isShowPrntHeadChildNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isShowPrntHeadChild === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('No')} 
                                </label>
                            </div>
                        </div>
                    </div>
                    {values?.parentWidget &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Is Row Clickable')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isRowClickable"
                                        id="isRowClickableYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isRowClickable === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt('Yes')}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isRowClickable"
                                        id="isRowClickableNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isRowClickable === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt('No')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    }
                    {radioValues?.isShowPrntHeadChild === 'Yes' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Show Parent Parameter details in Child')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isShowPrntParamsChild"
                                        id="isShowPrntParamsChildYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isShowPrntParamsChild === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt('Yes')}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isShowPrntParamsChild"
                                        id="isShowPrntParamsChildNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isShowPrntParamsChild === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt('No')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Right Column Nos. to be fixed')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='rightClmNoToFixed'
                                id="rightClmNoToFixed"
                                onChange={handleValueChange}
                                value={values?.rightClmNoToFixed}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Action Button Required')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='actionBtnReq'
                                id="actionBtnReq"
                                options={isActionButtonReqOptions}
                                onChange={handleValueChange}
                                value={values?.actionBtnReq}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <b><h6 className='header-devider mt-2'>{dt('Table - PDF')}</h6></b>
            {/* SECTION DEVIDER pdf*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Print PDF In')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="printPdfIn"
                                    id="printPdfInLandscape"
                                    value={'landscape'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.printPdfIn === 'landscape'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Landscape')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="printPdfIn"
                                    id="printPdfInPotrait"
                                    value={'Potrait'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.printPdfIn === 'Potrait'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('Potrait')} 
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('PDF Theme')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="pdfTheme"
                                    id="pdfThemeGrid"
                                    value={'grid'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.pdfTheme === 'grid'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Grid')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="pdfTheme"
                                    id="pdfThemeStriped"
                                    value={'striped'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.pdfTheme === 'striped'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('Striped')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="pdfTheme"
                                    id="pdfThemePlain"
                                    value={'plain'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.pdfTheme === 'plain'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('Plain')} 
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('PDF Table Header Bar Color')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='pdfTableHeadBarClr'
                                id="pdfTableHeadBarClr"
                                onChange={handleValueChange}
                                value={values?.pdfTableHeadBarClr}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Show Filter Details In PDF/Print')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="showFilterDtlsInPdf"
                                    id="showFilterDtlsInPdfYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.showFilterDtlsInPdf === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="showFilterDtlsInPdf"
                                    id="showFilterDtlsInPdfNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.showFilterDtlsInPdf === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Report Print Date Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isReportPrintDtReq"
                                    id="isReportPrintDtReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isReportPrintDtReq === 'Yes'}

                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                   {dt('Yes')} 
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isReportPrintDtReq"
                                    id="isReportPrintDtReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isReportPrintDtReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('No')} 
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Table Border Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTableBorderReq"
                                    id="isTableBorderReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTableBorderReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTableBorderReq"
                                    id="isTableBorderReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTableBorderReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('No')} 
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Positive Widget')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isPositiveWidget"
                                    id="isPositiveWidgetYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isPositiveWidget === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isPositiveWidget"
                                    id="isPositiveWidgetNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isPositiveWidget === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Popup Based On Data Click Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isPopupBasedReq"
                                    id="isPopupBasedReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isPopupBasedReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isPopupBasedReq"
                                    id="isPopupBasedReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isPopupBasedReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('PDF Table Font Size')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='pdfTableFontSize'
                                id="pdfTableFontSize"
                                onChange={handleValueChange}
                                value={values?.pdfTableFontSize}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                           {dt('Is PDF Header Required in all pages')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isPdfHeadReqAllPgs"
                                    id="isPdfHeadReqAllPgsYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isPdfHeadReqAllPgs === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                   {dt('Yes')} 
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isPdfHeadReqAllPgs"
                                    id="isPdfHeadReqAllPgsNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isPdfHeadReqAllPgs === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                   {dt('No')} 
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('PDF Table Heading Text Font Color')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='pdfTableHeadTxtFontClr'
                                id="pdfTableHeadTxtFontClr"
                                onChange={handleValueChange}
                                value={values?.pdfTableHeadTxtFontClr}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Report By jsPDF Plugin')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isReportByJsPdfPlug"
                                    id="isReportByJsPdfPlugYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isReportByJsPdfPlug === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isReportByJsPdfPlug"
                                    id="isReportByJsPdfPlugNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isReportByJsPdfPlug === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Global Header Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isGlobalHeaderReq"
                                    id="isGlobalHeaderReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isGlobalHeaderReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isGlobalHeaderReq"
                                    id="isGlobalHeaderReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isGlobalHeaderReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Group Column No.(commaseparated)')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='groupClmNoComma'
                                id="groupClmNoComma"
                                onChange={handleValueChange}
                                value={values?.groupClmNoComma}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Direct Download Button Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDirectDownloadBtn"
                                    id="isDirectDownloadBtnYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDirectDownloadBtn === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                   {dt('Yes')} 
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDirectDownloadBtn"
                                    id="isDirectDownloadBtnNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDirectDownloadBtn === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Tree Child Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTreeChildReq"
                                    id="isTreeChildReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTreeChildReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTreeChildReq"
                                    id="isTreeChildReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTreeChildReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <b><h6 className='header-devider m-0'>Table - Popup Details</h6></b> */}
            {radioValues?.isPopupBasedReq === 'Yes' &&
                <>
                    <b>{dt('Popup Details')}:-</b><br />
                    {/* SECTION DEVIDER parents and widgets*/}
                    <div className="table-responsive row p-1">
                        <table className="table table-borderless text-center mb-0">
                            <thead className="text-white">
                                <tr className='header-devider m-0'>
                                    <th style={{ width: "15%" }}>{dt('Mode No.')}</th>
                                    <th style={{ width: "25%" }}>{dt('Drill Down Type')}</th>
                                    <th style={{ width: "25%" }}>{dt('Widget')}</th>
                                    <th style={{ width: "15%" }}>{dt('Title Message')}</th>
                                    <th>{dt('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <InputField
                                            type="text"
                                            className="backcolorinput"
                                            name='modeForOpeningPopup'
                                            id='modeForOpeningPopup'
                                            onChange={(e) => handleInputChange("modeForOpeningPopup", e)}
                                            value={newRow?.modeForOpeningPopup}
                                        />
                                    </td>
                                    <td>
                                        <InputSelect
                                            // type="text"
                                            className="backcolorinput"
                                            name='drillDownType'
                                            id='drillDownType'
                                            options={[{ value: 'Widget', label: "Widget" }, { value: "Tab", label: "Tab" }]}
                                            onChange={(e) => handleInputChange("drillDownType", e)}
                                            value={newRow.drillDownType}
                                        />
                                    </td>
                                    <td>
                                        <InputSelect
                                            className="backcolorinput"
                                            id="popupWidgetId"
                                            name="popupWidgetId"
                                            options={parentWidget}
                                            onChange={(e) => handleInputChange("popupWidgetId", e)}
                                            value={newRow.popupWidgetId}
                                            placeholder={'Select Widget'}
                                        >
                                        </InputSelect>
                                    </td>
                                    <td>
                                        <InputField
                                            type="text"
                                            className="backcolorinput"
                                            name="titleMsg"
                                            id='titleMsg'
                                            onChange={(e) => handleInputChange("titleMsg", e)}
                                            value={newRow?.titleMsg}
                                        />
                                    </td>
                                    <td className='px-0 action-buttons'>
                                        <button className='btn btn-sm me-1 py-0 px-0' style={{ background: "#34495e", color: "white" }} onClick={()=>handleAddRow()}><FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size='sm' />{dt('Add')}</button>
                                    </td>
                                </tr>
                                {rows.map((row, index) => (
                                    <tr className='table-row-form text-start' key={index}>
                                        <td>{row.modeForOpeningPopup || "---"}</td>
                                        <td>{row.drillDownType || "---"}</td>
                                        <td>{row.drillWidgetName || "---"}</td>
                                        <td>{row.titleMsg || "---"}</td>
                                        <td className=''>
                                            <div className='text-center'>
                                                <button
                                                    className="btn btn-secondary btn-sm me-1 py-0 px-1"
                                                    onClick={() => handleEditRow(index)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} className="dropdown-gear-icon" size='xs' />
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm ms-1 py-0 px-1"
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
                </>
            }
            {radioValues?.isTreeChildReq === 'Yes' &&
                <>
                    <b><h6 className='header-devider m-0'>{dt('Table - Tree Child')}</h6></b>
                    {/* SECTION DEVIDER parents and widgets*/}
                    <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                        {/* //left columns */}
                        <div className='col-sm-6'>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">
                                    {dt('Tree Child Data By')} :
                                </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="treeChildDataBy"
                                            id="treeChildDataByQuery"
                                            value={'Query'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.treeChildDataBy === 'Query'}
                                        />
                                        <label className="form-check-label" htmlFor="dbYes">
                                           {dt('By Query')} 
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="treeChildDataBy"
                                            id="treeChildDataByProcedure"
                                            value={'Procedure'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.treeChildDataBy === 'Procedure'}
                                        />
                                        <label className="form-check-label" htmlFor="dbNo">
                                            {dt('By Procedure')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {radioValues?.dataDisplay === 'horizontal' &&
                                <>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label pe-0">
                                            {dt('Is Datatable Required')} :
                                        </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="isDataTblReqTree"
                                                    id="isDataTblReqTreeYes"
                                                    value={'Yes'}
                                                    onChange={handleRadioChange}
                                                    checked={radioValues?.isDataTblReqTree === 'Yes'}
                                                />
                                                <label className="form-check-label" htmlFor="dbYes">
                                                    {dt('Yes')}
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="isDataTblReqTree"
                                                    id="isDataTblReqTreeNo"
                                                    value={'No'}
                                                    onChange={handleRadioChange}
                                                    checked={radioValues?.isDataTblReqTree === 'No'}
                                                />
                                                <label className="form-check-label" htmlFor="dbNo">
                                                    {dt('No')}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {radioValues?.isDataTblReqTree === 'Yes' &&
                                        <div className="form-group row">
                                            <label className="col-sm-5 col-form-label pe-0">
                                                {dt('Is Pagination Required')} :
                                            </label>
                                            <div className="col-sm-7 ps-0 align-content-center">
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="isPaginationReqTree"
                                                        id="isPaginationReqTreeYes"
                                                        value={'Yes'}
                                                        onChange={handleRadioChange}
                                                        checked={radioValues?.isPaginationReqTree === 'Yes'}
                                                    />
                                                    <label className="form-check-label" htmlFor="dbYes">
                                                        {dt('Yes')}
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="isPaginationReqTree"
                                                        id="isPaginationReqTreeNo"
                                                        value={'No'}
                                                        onChange={handleRadioChange}
                                                        checked={radioValues?.isPaginationReqTree === 'No'}
                                                    />
                                                    <label className="form-check-label" htmlFor="dbNo">
                                                        {dt('No')}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </>
                            }

                            {radioValues?.treeChildDataBy === 'Query' &&
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">{dt('Query')} : </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <textarea
                                            className="form-control backcolorinput"
                                            placeholder="Enter value..."
                                            name="treeChildQuery"
                                            id='treeChildQuery'
                                            rows="2"
                                            onChange={handleValueChange}
                                            value={values?.treeChildQuery}
                                        ></textarea>
                                    </div>
                                </div>
                            }
                            {radioValues?.treeChildDataBy === 'Procedure' &&
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">{dt('Procedure Name')} : </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <InputField
                                            type='text'
                                            className="backcolorinput "
                                            placeholder="Enter value..."
                                            name='treeChildProcedure'
                                            id="treeChildProcedure"
                                            onChange={handleValueChange}
                                            value={values?.treeChildProcedure}
                                        />
                                    </div>
                                </div>
                            }

                        </div>
                        {/* //right columns */}
                        <div className='col-sm-6'>
                            <div className="form-group row">
                                <label className="col-sm-5 col-form-label pe-0">
                                    {dt('Data Display')} :
                                </label>
                                <div className="col-sm-7 ps-0 align-content-center">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="dataDisplay"
                                            id="dataDisplayHorizontal"
                                            value={'horizontal'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.dataDisplay === 'horizontal'}
                                        />
                                        <label className="form-check-label" htmlFor="dbYes">
                                            {dt('Horizontal')}
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="dataDisplay"
                                            id="dataDisplayVertical"
                                            value={'vertical'}
                                            onChange={handleRadioChange}
                                            checked={radioValues?.dataDisplay === 'vertical'}
                                        />
                                        <label className="form-check-label" htmlFor="dbNo">
                                           {dt('Vertical')} 
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {(radioValues?.dataDisplay === 'horizontal' && radioValues?.isDataTblReqTree === 'Yes') &&
                                <>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label pe-0">
                                            {dt('Is Search Required')} :
                                        </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="isSearchReqTree"
                                                    id="isSearchReqTreeYes"
                                                    value={'Yes'}
                                                    onChange={handleRadioChange}
                                                    checked={radioValues?.isSearchReqTree === 'Yes'}
                                                />
                                                <label className="form-check-label" htmlFor="dbYes">
                                                    {dt('Yes')}
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="isSearchReqTree"
                                                    id="isSearchReqTreeNo"
                                                    value={'No'}
                                                    onChange={handleRadioChange}
                                                    checked={radioValues?.isSearchReqTree === 'No'}
                                                />
                                                <label className="form-check-label" htmlFor="dbNo">
                                                    {dt('No')}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {radioValues?.isPaginationReqTree === 'Yes' &&
                                        <div className="form-group row">
                                            <label className="col-sm-5 col-form-label pe-0">{dt('Record Per Page')} : </label>
                                            <div className="col-sm-7 ps-0 align-content-center">
                                                <InputField
                                                    type='text'
                                                    className="backcolorinput "
                                                    placeholder="Enter value..."
                                                    name='recordsPerPageTreeCh'
                                                    id="recordsPerPageTreeCh"
                                                    onChange={handleValueChange}
                                                    value={values?.recordsPerPageTreeCh}
                                                />
                                            </div>
                                        </div>
                                    }
                                </>}
                        </div>
                    </div>
                </>
            }

        </>
    )
}

export default TableDetails

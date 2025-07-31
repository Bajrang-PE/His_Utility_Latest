import React, { useState } from 'react'
import InputSelect from '../../commons/InputSelect'
import InputField from '../../commons/InputField'
import { leftCaret, rightCaret } from '../../../utils/commonSVG'
import { iconType, tabDisplayOptions, tabShapeOptions, widgetRefreshTimeOptions } from '../../../localData/DropDownData'
import { ToastAlert } from '../../../utils/commonFunction'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleDown, faAngleDoubleUp, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

const TabDetails = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, availableOptions, setAvailableOptions, selectedOptions, setSelectedOptions, dt } = props;

    const [leftSelectedValues, setLeftSelectedValues] = useState([]);
    const [rightSelectedValues, setRightSelectedValues] = useState([]);

    const leftSelectEle = document.getElementById('leftRightSelect');
    const rightSelectEle = document.getElementById('leftRightSelect1');

    const [selectedIndex, setSelectedIndex] = useState(null);


    const handleLeftSelect = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setLeftSelectedValues(value);
        setRightSelectedValues([]);
    };

    const handleRightSelect = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setRightSelectedValues(value);
        setLeftSelectedValues([]);
        setSelectedIndex(e.target.selectedIndex);
    };

    //FUNCTION TO MOVE SELECTED VALUES RIGHT
    const moveRight = () => {
        if (leftSelectedValues?.length > 0) {

            const selected = availableOptions.filter(option => leftSelectedValues.includes(option.value?.toString()));
            const chkDuplicate = selectedOptions?.filter(option => leftSelectedValues?.includes(option.value?.toString()));

            if (chkDuplicate?.length > 0) {
                ToastAlert('Value Already Exist!', 'warning');
            } else {
                setSelectedOptions([...selectedOptions, ...selected]);
                setAvailableOptions(availableOptions.filter(option => !leftSelectedValues.includes(option.value.toString())));
                setLeftSelectedValues([]);
                leftSelectEle.value = null;
            }
        } else {
            ToastAlert('Please select a value!', 'warning');
        }
    };


    //FUNCTION TO MOVE SELECTED VALUES LEFT
    const moveLeft = () => {
        if (rightSelectedValues?.length > 0) {
            const selected = selectedOptions.filter(option => rightSelectedValues.includes(option.value.toString()));
            setAvailableOptions([...availableOptions, ...selected]);
            setSelectedOptions(selectedOptions.filter(option => !rightSelectedValues.includes(option.value.toString())));
            setRightSelectedValues([]);
            rightSelectEle.value = null;
            setSelectedIndex(null)
        } else {
            ToastAlert('Please select a value!', 'warning');
        }
    };

    const moveSingleUp = () => {
        if (selectedIndex > 0) {
            const updatedOptions = [...selectedOptions];
            [updatedOptions[selectedIndex - 1], updatedOptions[selectedIndex]] =
                [updatedOptions[selectedIndex], updatedOptions[selectedIndex - 1]];
            setSelectedOptions(updatedOptions);
            setSelectedIndex(selectedIndex - 1);
        }
    };

    // Move selected item down
    const moveSingleDown = () => {
        if (selectedIndex !== null && selectedIndex < selectedOptions.length - 1) {
            const updatedOptions = [...selectedOptions];
            [updatedOptions[selectedIndex], updatedOptions[selectedIndex + 1]] =
                [updatedOptions[selectedIndex + 1], updatedOptions[selectedIndex]];
            setSelectedOptions(updatedOptions);
            setSelectedIndex(selectedIndex + 1);
        }
    };

    // Move selected item to top
    const moveTop = () => {
        if (selectedIndex > 0) {
            const updatedOptions = [...selectedOptions];
            const [selectedItem] = updatedOptions.splice(selectedIndex, 1);
            updatedOptions.unshift(selectedItem);
            setSelectedOptions(updatedOptions);
            setSelectedIndex(0);
        }
    };

    // Move selected item to bottom
    const moveBottom = () => {
        if (selectedIndex !== null && selectedIndex < selectedOptions.length - 1) {
            const updatedOptions = [...selectedOptions];
            const [selectedItem] = updatedOptions.splice(selectedIndex, 1);
            updatedOptions.push(selectedItem);
            setSelectedOptions(updatedOptions);
            setSelectedIndex(updatedOptions.length - 1);
        }
    };

    return (
        <div>
            <b><h6 className='header-devider m-0'>{dt("Dashboard Master - Tab Details")}</h6></b>

            {/* SECTION DEVIDER*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 ">{dt("Tab Display Style")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="tabDisplayStyle"
                                name="tabDisplayStyle"
                                options={tabDisplayOptions}
                                className="backcolorinput"
                                value={values?.tabDisplayStyle}
                                onChange={handleValueChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 ">{dt("Time Interval")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="timeInterval"
                                name="timeInterval"
                                options={widgetRefreshTimeOptions}
                                className="backcolorinput"
                                value={values?.timeInterval}
                                onChange={handleValueChange}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 ">{dt("Tab Icon Type")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="tabIconType"
                                name="tabIconType"
                                options={iconType}
                                className="backcolorinput"
                                value={values?.tabIconType}
                                onChange={handleValueChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 ">{dt("Change Interval Time")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="changeIntervalTime"
                                name="changeIntervalTime"
                                options={widgetRefreshTimeOptions}
                                className="backcolorinput"
                                value={values?.changeIntervalTime}
                                onChange={handleValueChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION DEVIDER*/}
            {values?.tabDisplayStyle === 'TOP' &&
                <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                    {/* //left columns */}
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt("Is Top Tab Bar Visible")} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isTopBarVisible"
                                        id="isTopBarVisibleYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isTopBarVisible === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt("Yes")}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isTopBarVisible"
                                        id="isTopBarVisibleNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isTopBarVisible === 'No'}
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
            {values?.tabDisplayStyle === 'SIDE' &&
                <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                    {/* //left columns */}
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt("is Fixed Layout")} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isFixedLayout"
                                        id="isFixedLayoutYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isFixedLayout === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt("Yes")}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isFixedLayout"
                                        id="isFixedLayoutNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isFixedLayout === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt("No")}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label pe-0">{dt("Text Shadow Color")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type="color"
                                    className="backcolorinput"
                                    placeholder={dt("Enter value...")}
                                    name='textshadowColor'
                                    id="textshadowColor"
                                    onChange={handleValueChange}
                                    value={values?.textshadowColor}
                                />
                            </div>
                        </div>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label pe-0 ">{dt("Tab Background Color On hover")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type="color"
                                    className="backcolorinput"
                                    placeholder={dt("Enter value...")}
                                    name='tabBgColorOnHover'
                                    id="tabBgColorOnHover"
                                    onChange={handleValueChange}
                                    value={values?.tabBgColorOnHover}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt("Is Sidebar Collapse")} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isSidebarCollapse"
                                        id="isSidebarCollapseYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isSidebarCollapse === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt("Yes")}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isSidebarCollapse"
                                        id="isSidebarCollapseNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isSidebarCollapse === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt("No")}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label pe-0">{dt("Tab Font Color")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type="color"
                                    className="backcolorinput"
                                    placeholder={dt("Enter value...")}
                                    name='tabFontColor'
                                    id="tabFontColor"
                                    onChange={handleValueChange}
                                    value={values?.tabFontColor}
                                />
                            </div>
                        </div>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label pe-0 ">{dt("Tab Font Color On hover")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type="color"
                                    className="backcolorinput"
                                    placeholder={dt("Enter value...")}
                                    name='tabFontColorOnHover'
                                    id="tabFontColorOnHover"
                                    onChange={handleValueChange}
                                    value={values?.tabFontColorOnHover}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* SECTION DEVIDER*/}
            {values?.tabDisplayStyle === 'BIG_ICON' &&
                <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                    {/* //left columns */}
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0 ">{dt("Tab Menu Width (For Big Icon)")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputSelect
                                    id="tabMenuWidthBigIcon"
                                    name="tabMenuWidthBigIcon"
                                    options={[{ value: '2', label: "2" }, { value: '3', label: "3" }, { value: '4', label: "4" }, { value: '5', label: "5" }, { value: '6', label: "6" }]}
                                    className="backcolorinput"
                                    value={values?.tabMenuWidthBigIcon}
                                    onChange={handleValueChange}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0 ">{dt("Tab shapes (For Big Icon)")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputSelect
                                    id="tabShapesBigIcon"
                                    name="tabShapesBigIcon"
                                    placeholder={dt("Select value...")}
                                    options={tabShapeOptions}
                                    className="backcolorinput"
                                    value={values?.tabShapesBigIcon}
                                    onChange={handleValueChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label pe-0 ">{dt("Tab Menu Height (For Big Icon)")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type="text"
                                    className="backcolorinput"
                                    placeholder={dt("Enter value...")}
                                    name='tabMenuHeightBigIcon'
                                    id="tabMenuHeightBigIcon"
                                    onChange={handleValueChange}
                                    value={values?.tabMenuHeightBigIcon}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

            <b><h6 className='header-devider  my-1'>{dt("Tab Mapping Details")}</h6></b>


            <div className='d-flex justify-content-center mt-1 mb-2 role-theme'>
                <div className='' style={{ width: "30%" }}>
                    <b><h6 className='mb-2 text-center'>{dt('All Tabs')}</h6></b>
                    <select className="form-select form-select-sm backcolorinput" id='leftRightSelect' size="6" aria-label="size 4 select example" onChange={handleLeftSelect}>
                        {availableOptions?.map((opt, index) => (
                            <option value={opt.value} key={index}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className='align-self-center' style={{ marginLeft: "2%", marginRight: "2%" }}>

                    <div className='d-flex justify-content-center'>
                        <button type='button' className='btn btn-outline-secondary btn-sm m-1' disabled={availableOptions?.length > 0 ? false : true} onClick={() => moveRight()}>
                            <svg dangerouslySetInnerHTML={{ __html: rightCaret }} height={16} width={16} />
                        </button>

                    </div>

                    <div className='d-flex justify-content-center'>
                        <button type='button' className='btn btn-outline-secondary btn-sm m-1' disabled={selectedOptions?.length > 0 ? false : true} onClick={() => moveLeft()}>
                            <svg dangerouslySetInnerHTML={{ __html: leftCaret }} height={16} width={16} />
                        </button>
                    </div>
                </div>

                <div className='' style={{ width: "30%" }}>
                    <b><h6 className='mb-2 text-center'>{dt('Selected Dashboard Tabs')}</h6></b>
                    <select className="form-select form-select-sm backcolorinput" id='leftRightSelect1' size="6" aria-label="size 4 select example" onChange={handleRightSelect} sele>
                        {selectedOptions?.map((opt, index) => (
                            <option value={opt.value} key={index} selected={selectedIndex === index}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className='align-self-center' style={{ marginLeft: "2%", marginRight: "2%", marginTop: "auto" }}>
                    <div className='d-flex justify-content-center'>
                        <button type='button' className='btn btn-outline-secondary btn-sm mb-1' onClick={() => moveTop()} disabled={selectedIndex === 0 || selectedIndex === null} style={{ padding: "2px 8px" }}>
                            <FontAwesomeIcon icon={faAngleDoubleUp} className="dropdown-gear-icon" />
                        </button>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button type='button' className='btn btn-outline-secondary btn-sm mb-1' onClick={() => moveSingleUp()} disabled={selectedIndex === 0 || selectedIndex === null} style={{ padding: "2px 8px" }}>
                            <FontAwesomeIcon icon={faAngleUp} className="dropdown-gear-icon" />
                        </button>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button type='button' className='btn btn-outline-secondary btn-sm mb-1' onClick={() => moveSingleDown()} disabled={selectedIndex === null || selectedIndex === selectedOptions.length - 1} style={{ padding: "2px 8px" }}>
                            <FontAwesomeIcon icon={faAngleDown} className="dropdown-gear-icon" />
                        </button>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button type='button' className='btn btn-outline-secondary btn-sm mb-1' onClick={() => moveBottom()} disabled={selectedIndex === null || selectedIndex === selectedOptions.length - 1} style={{ padding: "2px 8px" }}>
                            <FontAwesomeIcon icon={faAngleDoubleDown} className="dropdown-gear-icon" />
                        </button>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default TabDetails

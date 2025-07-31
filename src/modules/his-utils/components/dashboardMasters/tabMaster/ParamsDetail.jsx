import React, { lazy, useEffect, useState } from 'react'
import { ToastAlert } from '../../../utils/commonFunction';
import { leftCaret, rightCaret } from '../../../utils/commonSVG';

import { parameterOptions } from '../../../localData/DropDownData';

const InputSelect = lazy(() => import('../../commons/InputSelect'));
const InputField = lazy(() => import('../../commons/InputField'));

const ParamsDetail = (props) => {
    const { availableOptions, setAvailableOptions, selectedOptions, setSelectedOptions, handleValueChange, values, pageName, dt } = props;

    const [leftSelectedValues, setLeftSelectedValues] = useState([]);
    const [rightSelectedValues, setRightSelectedValues] = useState([]);

    const leftSelectEle = document.getElementById('leftRightSelect');
    const rightSelectEle = document.getElementById('leftRightSelect1');


    const handleLeftSelect = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setLeftSelectedValues(value);
        setRightSelectedValues([]);
    };

    const handleRightSelect = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setRightSelectedValues(value);
        setLeftSelectedValues([]);
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
        } else {
            ToastAlert('Please select a value!', 'warning');
        }
    };

    return (
        <>
            <b><h6 className='header-devider m-0'>{dt('Parameter Details')}</h6></b>
            <div className='d-flex justify-content-center mt-1 mb-2 role-theme'>
                <div className='' style={{ width: "30%" }}>
                    <b><h6 className='mb-2 text-center'>{dt('Parameter Name')}</h6></b>
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
                    <b><h6 className='mb-2 text-center'>{dt('Selected Parameter Name')}</h6></b>
                    <select className="form-select form-select-sm backcolorinput" id='leftRightSelect1' size="6" aria-label="size 4 select example" onChange={handleRightSelect}>
                        {selectedOptions?.map((opt, index) => (
                            <option value={opt.value} key={index}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* SECTION DEVIDER parameter details*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    {selectedOptions?.length > 0 &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Parameter Options')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputSelect
                                    className="backcolorinput "
                                    // placeholder="Enter value..."
                                    name='parameterOption'
                                    id="parameterOption"
                                    options={parameterOptions}
                                    onChange={handleValueChange}
                                    value={values?.parameterOption}
                                />
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Parameter Combo Background Color')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='paraComboBgColor'
                                id="paraComboBgColor"
                                onChange={handleValueChange}
                                value={values?.paraComboBgColor}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Parameter Label Font Color')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='paraLabelFontColor'
                                id="paraLabelFontColor"
                                onChange={handleValueChange}
                                value={values?.paraLabelFontColor}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    {selectedOptions?.length > 0 &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{pageName === "tab" ? dt('Tab Load Options') : dt('Widget Load Options')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputSelect
                                    className="backcolorinput "
                                    // placeholder="Enter value..."
                                    name='loadOption'
                                    id="loadOption"
                                    options={[{ value: "ONWINDOWLOAD", label: "On Window Load" }, { value: "ONGOBUTTONCLICK", label: "On Go Button Click" }]}
                                    onChange={handleValueChange}
                                    value={values?.loadOption}
                                />
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Parameter Combo Font Color')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='paraComboFontColor'
                                id="paraComboFontColor"
                                onChange={handleValueChange}
                                value={values?.paraComboFontColor}
                            />
                        </div>
                    </div>
                    {pageName === 'tab' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Parameter Remarks')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <textarea
                                    className="form-control backcolorinput"
                                    placeholder="Enter value..."
                                    name="paraRemark"
                                    id='paraRemark'
                                    rows="2"
                                    onChange={handleValueChange}
                                    value={values?.paraRemark}
                                ></textarea>
                            </div>
                        </div>
                    }
                </div>
            </div>

        </>
    )
}

export default ParamsDetail

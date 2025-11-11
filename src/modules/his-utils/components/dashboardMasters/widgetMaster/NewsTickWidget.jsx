import React from 'react'
import InputField from '../../commons/InputField'
import InputSelect from '../../commons/InputSelect'
import { newsTimeIntervals } from '../../../localData/DropDownData';

const NewsTickWidget = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, setValues,errors,dt } = props;

    return (
        <div>
            <b><h6 className='header-devider mb-1'>{dt('News Ticker Details')}</h6></b>
            {/* SECTION DEVIDER */}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt('No. of News visible at a time')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type={'text'}
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='noOfNewsVisible'
                                id="noOfNewsVisible"
                                onChange={handleValueChange}
                                value={values?.noOfNewsVisible}
                                errorMessage={errors?.noOfNewsVisibleErr}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('News Speed')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                // placeholder="Enter value..."
                                name='newsSpeed'
                                id="newsSpeed"
                                options={[{ value: "normal", label: "Normal" }, { value: "slow", label: "Slow" }, { value: "fast", label: "Fast" }]}
                                onChange={handleValueChange}
                                value={values?.newsSpeed}
                            />
                        </div>
                    </div>

                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('News Interval')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='newsInterval'
                                id="newsInterval"
                                options={newsTimeIntervals}
                                onChange={handleValueChange}
                                value={values?.newsInterval}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default NewsTickWidget

import React from 'react'
import InputSelect from '../../commons/InputSelect'
import Select from 'react-select';
import InputField from '../../commons/InputField';
import { mapNameOptions } from '../../../localData/DropDownData';

const MapWidget = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, parentWidget, setValues, errors, dt } = props;

    return (
        <div>
            <b><h6 className='header-devider mb-1'>{dt('Map Details')}</h6></b>
            {/* SECTION DEVIDER */}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Map Name')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput"
                                // placeholder="Enter value..."
                                name='mapName'
                                id="mapName"
                                options={mapNameOptions}
                                onChange={handleValueChange}
                                value={values?.mapNameOptions}
                                errorMessage={errors?.mapNameErr}

                            />
                        </div>
                    </div>
                    {values?.parentWidgetMap &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Is Child Based On Primary Key')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isChildBasedPrimaryKey"
                                        id="isChildBasedPrimaryKeyYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isChildBasedPrimaryKey === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt('Yes')}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isChildBasedPrimaryKey"
                                        id="isChildBasedPrimaryKeyNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isChildBasedPrimaryKey === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt('No')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    {/* <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">Parent Widget : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='parentWidgetMap'
                                id="parentWidgetMap"
                                options={parentWidget}
                                onChange={handleValueChange}
                                value={values?.parentWidgetMap}

                            />
                        </div>
                    </div> */}

                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Parent Widget')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id='parentWidgetMap'
                                name='parentWidgetMap'
                                options={parentWidget}
                                placeholder="Select value..."
                                className="backcolorinput"
                                onChange={handleValueChange}
                                value={values?.parentWidgetMap}
                            // isClearable
                            // isSearchable={true}
                            />
                        </div>
                    </div>
                    {values?.parentWidgetMap &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt('Is Hide Parent')} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isHideParentMap"
                                        id="isHideParentMapYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isHideParentMap === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt('Yes')}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isHideParentMap"
                                        id="isHideParentMapNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isHideParentMap === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt('No')}
                                    </label>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* SECTION DEVIDER*/}
            <b><h6 className='header-devider mb-1'>{dt('Legend Details')}</h6></b>
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Increasing intensity of Green color shows')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type={'text'}
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='mapIncreasingIntensity'
                                id="mapIncreasingIntensity"
                                // options={[]}
                                onChange={handleValueChange}
                                value={values?.mapIncreasingIntensity}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MapWidget

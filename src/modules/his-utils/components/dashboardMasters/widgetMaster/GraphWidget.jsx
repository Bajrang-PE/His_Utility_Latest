import React from 'react'
import InputSelect from '../../commons/InputSelect'
import InputField from '../../commons/InputField'
import Select from 'react-select'
import { googleChartOptions, graphOptions, highchartGraphOptions, isActionButtonReqOptions } from '../../../localData/DropDownData'

const GraphWidget = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, setValues, parentWidget, errors, setErrors, dt } = props;

    return (
        <div>
            <b><h6 className='header-devider m-0'>{dt("Graph Master")}</h6></b>
            {/* SECTION DEVIDER graph plugin and color*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">
                            {dt("Display Graph Plugin Name Option")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDisplayGraphPlugin"
                                    id="isDisplayGraphPluginYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDisplayGraphPlugin === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDisplayGraphPlugin"
                                    id="isDisplayGraphPluginNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDisplayGraphPlugin === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                            {errors?.isDisplayGraphPluginErr &&
                                <div className="required-input">
                                    {errors?.isDisplayGraphPluginErr}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Default Graph Type")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                // placeholder="Enter value..."
                                name='defaultGraphType'
                                id="defaultGraphType"
                                options={values?.defaultPluginName === "googlechart" ? googleChartOptions : highchartGraphOptions}
                                onChange={handleValueChange}
                                value={values?.defaultGraphType}
                                errorMessage={errors?.defaultGraphTypeErr}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Default Plugin Name")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                // placeholder="Enter value..."
                                name='defaultPluginName'
                                id="defaultPluginName"
                                options={[{ value: "highchart", label: dt("High Charts") }, { value: "googlechart", label: dt("Google Charts") }]}
                                onChange={handleValueChange}
                                value={values?.defaultPluginName}
                                errorMessage={errors?.defaultPluginNameErr}
                            />
                        </div>
                    </div>
                    {values?.defaultGraphType === 'BAR_GRAPH' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">
                                {dt("Is Color By Point (graph color)")} :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isColorByPoint"
                                        id="isColorByPointYes"
                                        value={'Yes'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isColorByPoint === 'Yes'}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        {dt("Yes")}
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="isColorByPoint"
                                        id="isColorByPointNo"
                                        value={'No'}
                                        onChange={handleRadioChange}
                                        checked={radioValues?.isColorByPoint === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        {dt("No")}
                                    </label>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {/* SECTION DEVIDER graph rest all*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Graph Type")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <Select
                                id='graphTypes'
                                name='graphTypes'
                                options={values?.defaultPluginName === "googlechart" ? googleChartOptions : highchartGraphOptions}
                                isMulti
                                placeholder={dt("Select value...")}
                                className="backcolorinput react-select-multi"
                                value={values?.graphTypes}
                                onChange={(e) => {
                                    setValues({ ...values, ['graphTypes']: e });
                                    setErrors(prev => ({ ...prev, 'graphTypesErr': "" }));
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Color For Bars")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='colorsForBars'
                                id="colorsForBars"
                                onChange={handleValueChange}
                                value={values?.colorsForBars}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Graph Bottom Margin")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='graphBottomMargin'
                                id="graphBottomMargin"
                                onChange={handleValueChange}
                                value={values?.graphBottomMargin}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Graph Background Start Color")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='graphBgStartColor'
                                id="graphBgStartColor"
                                onChange={handleValueChange}
                                value={values?.graphBgStartColor}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Graph Font Color")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='graphFontColor'
                                id="graphFontColor"
                                onChange={handleValueChange}
                                value={values?.graphFontColor}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Graph Type Background Color")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='graphTypeBgColor'
                                id="graphTypeBgColor"
                                onChange={handleValueChange}
                                value={values?.graphTypeBgColor}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">
                            {dt("Is Graph Scrollbar Required")}:
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isGraphScrollBarReq"
                                    id="isGraphScrollBarReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isGraphScrollBarReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isGraphScrollBarReq"
                                    id="isGraphScrollBarReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isGraphScrollBarReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                            {errors?.isGraphScrollBarReqErr &&
                                <div className="required-input">
                                    {errors?.isGraphScrollBarReqErr}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Column Name for Line graph")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='clmNameForLineGraph'
                                id="clmNameForLineGraph"
                                onChange={handleValueChange}
                                value={values?.clmNameForLineGraph}
                                errorMessage={errors?.clmNameForLineGraphErr}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Graph Height")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='graphHeight'
                                id="graphHeight"
                                onChange={handleValueChange}
                                value={values?.graphHeight}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Show Legend On Export")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isShowLegendOnExport"
                                    id="isShowLegendOnExportYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isShowLegendOnExport === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isShowLegendOnExport"
                                    id="isShowLegendOnExportNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isShowLegendOnExport === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Graph Background End Color")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='graphBgEndColor'
                                id="graphBgEndColor"
                                onChange={handleValueChange}
                                value={values?.graphBgEndColor}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">
                            {dt("Is Full Label Required")}:
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isFullLabelReq"
                                    id="isFullLabelReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isFullLabelReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isFullLabelReq"
                                    id="isFullLabelReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isFullLabelReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                            {errors?.isFullLabelReqErr &&
                                <div className="required-input">
                                    {errors?.isFullLabelReqErr}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Graph Type Font Color")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='color'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='graphTypeFontColor'
                                id="graphTypeFontColor"
                                onChange={handleValueChange}
                                value={values?.graphTypeFontColor}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("label rotation")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='labelRotation'
                                id="labelRotation"
                                onChange={handleValueChange}
                                value={values?.labelRotation}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <b><h6 className='header-devider m-0'>{dt("Graph Parameters")}</h6></b>
            {/* SECTION DEVIDER graph params legend label 3d*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">
                            {dt("Show Legend")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isShowLegend"
                                    id="isShowLegendYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isShowLegend === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isShowLegend"
                                    id="isShowLegendNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isShowLegend === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                            {errors?.isShowLegendErr &&
                                <div className="required-input">
                                    {errors?.isShowLegendErr}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">
                            {dt("Is 3D")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isThree3D"
                                    id="isThree3DYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isThree3D === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isThree3D"
                                    id="isThree3DNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isThree3D === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                            {errors?.isThree3DErr &&
                                <div className="required-input">
                                    {errors?.isThree3DErr}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">
                            {dt("Data Labels")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDataLabels"
                                    id="isDataLabelsYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDataLabels === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDataLabels"
                                    id="isDataLabelsNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDataLabels === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                            {errors?.isDataLabelsErr &&
                                <div className="required-input">
                                    {errors?.isDataLabelsErr}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION DEVIDER graph params rest all*/}
            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    {radioValues?.isThree3D === 'Yes' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Alpha")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type='text'
                                    className="backcolorinput "
                                    placeholder={dt("Enter value...")}
                                    name='alphaGraph3D'
                                    id="alphaGraph3D"
                                    onChange={handleValueChange}
                                    value={values?.alphaGraph3D}
                                    errorMessage={errors?.alphaGraph3DErr}
                                />
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt("X-axis Label")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='xAxisLabel'
                                id="xAxisLabel"
                                onChange={handleValueChange}
                                value={values?.xAxisLabel}
                                errorMessage={errors?.xAxisLabelErr}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("X-axis Font Size")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='xAxisFontSize'
                                id="xAxisFontSize"
                                onChange={handleValueChange}
                                value={values?.xAxisFontSize}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Annotation Font Size")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='annotationFontSize'
                                id="annotationFontSize"
                                onChange={handleValueChange}
                                value={values?.annotationFontSize}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Parent Widget")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='parentWidgetGraph'
                                id="parentWidgetGraph"
                                options={parentWidget}
                                onChange={handleValueChange}
                                value={values?.parentWidgetGraph}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Is Direct Download Button Required")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDirectDownloadBtnGraph"
                                    id="isDirectDownloadBtnGraphYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDirectDownloadBtnGraph === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDirectDownloadBtnGraph"
                                    id="isDirectDownloadBtnGraphNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDirectDownloadBtnGraph === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                        </div>
                    </div>
                    {values?.parentWidgetGraph &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0 required-label">
                                {dt("Is Hide Parent")} :
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
                                        {dt("Yes")}
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
                                        {dt("No")}
                                    </label>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    {radioValues?.isThree3D === 'Yes' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Beta")} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type='text'
                                    className="backcolorinput "
                                    placeholder={dt("Enter value...")}
                                    name='betaGraph3D'
                                    id="betaGraph3D"
                                    onChange={handleValueChange}
                                    value={values?.betaGraph3D}
                                    errorMessage={errors?.betaGraph3DErr}
                                />
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Y-axis Label")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='yAxisLabel'
                                id="yAxisLabel"
                                onChange={handleValueChange}
                                value={values?.yAxisLabel}
                                errorMessage={errors?.yAxisLabelErr}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Y-axis Font Size")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                className="backcolorinput "
                                placeholder={dt("Enter value...")}
                                name='yAxisFontSize'
                                id="yAxisFontSize"
                                onChange={handleValueChange}
                                value={values?.yAxisFontSize}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Show Parent Heading in Child")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isShowPrntHeadChildGraph"
                                    id="isShowPrntHeadChildGraphYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isShowPrntHeadChildGraph === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isShowPrntHeadChildGraph"
                                    id="isShowPrntHeadChildGraphNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isShowPrntHeadChildGraph === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Is Action Button Required")} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                // placeholder="Select value..."
                                name='isActionBtnReqGraph'
                                id="isActionBtnReqGraph"
                                options={isActionButtonReqOptions}
                                onChange={handleValueChange}
                                value={values?.isActionBtnReqGraph}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Is First Column Graph Heading")} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isFirstClmGraphHeading"
                                    id="isFirstClmGraphHeadingYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isFirstClmGraphHeading === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isFirstClmGraphHeading"
                                    id="isFirstClmGraphHeadingNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isFirstClmGraphHeading === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GraphWidget

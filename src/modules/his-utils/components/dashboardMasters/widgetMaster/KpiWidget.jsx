import React, { useEffect, useState } from 'react'
import InputField from '../../commons/InputField'
import InputSelect from '../../commons/InputSelect'
import { iconImageOptions, iconType, kpiBoxClickOptions, kpiTypes } from '../../../localData/DropDownData';
import * as FaIcons from "react-icons/fa";
import IconPicker from '../../commons/IconPicker';


const KpiWidget = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, setValues, errors, tabDrpData, widgetDrpData, dt } = props;
    const [tabIcon, setTabIcon] = useState('');
    const SelectedIconComponent = tabIcon ? FaIcons[tabIcon] : '';

    useEffect(() => {
        if (values?.iconName !== '') {
            setTabIcon(values?.iconName);
        } else {
            setTabIcon('');
        }
    }, [values?.iconName])

    const classType = {
        "0": "kpi-preview-full-icon",
        "isWidgetForCustomDesign": "kpi-preview-right-icon",
        "isWidgetForCustomDesignLeft": "kpi-preview-left-icon",
        "isKpiACircle": "kpi-preview-circle"
    }[values?.kpiType];

    const boxStyle = {
        backgroundColor: values?.kpiDefaultBgColor,
        borderTop: `${values?.kpiBorderWidth}px solid ${values?.kpiBorderColor}`,
        borderBottom: `${values?.kpiBorderWidth}px solid ${values?.kpiBorderColor}`,
        borderLeft: values?.kpiType === "isWidgetForCustomDesignLeft" ? `20px solid ${values?.kpiBorderColor}` : `${values?.kpiBorderWidth}px solid ${values?.kpiBorderColor}`,
        borderRight: values?.kpiType === "isWidgetForCustomDesign" ? `20px solid ${values?.kpiBorderColor}` : `${values?.kpiBorderWidth}px solid ${values?.kpiBorderColor}`,
        borderRadius: "8px",
        color: values?.kpiDefaultFontColor,
        boxShadow: radioValues?.isWidgetShadowReq === 'Yes' ? "0 4px 8px rgba(0,0,0,0.3)" : "none",
    };


    return (
        <div>
            <b><h6 className='header-devider m-0'>{dt('KPI Details')}</h6></b>
            {/* SECTION DEVIDER graph plugin and color*/}

            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt('KPI TYPE')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                // placeholder="Enter value..."
                                name='kpiType'
                                id="kpiType"
                                options={kpiTypes}
                                onChange={handleValueChange}
                                value={values?.kpiType}
                                errorMessage={errors?.kpiTypeErr}
                            />
                        </div>
                    </div>
                    {values?.kpiType !== 'isKpiACircle' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('KPI Icon Type')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputSelect
                                    className="backcolorinput "
                                    // placeholder="Enter value..."
                                    name='kpiIconType'
                                    id="kpiIconType"
                                    options={iconType}
                                    onChange={handleValueChange}
                                    value={values?.kpiIconType}
                                    errorMessage={errors?.kpiIconTypeErr}

                                />
                            </div>
                        </div>
                    }
                </div>
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('KPI Border Width (In Pixels) and Color')} : </label>
                        <div className="col-sm-3 ps-0 align-content-center">
                            <InputField
                                type={'text'}
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='kpiBorderWidth'
                                id="kpiBorderWidth"
                                onChange={handleValueChange}
                                value={values?.kpiBorderWidth}
                            />
                        </div>
                        <div className="col-sm-4 ps-0 align-content-center">
                            <InputField
                                type={'color'}
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='kpiBorderColor'
                                id="kpiBorderColor"
                                onChange={handleValueChange}
                                value={values?.kpiBorderColor}
                            />
                        </div>
                    </div>
                    {(values?.kpiIconType !== 'NOICON' && values?.kpiType !== 'isKpiACircle') &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Tab Icon Image')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                {values?.kpiIconType === 'IMAGE' &&
                                    <InputSelect
                                        className="backcolorinput "
                                        placeholder="Select Image"
                                        name='kpiTabIconImage'
                                        id="kpiTabIconImage"
                                        options={iconImageOptions}
                                        onChange={handleValueChange}
                                        value={values?.kpiTabIconImage}
                                    />
                                }
                                {values?.kpiIconType === 'FONT_ICON' &&
                                    <IconPicker setTabIcon={setTabIcon} tabIcon={tabIcon} setValues={setValues} values={values} />
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>


            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>

                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">{dt('Default Background Color')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type={'color'}
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='kpiDefaultBgColor'
                                id="kpiDefaultBgColor"
                                onChange={handleValueChange}
                                value={values?.kpiDefaultBgColor}
                                errorMessage={errors?.kpiDefaultBgColorErr}

                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Default hover Background')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type={'color'}
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='kpiDefaultHoverBg'
                                id="kpiDefaultHoverBg"
                                onChange={handleValueChange}
                                value={values?.kpiDefaultHoverBg}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Is Widget Shadow Required')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isWidgetShadowReq"
                                    id="isWidgetShadowReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isWidgetShadowReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isWidgetShadowReq"
                                    id="isWidgetShadowReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isWidgetShadowReq === 'No'}
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
                        <label className="col-sm-5 col-form-label pe-0">{dt('Default Font Color')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type={'color'}
                                className="backcolorinput "
                                placeholder="Enter value..."
                                name='kpiDefaultFontColor'
                                id="kpiDefaultFontColor"
                                onChange={handleValueChange}
                                value={values?.kpiDefaultFontColor}
                            />
                        </div>
                    </div>
                    {values?.kpiType !== 'isKpiACircle' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Icon Color')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type={'color'}
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='kpiIconColor'
                                    id="kpiIconColor"
                                    onChange={handleValueChange}
                                    value={values?.kpiIconColor}
                                />
                            </div>
                        </div>
                    }
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt('Download data from KPI')} :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDownloadDataFromKpi"
                                    id="isDownloadDataFromKpiYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDownloadDataFromKpi === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt('Yes')}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isDownloadDataFromKpi"
                                    id="isDownloadDataFromKpiNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isDownloadDataFromKpi === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt('No')}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('KPI Box click Options')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                className="backcolorinput "
                                // placeholder="Enter value..."
                                name='kpiBoxClickOptions'
                                id="kpiBoxClickOptions"
                                options={kpiBoxClickOptions}
                                onChange={handleValueChange}
                                value={values?.kpiBoxClickOptions}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    {values?.kpiBoxClickOptions !== '0' &&
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{(values?.kpiTabOpenOnClick !== '0' && values?.kpiTabOpenOnClick) ? dt("Tab open on click") : (values?.kpiWidgetOpenOnClick !== '0' && values?.kpiWidgetOpenOnClick) ? dt('Widget open on click') : dt('Dashboard open on click')}  : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                {(values?.kpiBoxClickOptions === 'showTab') &&
                                    <InputSelect
                                        className="backcolorinput "
                                        placeholder="No Tabs"
                                        name='kpiTabOpenOnClick'
                                        id="kpiTabOpenOnClick"
                                        options={tabDrpData}
                                        onChange={handleValueChange}
                                        value={values?.kpiTabOpenOnClick}
                                    />}
                                {(values?.kpiBoxClickOptions === 'showWidget') &&
                                    <InputSelect
                                        className="backcolorinput "
                                        placeholder="No Widget"
                                        name='kpiWidgetOpenOnClick'
                                        id="kpiWidgetOpenOnClick"
                                        options={widgetDrpData}
                                        onChange={handleValueChange}
                                        value={values?.kpiWidgetOpenOnClick}
                                    />}
                                {(values?.kpiBoxClickOptions === 'showDashboard' ) &&
                                    <InputSelect
                                        className="backcolorinput "
                                        placeholder="No Dashboard"
                                        name='kpiDashboardOpenOnClick'
                                        id="kpiDashboardOpenOnClick"
                                        options={[]}
                                        onChange={handleValueChange}
                                        value={values?.kpiDashboardOpenOnClick}
                                    />}
                            </div>
                        </div>
                    }
                </div>
            </div>


            {values?.kpiType !== 'isKpiACircle' &&
                <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                    {/* //left columns */}
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Tab link name')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type={'text'}
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='kpiTabLinkName'
                                    id="kpiTabLinkName"
                                    onChange={handleValueChange}
                                    value={values?.kpiTabLinkName}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('KPI link color')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type={'color'}
                                    className="backcolorinput"
                                    placeholder="Enter value..."
                                    name='kpiLinkColor'
                                    id="kpiLinkColor"
                                    onChange={handleValueChange}
                                    value={values?.kpiLinkColor}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('Widget link name')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type={'text'}
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='kpiWidgetLinkName'
                                    id="kpiWidgetLinkName"
                                    onChange={handleValueChange}
                                    value={values?.kpiWidgetLinkName}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label pe-0">{dt('KPI link Font color')} : </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <InputField
                                    type={'color'}
                                    className="backcolorinput "
                                    placeholder="Enter value..."
                                    name='kpiLinkFontColor'
                                    id="kpiLinkFontColor"
                                    onChange={handleValueChange}
                                    value={values?.kpiLinkFontColor}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* <KpiPreview values={values} /> */}
            <div className='row role-theme user-form'>
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Kpi Preview')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div
                                className={`kpi-preview-kpi-box ${classType}`}
                                style={boxStyle}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = values?.kpiDefaultHoverBg)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = values?.kpiDefaultBgColor)}
                            >
                                <span className="kpi-preview-kpi-text">{'KPI TEXT'}</span>
                                {(tabIcon && SelectedIconComponent) && (
                                    <span className="kpi-preview-kpi-icon" style={{ color: values?.kpiIconColor }}>
                                        <SelectedIconComponent />
                                    </span>

                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KpiWidget

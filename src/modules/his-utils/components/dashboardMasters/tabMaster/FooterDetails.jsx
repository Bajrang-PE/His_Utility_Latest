import React from 'react'
import InputField from '../../commons/InputField'
import InputSelect from '../../commons/InputSelect'
import { parameterAlignment } from '../../../localData/DropDownData';

const FooterDetails = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values,dt } = props;
    return (
        <>

            <b><h6 className='header-devider'>{dt("Footer Details")}</h6></b>

            {/* SECTION DEVIDER */}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Footer Alignment : ")}</label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="footerAlignment"
                                name="footerAlignment"
                                placeholder={dt("Select value...")}
                                options={parameterAlignment}
                                className="backcolorinput"
                                value={values?.footerAlignment}
                                onChange={handleValueChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Is Legend Collapes :")}
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLegendCollapes"
                                    id="isLegendCollapesYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLegendCollapes === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLegendCollapes"
                                    id="isLegendCollapesNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLegendCollapes === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Footer Query : ")}</label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <textarea
                                className="form-control backcolorinput"
                                placeholder={dt("Enter value...")}
                                name="footerQuery"
                                id='footerQuery'
                                rows="2"
                                onChange={handleValueChange}
                                value={values?.footerQuery}
                            ></textarea>
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Is Marquee Required :")}
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isMarqueeReq"
                                    id="isMarqueeReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isMarqueeReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isMarqueeReq"
                                    id="isMarqueeReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isMarqueeReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            {dt("Is Legend Border Required :")}
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLegendBorderReq"
                                    id="isLegendBorderReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLegendBorderReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    {dt("Yes")}
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLegendBorderReq"
                                    id="isLegendBorderReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLegendBorderReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    {dt("No")}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Footer Text : ")}</label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <textarea
                                className="form-control backcolorinput"
                                placeholder={dt("Enter value...")}
                                name="footerText"
                                id='footerText'
                                rows="2"
                                onChange={handleValueChange}
                                value={values?.footerText}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <b>{dt("Footer by WebService Details:")}</b>
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Webservice Reference Name : ")}</label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="webRefName"
                                name="webRefName"
                                placeholder={dt("Select value...")}
                                options={[{ value: '1', label: dt("Localhost") }]}
                                className="backcolorinput"
                                value={values?.webRefName}
                                onChange={handleValueChange}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt("Webservice Name : ")}</label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                id="webServiceName"
                                name="webServiceName"
                                placeholder={dt("Enter ")}
                                className="backcolorinput"
                                onChange={handleValueChange}
                                value={values?.webServiceName}
                            />
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default FooterDetails

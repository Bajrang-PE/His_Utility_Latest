import React from 'react'
import InputSelect from '../../commons/InputSelect'
import InputField from '../../commons/InputField'

const FooterDetails = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values,dt } = props;
    return (
        <>
            {/* MAIN DEVIDER FOR JNDI */}
            <b><h6 className='header-devider'>{dt('Footer Details')}</h6></b>

            {/* SECTION DEVIDER jndi and time*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Last Updated Query')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <textarea
                                className="form-control backcolorinput"
                                placeholder="Enter value..."
                                name="lastUpdatedQuery"
                                id='lastUpdatedQuery'
                                rows="2"
                                onChange={handleValueChange}
                                value={values?.lastUpdatedQuery}
                            ></textarea>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Custom Message When Data not Available')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                id="customMsgForNoData"
                                name="customMsgForNoData"
                                placeholder="Enter "
                                className="backcolorinput"
                                onChange={handleValueChange}
                                value={values?.customMsgForNoData}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('')}Footer Text : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <textarea
                                className="form-control backcolorinput"
                                placeholder="Enter value..."
                                name="FooterText"
                                id='FooterText'
                                rows="2"
                                onChange={handleValueChange}
                                value={values?.FooterText}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FooterDetails

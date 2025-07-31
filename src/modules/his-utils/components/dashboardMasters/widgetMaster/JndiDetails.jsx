import React, { useContext } from 'react'
import { timeOutOptions } from '../../../localData/DropDownData'
import InputSelect from '../../commons/InputSelect'
import { HISContext } from '../../../contextApi/HISContext';

const JndiDetails = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values,dt } = props;
    const {jndiServerDrpData} = useContext(HISContext)

    return (
        <>
            {/* MAIN DEVIDER FOR JNDI */}
            <b><h6 className='header-devider'>{dt('JNDI Details')}</h6></b>

            {/* SECTION DEVIDER jndi and time*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('JNDI For Saving Data')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="jndiSavingData"
                                name="jndiSavingData"
                                placeholder="Select"
                                options={jndiServerDrpData}
                                className="backcolorinput"
                                onChange={handleValueChange}
                                value={values?.jndiSavingData}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">{dt('Statement Time Out')} : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="stmtTimeOut"
                                name="stmtTimeOut"
                                placeholder="Select "
                                options={timeOutOptions}
                                className="backcolorinput"
                                onChange={handleValueChange}
                                value={values?.stmtTimeOut}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JndiDetails

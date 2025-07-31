import { faAdd, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import InputSelect from '../../commons/InputSelect';
import InputField from '../../commons/InputField';
import { parameterWidth } from '../../../localData/DropDownData';

const WidgetMapping = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, widgetDrpData, setValues, rows, setRows, errors, setErrors, dt } = props;

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
        setValues({ ...values, ['widgetMappingDetail']: updatedRows })
    };

    const handleAddRow = (name) => {
        if (rows?.length > 0 && !rows[rows?.length - 1]?.displayOrder) {
            setErrors(prev => ({ ...prev, 'displayOrderErr': "required" }));
        } else if (rows?.length > 0 && !rows[rows?.length - 1]?.widgetWidth) {
            setErrors(prev => ({ ...prev, 'widgetWidthErr': "required" }));
        } else if (rows?.length > 0 && !rows[rows?.length - 1]?.widgetHeight) {
            setErrors(prev => ({ ...prev, 'widgetHeightErr': "required" }));
        } else {
            setRows([...rows, { rptId: "", displayOrder: "", widgetWidth: "", widgetHeight: "0", widgetColor: "", widgetDisplay: "", sectionId: "1", animation: "" }]);
            setErrors(prev => ({ ...prev, 'widgetHeightErr': "", 'widgetWidthErr': "", "displayOrderErr": "" }));
        }
    };

    const handleRemoveRow = (index, name) => {
        if (name === "query") {
            const updatedRows = rows.filter((_, i) => i !== index);
            setRows(updatedRows);
            setValues({ ...values, ['widgetMappingDetail']: updatedRows })
        }
    };

    useEffect(() => {
        if (values?.widgetMappingDetail?.length > 0) {
            setRows(values?.widgetMappingDetail);
        }
    }, [values?.widgetMappingDetail])


    return (
        <>
            <b><h6 className='header-devider my-1'>{dt('Widget Mapping Details')}</h6></b>

            <div className="table-responsive row my-1 mx-0">
                <table className="table table-borderless text-center mb-0">
                    <thead className="text-white">
                        <tr className='header-devider m-0   rounded-2'>
                            <th style={{ width: "20%" }}>{dt('Widget Name')}</th>
                            <th style={{ width: "10%" }}>{dt('Display Order')}</th>
                            <th style={{ width: "15%" }}>{dt('Widget Width')}</th>
                            <th style={{ width: "20%" }}>{dt('Widget Height(px)')}</th>
                            <th style={{ width: "15%" }}>{dt('Widget Color')}</th>
                            <th style={{ width: "15%" }}>{dt('Widget Display')}</th>
                            <th >
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleAddRow()}
                                    style={{ padding: "0 4px" }}
                                >
                                    <FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size='sm' />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <InputSelect
                                        id={`widgetName-${index}`}
                                        name="widgetName"
                                        placeholder="Select widget..."
                                        options={widgetDrpData}
                                        className="backcolorinput"
                                        value={row.rptId}
                                        onChange={(e) => handleInputChange(index, 'rptId', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <InputField
                                        type="text"
                                        className="backcolorinput"
                                        name='DisplayOrder'
                                        id={`DisplayOrder-${index}`}
                                        value={row.displayOrder}
                                        onChange={(e) => handleInputChange(index, 'displayOrder', e.target.value)}
                                    />
                                    {(errors?.displayOrderErr && !row?.displayOrder) &&
                                        <div className="required-input">
                                            {errors?.displayOrderErr}
                                        </div>
                                    }
                                </td>
                                <td>
                                    <InputSelect
                                        id={`widgetWidth-${index}`}
                                        name="widgetWidth"
                                        placeholder="Select value..."
                                        options={parameterWidth}
                                        className="backcolorinput"
                                        value={row.widgetWidth}
                                        onChange={(e) => handleInputChange(index, 'widgetWidth', e.target.value)}
                                    />
                                    {(errors?.widgetWidthErr && !row?.widgetWidth) &&
                                        <div className="required-input">
                                            {errors?.widgetWidthErr}
                                        </div>
                                    }
                                </td>
                                <td>
                                    <InputField
                                        type="text"
                                        className="backcolorinput"
                                        name='widgetHeight'
                                        id={`widgetHeight-${index}`}
                                        value={row.widgetHeight}
                                        onChange={(e) => handleInputChange(index, 'widgetHeight', e.target.value)}
                                    />
                                    {(errors?.widgetHeightErr && !row?.widgetHeight) &&
                                        <div className="required-input">
                                            {errors?.widgetHeightErr}
                                        </div>
                                    }
                                </td>
                                <td>
                                    <InputSelect
                                        id={`widgetColor-${index}`}
                                        name="widgetColor"
                                        options={[{ value: 1, label: "Red" }, { value: 0, label: "Blue" }]}
                                        className="backcolorinput"
                                        value={row.widgetColor}
                                        onChange={(e) => handleInputChange(index, 'widgetColor', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <InputSelect
                                        id={`widgetDisplay-${index}`}
                                        name="widgetDisplay"
                                        options={[{ value: 1, label: "OnLoad" }, { value: 0, label: "OnClick" }]}
                                        className="backcolorinput"
                                        value={row.widgetDisplay}
                                        onChange={(e) => handleInputChange(index, 'widgetDisplay', e.target.value)}
                                    />
                                </td>

                                <td className='px-0'>
                                    {/* {rows.length > 1 && ( */}
                                    <div>
                                        <button
                                            className="btn btn-outline-secondary btn-sm ms-1"
                                            onClick={() => handleRemoveRow(index, "query")}
                                            style={{ padding: "0 4px" }}
                                        >
                                            <FontAwesomeIcon icon={faMinus} className="dropdown-gear-icon" size='sm' />
                                        </button>
                                    </div>
                                    {/* )} */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );
};

export default WidgetMapping;

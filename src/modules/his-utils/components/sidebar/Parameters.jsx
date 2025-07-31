import React, { useCallback, useContext, useEffect, useState } from "react";
import { HISContext } from "../../contextApi/HISContext";
import InputField from "../commons/InputField";
import Select from "react-select";
import { convertToISODate, formatDate1, formatParams } from "../../utils/commonFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faReply, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { fetchPostData } from "../../../../utils/HisApiHooks";
import { decryptData } from "../../../../utils/SecurityConfig";

const Parameters = ({ params, scope, widgetId = null }) => {
    const { theme, setParamsValues, paramsValuesPro, setParamsValuesPro, setIsSearchQuery, activeTab, isSearchQuery, searchScope, setSearchScope, dt } = useContext(HISContext);
    const [presentParams, setPresentParams] = useState([]);
    const [selectedValues, setSelectedValues] = useState({});
    const [dropdownData, setDropdownData] = useState({});
    const [hideParams, setHideParams] = useState(false)
    const [defaultValueIfEmpty, setDefaultValueIfEmpty] = useState('');
    const [queryParams] = useSearchParams();

    const dashFor =  decryptData(queryParams.get('dashboardFor'));
    const [errors, setErrors] = useState({
    })

    const handleSetParamsValues = useCallback((values, type, widgetId = null) => {
        if (type === 'tabParams') {
            setParamsValues((prev) => ({
                ...prev,
                tabParams: {
                    ...prev?.tabParams,
                    ...values,
                },
            }));
        } else if (type === 'widgetParams' && widgetId) {
            setParamsValues((prev) => ({
                ...prev,
                widgetParams: {
                    ...prev.widgetParams,
                    [widgetId]: {
                        ...(prev.widgetParams?.[widgetId] || {}),
                        ...values,
                    },
                },
            }));
        }
    }, []);

    const handleSetProParamsValues = useCallback((values, type, widgetId = null) => {
        if (type === 'tabParams') {
            setParamsValuesPro((prev) => ({
                ...prev,
                tabParams: {
                    ...prev?.tabParams,
                    ...values,
                },
            }));
        } else if (type === 'widgetParams' && widgetId) {
            setParamsValuesPro((prev) => ({
                ...prev,
                widgetParams: {
                    ...prev.widgetParams,
                    [widgetId]: {
                        ...(prev.widgetParams?.[widgetId] || {}),
                        ...values,
                    },
                },
            }));
        }
    }, []);

    const getAllAvailableParams = useCallback(async (idArr, dashFor) => {
        try {
            const val = {
                ids: idArr || [],
                dashboardFor: dashFor || 'CENTRAL DASHBOARD',
                masterName: "ParameterMst"
            };
            const data = await fetchPostData("/hisutils/getparametertMultipleData", val);
            if (data?.status === 1) {
                setPresentParams(data?.data);
            } else {
                setPresentParams([]);
            }
        } catch (error) {
            console.error("Error fetching tabs data", error);
        }
    }, []);


    useEffect(() => {
        if (params) {
            const ids = params?.split(',')?.map(Number) || [];
            getAllAvailableParams(ids, dashFor);
        }
    }, [params]);


    const handleMultiSelectChange = (parameterName, selectedOptions, id) => {
        setSelectedValues((prev) => ({
            ...prev,
            [parameterName]: selectedOptions,
        }));

        const sortedString = selectedOptions
            ?.map(opt => opt.optionValue)
            .sort((a, b) => {
                const numA = Number(a);
                const numB = Number(b);

                const isNumA = !isNaN(numA);
                const isNumB = !isNaN(numB);

                if (isNumA && isNumB) return numA - numB;
                return String(a).localeCompare(String(b));
            })
            .join('~');

        handleSetProParamsValues({ [id]: sortedString || '' }, scope, widgetId);
        setErrors(prev => ({ ...prev, [id]: "" }));
    };

    const handleInputChange = (parameterName, e, id) => {
        const { value, type } = e.target;
        if (type === 'checkbox') {
            setSelectedValues((prev) => ({
                ...prev,
                [parameterName]: e.target.checked,
            }));
        } else {
            setSelectedValues((prev) => ({
                ...prev,
                [parameterName]: value || defaultValueIfEmpty,
            }));
        }
        handleSetProParamsValues({ [id]: type == 'date' ? formatDate1(value) : type == 'checkbox' ? e.target.checked : value || defaultValueIfEmpty }, scope, widgetId);
        setErrors(prev => ({ ...prev, [id]: "" }))
    };

    const getDateConstraint = (fieldId) => {
        if (!fieldId) return "";
        const field = document.getElementById(fieldId);
        if (field && field.value) {
            return field.value;
        }
        return "";
    };


    const fetchDropdownData = async (query, parameterName, jndiS) => {
        if (!query) return;
        try {
            const val = { query, params: {}, jndi: jndiS };
            const response = await fetchPostData('/hisutils/GenericApiQry', val);
            const rawData = response?.data || [];

            const formattedData = rawData.map(item => {
                const keys = Object.keys(item);
                const valueKey = keys[0];
                const labelKey = keys[1] || keys[0];
                return {
                    optionValue: item[valueKey],
                    optionText: item[labelKey],
                };
            });


            setDropdownData(prev => ({
                ...prev,
                [parameterName]: formattedData,
            }));
        } catch (error) {
            console.error("Error fetching query data:", error);
        }
    };

    // Fetch dropdown data for parameters that have queries
    useEffect(() => {
        presentParams.forEach((param) => {
            const query = param?.jsonData?.parameterQuery;
            if (query) {
                fetchDropdownData(query, param.jsonData.parameterName, param?.jndiIdForGettingData);
            }
        });
    }, [presentParams]);


    const resetParams = () => {
        setSelectedValues({});
    }

    const searchParams = () => {
        let isValid = true;

        presentParams?.forEach((param) => {
            const isReq = param?.jsonData?.isMandatory;
            const id = param?.jsonData?.parameterId;
            const parameterType = param?.jsonData?.parameterType;
            const maxLength = param?.jsonData?.textboxMaxlength;
            const minLength = param?.jsonData?.textboxMinlength;
            const validation = param?.jsonData?.textBoxValidation;

            const scopedParams = paramsValuesPro?.[scope] || {};
            let value

            if (scope === 'tabParams') {
                value = scopedParams?.[id];
            } else if (scope === 'widgetParams') {
                value = scopedParams?.[widgetId]?.[id];
            }

            if (isReq === 'Yes' && (value === undefined || value === '')) {
                setErrors(prev => ({ ...prev, [id]: "required" }));
                isValid = false;
            }

            if (isReq === 'Yes' && parameterType === "2" && (
                value?.length < minLength || value?.length > maxLength
            )) {
                setErrors(prev => ({ ...prev, [id]: `required ${minLength} to ${maxLength} characters` }));
                isValid = false;
            }
        });

        if (isValid) {
            setParamsValues(paramsValuesPro, scope, widgetId);
            setIsSearchQuery(true)
            setSearchScope({
                scope: scope, id: widgetId
            })
        }
    };

    useEffect(() => {
        const initializeParams = async () => {
            if (presentParams.length > 0) {
                const initialSelectedValues = {};
                const defOpt = {};
                for (const param of presentParams) {
                    const {
                        parameterName,
                        defaultValueIfEmpty,
                        defaultOption,
                        isMultipleSelectionRequired,
                        parameterType,
                        parameterQueryForDate,
                        jndiIdForGettingData
                    } = param?.jsonData || {};

                    const defaultValStr = defaultOption?.optionValue || "";
                    const defaultTextStr = defaultOption?.optionText || "";
                    setDefaultValueIfEmpty(defaultValueIfEmpty);

                    const isMulti = isMultipleSelectionRequired === "Yes";
                    const values = defaultValStr?.includes("##") ? defaultValStr.split("##") : [defaultValStr];
                    const texts = defaultTextStr?.includes("##") ? defaultTextStr.split("##") : [defaultTextStr];

                    if (parameterType === '4' && parameterQueryForDate) {
                        const val = { query: parameterQueryForDate, params: {}, jndi: jndiIdForGettingData };
                        try {
                            const response = await fetchPostData('/hisutils/GenericApiQry', val);
                            const rawData = response?.data || [];

                            const formattedData = rawData.map(item => {
                                const keys = Object.keys(item);
                                const valueKey = keys[0];
                                const labelKey = keys[1] || keys[0];
                                return {
                                    optionValue: convertToISODate(item[valueKey]),
                                    optionText: convertToISODate(item[labelKey])
                                };
                            });

                            initialSelectedValues[parameterName] = formattedData[0]?.optionValue || '';
                            defOpt[param?.id] = formatDate1(formattedData[0]?.optionValue) || '';
                            continue;
                        } catch (err) {
                            console.error(`Error fetching date values for param ${parameterName}`, err);
                        }
                    }

                    if (isMulti) {
                        const matchedOptions = values.map((val, idx) => ({
                            optionValue: val,
                            optionText: texts[idx] || val,
                        }));
                        initialSelectedValues[parameterName] = matchedOptions;
                        defOpt[param?.id] = values.join("~");
                    } else {
                        initialSelectedValues[parameterName] = values[0] || '';
                        defOpt[param?.id] = values[0] || defaultValueIfEmpty;
                    }
                }

                handleSetProParamsValues(defOpt, scope, widgetId);
                handleSetParamsValues(defOpt, scope, widgetId);
                setSelectedValues(initialSelectedValues);
            }
        };

        initializeParams();
    }, [presentParams, widgetId]);
console.log(selectedValues,'bnb')

    const renderInputField = (param) => {
        const {
            parameterType, parameterDisplayName, parameterName, lstOption, isMandatory, defaultOption,
            parameterParentWidth, parentAlignment,
            parameterLabelWidth, labelAlignment,
            parameterControlWidth, controlAlignment, isMultipleSelectionRequired, defaultValueIfEmpty, parameterId, shouldBeLessThanField, shouldBeGreaterThanField, placeHolder, textBoxValidation
        } = param?.jsonData || {};
        const options = dropdownData[parameterName] || [];

        return (
            <div
                className={`col-md-${parameterParentWidth || 6} d-flex mb-1 align-items-center justify-content-${parentAlignment?.toLowerCase() || 'start'}`}
                key={parameterName}
            >
                <label
                    className={`col-${parameterLabelWidth || 6} col-form-label text-${labelAlignment?.toLowerCase() || 'left'} ${isMandatory === "Yes" ? 'required-label' : ''}`}
                >
                    {dt(parameterDisplayName)} :
                </label>

                <div className={`col-${parameterControlWidth || 6} text-${controlAlignment?.toLowerCase() || 'left'}`}>

                    {(parameterType === "1" && isMultipleSelectionRequired === 'Yes') &&
                        <>
                            <Select
                                id={parameterId}
                                name={parameterName}
                                options={
                                    options?.length > 0 ?
                                        options
                                        : lstOption
                                }
                                isMulti
                                placeholder={placeHolder}
                                className={`${theme === 'Dark' ? 'backcolorinput-dark' : 'backcolorinput'} react-select-multi`}
                                getOptionLabel={(e) => e.optionText}
                                getOptionValue={(e) => e.optionValue}
                                value={selectedValues[parameterName] || []}
                                onChange={(selectedOptions) => handleMultiSelectChange(parameterName, selectedOptions, parameterId)}
                                isDisabled={hideParams}
                            />
                            {errors[parameterId] &&
                                <div className="required-input">
                                    {errors[parameterId]}
                                </div>
                            }
                        </>
                    }

                    {(parameterType === "1" && isMultipleSelectionRequired !== 'Yes') &&
                        <>
                            {!hideParams ?
                                <select
                                    id={parameterId}
                                    name={parameterName}
                                    className={`${theme === 'Dark' ? 'backcolorinput-dark' : 'backcolorinput'} form-select form-select-sm`}
                                    value={selectedValues[parameterName] || defaultValueIfEmpty}
                                    onChange={(e) => handleInputChange(parameterName, e, parameterId)}
                                >
                                    {placeHolder ?
                                        <option value=''>{placeHolder}</option> :
                                        <option value=''>{'select'}</option>

                                    }
                                    {defaultOption?.optionText !== '' &&
                                        <option value={defaultOption?.optionValue ? defaultOption?.optionValue : ''}>{defaultOption?.optionText ? defaultOption?.optionText : 'Select Value'}</option>
                                    }
                                    {options?.length > 0 && options.map((option, index) => (
                                        <option key={index} value={option.optionValue}>
                                            {option.optionText}
                                        </option>
                                    ))}
                                </select>
                                :

                                <span>
                                    {
                                        defaultOption?.optionValue == selectedValues[parameterName] || defaultValueIfEmpty ? defaultOption?.optionText :
                                            options?.filter((dt => dt?.optionValue == selectedValues[parameterName] || defaultValueIfEmpty))[0]?.optionText
                                    }
                                </span>
                            }
                            {errors[parameterId] &&
                                <div className="required-input">
                                    {errors[parameterId]}
                                </div>
                            }
                        </>
                    }

                    {parameterType === "2" && (
                        <>
                            {!hideParams ?
                                <InputField
                                    type="text"
                                    className={`${theme === 'Dark' ? 'backcolorinput-dark' : 'backcolorinput'}`}
                                    placeholder={placeHolder}
                                    name={parameterName}
                                    id={parameterId}
                                    value={selectedValues[parameterName] || defaultValueIfEmpty}
                                    onChange={(e) => handleInputChange(parameterName, e, parameterId)}
                                    acceptType={textBoxValidation === '2' ? 'number' : textBoxValidation === '4' ? 'letters' : ''}
                                />
                                :

                                <span>
                                    {
                                        selectedValues[parameterName] || defaultValueIfEmpty
                                    }
                                </span>}
                            {errors[parameterId] &&
                                <div className="required-input">
                                    {errors[parameterId]}
                                </div>
                            }
                        </>
                    )}

                    {parameterType === "4" && (
                        <>
                            {!hideParams ?
                                <input
                                    type="date"
                                    placeholder={placeHolder}
                                    className={`${theme === 'Dark' ? 'backcolorinput-dark' : 'backcolorinput'} form-control form-control-sm`}
                                    name={parameterName}
                                    id={parameterId}
                                    defaultValue={convertToISODate(defaultValueIfEmpty)}
                                    min={getDateConstraint(shouldBeGreaterThanField)}
                                    max={getDateConstraint(shouldBeLessThanField)}
                                    value={selectedValues[parameterName]}
                                    onChange={(e) => handleInputChange(parameterName, e, parameterId)}
                                />
                                :
                                <span>
                                    {
                                        selectedValues[parameterName] || defaultValueIfEmpty
                                    }
                                </span>}
                            {errors[parameterId] &&
                                <div className="required-input">
                                    {errors[parameterId]}
                                </div>
                            }
                        </>
                    )}

                    {/* CheckBox */}
                    {parameterType === "6" && (
                        <>
                            <div className="form-check form-check-inline">
                                <input
                                    type="checkbox"
                                    id={parameterId}
                                    name={parameterName}
                                    className="form-check-input"
                                    checked={selectedValues[parameterName] || false}
                                    onChange={(e) => handleInputChange(parameterName, e, parameterId)}
                                />
                                <label className="form-check-label" htmlFor={parameterName}>
                                    {defaultOption.optionText}
                                </label>
                            </div>
                            {errors[parameterId] &&
                                <div className="required-input">
                                    {errors[parameterId]}
                                </div>
                            }
                        </>
                    )}

                    {/* Radio Button */}
                    {parameterType === "7" && (
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                id={parameterId}
                                name={parameterName}
                                value={defaultOption.optionValue}
                                className="form-check-input"
                                checked={selectedValues[parameterName] === defaultOption?.optionValue}
                                onChange={(e) => handleInputChange(parameterName, e, parameterId)}
                            />
                            {errors[parameterId] &&
                                <div className="required-input">
                                    {errors[parameterId]}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div >
        );
    };


    return (
        <>
            <div className='help-docs'>
                <button type="button" className="small-box-btn-dwn m-1" onClick={() => searchParams()}>
                    <FontAwesomeIcon icon={faSearch} size="xs" className="dropdown-gear-icon" />
                </button>
                <button type="button" className="small-box-btn-dwn m-1" onClick={() => resetParams()}>
                    <FontAwesomeIcon icon={faReply} size="xs" className="dropdown-gear-icon" />
                </button>
                <button type="button" className="small-box-btn-dwn m-1" onClick={() => setHideParams(!hideParams)}>
                    <FontAwesomeIcon icon={faEyeSlash} size="xs" className="dropdown-gear-icon" />
                </button>
            </div>
            {/* {!hideParams && */}
            <div className="row">
                {presentParams?.length > 0 && presentParams?.map((param, index) =>
                    renderInputField(param))
                }
            </div>
            {/* } */}
        </>
    );
};

export default Parameters;

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { HISContext } from "../../contextApi/HISContext";
import InputField from "../commons/InputField";
import Select from "react-select";
import { convertToISODate, formatDate1, formatParams } from "../../utils/commonFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faReply, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { fetchPostData } from "../../../../utils/HisApiHooks";
import { decryptData } from "../../../../utils/SecurityConfig";
import { getEncryptedParamValue } from "../../../../utils/Security";

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

const Parameters = ({ params, scope, widgetId = null, isLayoutWithPreview, setWidgetParams, setAllDrpDtParams, setTabParams, tabParams }) => {
    const { theme, setParamsValues, paramsValuesPro, setParamsValuesPro, setIsSearchQuery, activeTab, isSearchQuery, searchScope, setSearchScope, dt } = useContext(HISContext);
    const [presentParams, setPresentParams] = useState([]);
    const [selectedValues, setSelectedValues] = useState({});
    const [dropdownData, setDropdownData] = useState({});
    const [hideParams, setHideParams] = useState(false);
    const [defaultValueIfEmpty, setDefaultValueIfEmpty] = useState('');
    const [queryParams] = useSearchParams();

    const groupId = atob(queryParams.get("groupId"));
    const dashFor = atob(queryParams.get("dashboardFor"));
    const isGlobal = queryParams.get("isGlobal") || 0;

    const [parentId, setParentId] = useState([]);
    const prevParams = usePrevious(paramsValuesPro);

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

            // setWidgetParams((prev) => ({
            //     ...prev,
            //     widgetParams: {
            //         ...prev.widgetParams,
            //         [widgetId]: {
            //             ...(prev.widgetParams?.[widgetId] || {}),
            //             ...values,
            //         },
            //     },
            // }));
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
            const data = await fetchPostData(`/hisutils/getparametertMultipleData?isGlobal=${isGlobal || 0}`, val);

            if (data?.status === 1) {
                setPresentParams(data?.data);
                if (scope === 'widgetParams') {
                    setWidgetParams(data?.data?.map((dt) => ({ id: dt?.id, disName: dt?.jsonData?.parameterDisplayName, paraName: dt?.jsonData?.parameterName })))
                }
                if (scope === 'tabParams') {
                    setTabParams(data?.data?.map((dt) => ({ id: dt?.id, disName: dt?.jsonData?.parameterDisplayName, paraName: dt?.jsonData?.parameterName })))
                }
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
    const handleSingleSelectChange = (parameterName, selectedOption, parameterId) => {
        const value = selectedOption ? selectedOption.optionValue : '';

        setSelectedValues(prev => ({
            ...prev,
            [parameterName]: value
        }));

        handleSetProParamsValues({ [parameterId]: value || '' }, scope, widgetId);

        if (errors[parameterId]) {
            setErrors(prev => ({
                ...prev,
                [parameterId]: ''
            }));
        }
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

    const fetchDropdownData = async (query, parameterName, jndiS, paraValue) => {
        if (!query) return;
        try {
            const regex = /#PARA#(\d+)#PARA#/g;
            const match = regex.exec(query);
            const paraId = match ? match[1] : null;

            if (paraId) {
                setParentId((prev) => {
                    // if paraId already exists, return previous state
                    if (prev.includes(paraId)) {
                        return prev;
                    }
                    // else push new one
                    return [...prev, paraId];
                });
            }

            const val = {
                query,
                params: {},
                jndi: jndiS,
                strGroupParaId: paraId,
                strGroupParaValue: paraValue ?? null
                // strGroupParaValue:
                //     scope === 'tabParams'
                //         ? paramsValuesPro?.tabParams?.[paraId] ?? null
                //         : scope === 'widgetParams'
                //             ? paramsValuesPro?.widgetParams?.[paraId] ?? null
                //             : null,
            };
            const response = await fetchPostData(`/hisutils/GenericApiQry?isGlobal=${isGlobal || 0}`, val);


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
            setAllDrpDtParams(prev => ({
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

    useEffect(() => {
        if (!presentParams?.length || !prevParams) return;

        const changedKeys = [];

        // check tabParams
        for (const key in paramsValuesPro?.tabParams) {
            if (paramsValuesPro.tabParams[key] !== prevParams.tabParams?.[key]) {
                changedKeys.push({ scope: "tabParams", key, value: paramsValuesPro.tabParams[key] });
            }
        }

        // check widgetParams (nested)
        for (const widgetId in paramsValuesPro?.widgetParams) {
            const currentWidget = paramsValuesPro.widgetParams[widgetId] || {};
            const prevWidget = prevParams.widgetParams?.[widgetId] || {};

            for (const key in currentWidget) {
                if (currentWidget[key] !== prevWidget[key]) {
                    changedKeys.push({
                        scope: "widgetParams",
                        key,
                        value: currentWidget[key],
                        widgetId, // optional, if you need to know which widget it belongs to
                    });
                }
            }
        }

        if (!changedKeys.length) return;

        // Run dropdown fetch only for changed params
        presentParams.forEach((param) => {
            const query = param?.jsonData?.parameterQuery;
            if (!query) return;

            const regex = /#PARA#(\d+)#PARA#/g;
            const match = regex.exec(query);
            const paraId = match ? match[1] : null;

            if (paraId) {
                const changed = changedKeys.find((c) => c.key === paraId);
                if (changed) {
                    fetchDropdownData(
                        query,
                        param.jsonData.parameterName,
                        param?.jndiIdForGettingData,
                        changed.value
                    );
                }
            }
        });
    }, [paramsValuesPro, presentParams]);


    // useEffect(() => {
    //     if (!presentParams?.length || !prevParams) return;

    //     const changedKeys = [];

    //     // check tabParams
    //     for (const key in paramsValuesPro?.tabParams) {
    //         if (paramsValuesPro.tabParams[key] !== prevParams.tabParams?.[key]) {
    //             changedKeys.push(key);
    //         }
    //     }

    //     for (const widgetId in paramsValuesPro?.widgetParams) {
    //         const currentWidget = paramsValuesPro.widgetParams[widgetId] || {};
    //         const prevWidget = prevParams.widgetParams?.[widgetId] || {};

    //         for (const key in currentWidget) {
    //             if (currentWidget[key] !== prevWidget[key]) {
    //                 changedKeys.push(key); 
    //             }
    //         }
    //     }

    //     if (!changedKeys.length) return;

    //     presentParams.forEach((param) => {
    //         const query = param?.jsonData?.parameterQuery;
    //         if (!query) return;

    //         const regex = /#PARA#(\d+)#PARA#/g;
    //         const match = regex.exec(query);
    //         const paraId = match ? match[1] : null;

    //         if (paraId && changedKeys.includes(paraId)) {
    //             fetchDropdownData(
    //                 query,
    //                 param.jsonData.parameterName,
    //                 param?.jndiIdForGettingData
    //             );
    //         }
    //     });
    // }, [paramsValuesPro, presentParams]);

    // useEffect(() => {
    //     if (!presentParams?.length) return;

    //     presentParams.forEach((param) => {
    //         const query = param?.jsonData?.parameterQuery;
    //         if (!query) return;

    //         const regex = /#PARA#(\d+)#PARA#/g;
    //         const match = regex.exec(query);
    //         const paraId = match ? match[1] : null;

    //         if (paraId && parentId.includes(paraId)) {
    //             const newValue =
    //                 scope === "tabParams"
    //                     ? paramsValuesPro?.tabParams?.[paraId]
    //                     : paramsValuesPro?.widgetParams?.[paraId];

    //             // Run only if value is defined (or you can add extra checks here)
    //             if (newValue !== undefined) {
    //                 fetchDropdownData(
    //                     query,
    //                     param.jsonData.parameterName,
    //                     param?.jndiIdForGettingData
    //                 );
    //             }
    //         }
    //     });
    // }, [paramsValuesPro, parentId, presentParams, scope]);


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
            setParamsValues(paramsValuesPro);
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
                        jndiIdForGettingData, showAsLableIfOneData
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
                            const response = await fetchPostData(`/hisutils/GenericApiQry?isGlobal=${isGlobal || 0}`, val);
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

                    const options = dropdownData[parameterName] || [];

                    if (isMulti) {
                        const matchedOptions = values.map((val, idx) => ({
                            optionValue: val,
                            optionText: texts[idx] || val,
                        }));
                        initialSelectedValues[parameterName] = matchedOptions;
                        defOpt[param?.id] = values.join("~");
                    } else {
                        // CHANGED: If no default value but options exist, use first option
                        let selectedValue = values[0] || '';

                        // If no default value and we have options, use the first option
                        if (!selectedValue && options.length > 0) {
                            selectedValue = options[0].optionValue;
                        }
                        initialSelectedValues[parameterName] = selectedValue;
                        defOpt[param?.id] = selectedValue || defaultValueIfEmpty;

                        // initialSelectedValues[parameterName] = values[0] || '';
                        // defOpt[param?.id] = values[0] || defaultValueIfEmpty;
                    }
                }

                handleSetProParamsValues(defOpt, scope, widgetId);
                handleSetParamsValues(defOpt, scope, widgetId);
                setSelectedValues(initialSelectedValues);
            }
        };

        initializeParams();
    }, [presentParams, widgetId, dropdownData[presentParams?.find(prm => prm?.jsonData?.parameterName)?.jsonData?.parameterName]]);


    const renderInputField = (param) => {
        const {
            parameterType, parameterDisplayName, parameterName, lstOption, isMandatory, defaultOption,
            parameterParentWidth, parentAlignment,
            parameterLabelWidth, labelAlignment,
            parameterControlWidth, controlAlignment, isMultipleSelectionRequired, defaultValueIfEmpty, parameterId, shouldBeLessThanField, shouldBeGreaterThanField, placeHolder, textBoxValidation, showAsLableIfOneData
        } = param?.jsonData || {};
        const options = dropdownData[parameterName] || [];
        const shouldShowAsLabel = showAsLableIfOneData === "Yes" &&
            options.length === 1 &&
            (!defaultOption?.optionValue ||
                (defaultOption && options.some(opt => opt.optionValue == defaultOption.optionValue)));

        return (
            <div
                className={`${isLayoutWithPreview ? '' : `col-md-${parameterParentWidth || 6}`} d-flex mb-1 align-items-center justify-content-${parentAlignment?.toLowerCase() || 'start'}`}
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
                            {!hideParams && !shouldShowAsLabel ?
                                <Select
                                    id={parameterId}
                                    name={parameterName}
                                    menuPortalTarget={document.body}
                                    // options={[
                                    //     ...(defaultOption?.optionText ? [defaultOption] : []),
                                    //     ...(options?.length > 0 ? options : [])
                                    // ]}
                                    options={
                                        (() => {
                                            const allOptions = options?.length > 0 ? options : [];
                                            const defaultOpt = defaultOption?.optionText ? defaultOption : null;
                                            if (defaultOpt && !allOptions.some(opt => opt.optionValue == defaultOpt.optionValue)) {
                                                return [defaultOpt, ...allOptions];
                                            }
                                            return allOptions;
                                        })()
                                    }
                                    placeholder={placeHolder || 'Select Value'}
                                    className={`${theme === 'Dark' ? 'backcolorinput-dark' : 'backcolorinput'} react-select-multi`}
                                    classNamePrefix="react-select"
                                    getOptionLabel={(e) => e.optionText}
                                    getOptionValue={(e) => e.optionValue}
                                    value={
                                        [...(defaultOption ? [defaultOption] : []), ...(options || [])]
                                            .find(opt => opt.optionValue === selectedValues[parameterName]) ||
                                        null
                                    }
                                    onChange={(selectedOption) => handleSingleSelectChange(parameterName, selectedOption, parameterId)}
                                    isDisabled={hideParams}
                                    isSearchable={true}
                                    isClearable={true}
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                    }}
                                />
                                :
                                <span className="fw-medium">
                                    {
                                        options?.find(opt => opt.optionValue === selectedValues[parameterName])?.optionText ||
                                        defaultOption?.optionText ||
                                        ''
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
            <div className={`help-docs ${isLayoutWithPreview ? 'layout-help-docs' : ''}`}>

                <button type="button" className="small-box-btn-dwn m-1" onClick={() => resetParams()}>
                    <FontAwesomeIcon icon={faReply} size="xs" className="dropdown-gear-icon" />
                </button>
                <button type="button" className="small-box-btn-dwn m-1" onClick={() => setHideParams(!hideParams)}>
                    <FontAwesomeIcon icon={faEyeSlash} size="xs" className="dropdown-gear-icon" />
                </button>
                <button type="button" className="small-box-btn-dwn m-1" onClick={() => searchParams()}>
                    <FontAwesomeIcon icon={faSearch} size="xs" className="dropdown-gear-icon" />
                </button>
            </div>
            {/* {!hideParams && */}
            <div className={`${isLayoutWithPreview ? 'layouthw' : 'row'}`}>
                {presentParams?.length > 0 && presentParams?.map((param, index) =>
                    renderInputField(param))
                }
            </div>
            {/* } */}
        </>
    );
};

export default Parameters;

import React from 'react';

const InputSelect = ({
    id,
    name,
    value,
    options = [],
    onChange,
    onBlur,
    onFocus,
    disabled,
    required,
    className,
    style,
    errorMessage,
    placeholder,
    multiple,
    onClick
}) => {
    return (
        <>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                disabled={disabled}
                required={required}
                className={`form-select form-select-sm ${className}`}
                style={style}
                multiple={multiple ? multiple : false}
                onClick={onClick}
                
            >
                {/* Render options dynamically */}
                {placeholder && <option value={''}>{placeholder}</option>}
                {options?.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errorMessage && (
                <div className="required-input">
                    {errorMessage}
                </div>
            )}
        </>
    );
};

export default InputSelect;

import React from 'react';
import { sanitizeInput } from '../../utils/commonFunction';

const InputField = ({
    id,
    name,
    value,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    disabled,
    maxLength,
    required,
    readOnly,
    className,
    style,
    errorMessage,
    type,
    onClick,
    ref,
    acceptType,
    isSpecialChrs = false

}) => {

    const handleChange = (e) => {
        if (onChange) {
            let newValue = e.target.value;

            // Apply acceptType filtering for numbers (digits only)
            if (acceptType === "number") {
                newValue = newValue.replace(/[^0-9]/g, '');
            } else if (acceptType === "letters") {
                newValue = newValue.replace(/[^a-zA-Z]/g, '');
            }
            newValue = sanitizeInput(newValue, isSpecialChrs);

            // If the value changed due to sanitization, create a comprehensive event-like object
            if (newValue !== e.target.value) {
                const result = {
                    // Preserve the original event properties
                    nativeEvent: e.nativeEvent,
                    timeStamp: e.timeStamp,
                    bubbles: e.bubbles,
                    cancelable: e.cancelable,
                    defaultPrevented: e.defaultPrevented,
                    eventPhase: e.eventPhase,
                    isTrusted: e.isTrusted,

                    // Preserve common React event methods
                    preventDefault: e.preventDefault.bind(e),
                    stopPropagation: e.stopPropagation.bind(e),
                    persist: e.persist?.bind(e),

                    // Comprehensive target object with all commonly used properties
                    target: {
                        // Form input properties
                        name: e.target.name,
                        id: e.target.id,
                        value: newValue,
                        type: e.target.type,
                        placeholder: e.target.placeholder,
                        disabled: e.target.disabled,
                        readOnly: e.target.readOnly,
                        required: e.target.required,
                        maxLength: e.target.maxLength,
                        autoComplete: e.target.autoComplete,

                        // Form properties
                        form: e.target.form,

                        // Selection properties (for text inputs)
                        selectionStart: e.target.selectionStart,
                        selectionEnd: e.target.selectionEnd,
                        selectionDirection: e.target.selectionDirection,

                        // Validation properties
                        validity: e.target.validity,
                        validationMessage: e.target.validationMessage,
                        willValidate: e.target.willValidate,

                        // Style and dimension properties
                        className: e.target.className,
                        classList: e.target.classList,
                        style: e.target.style,
                        offsetWidth: e.target.offsetWidth,
                        offsetHeight: e.target.offsetHeight,
                        clientWidth: e.target.clientWidth,
                        clientHeight: e.target.clientHeight,

                        // Position properties
                        offsetLeft: e.target.offsetLeft,
                        offsetTop: e.target.offsetTop,
                        clientLeft: e.target.clientLeft,
                        clientTop: e.target.clientTop,

                        // DOM properties
                        tagName: e.target.tagName,
                        nodeName: e.target.nodeName,
                        ownerDocument: e.target.ownerDocument,
                        parentElement: e.target.parentElement,
                        parentNode: e.target.parentNode,
                        children: e.target.children,
                        firstChild: e.target.firstChild,
                        lastChild: e.target.lastChild,
                        nextSibling: e.target.nextSibling,
                        previousSibling: e.target.previousSibling,

                        // Attribute methods
                        getAttribute: e.target.getAttribute.bind(e.target),
                        setAttribute: e.target.setAttribute.bind(e.target),
                        hasAttribute: e.target.hasAttribute.bind(e.target),
                        removeAttribute: e.target.removeAttribute.bind(e.target),

                        // Class methods
                        addEventListener: e.target.addEventListener.bind(e.target),
                        removeEventListener: e.target.removeEventListener.bind(e.target),
                        dispatchEvent: e.target.dispatchEvent.bind(e.target),

                        // Focus methods
                        focus: e.target.focus.bind(e.target),
                        blur: e.target.blur.bind(e.target),

                        // Selection methods (for text inputs)
                        select: e.target.select.bind(e.target),
                        setSelectionRange: e.target.setSelectionRange.bind(e.target),

                        // Validation methods
                        checkValidity: e.target.checkValidity.bind(e.target),
                        reportValidity: e.target.reportValidity.bind(e.target),
                        setCustomValidity: e.target.setCustomValidity.bind(e.target)
                    },

                    // Also include currentTarget for consistency
                    currentTarget: {
                        // Include the most commonly used properties from target
                        name: e.currentTarget.name,
                        id: e.currentTarget.id,
                        value: newValue,
                        type: e.currentTarget.type
                    }
                };

                onChange(result);
            } else {
                onChange(e);
            }
        }
    };

    return (
        <>
            <input
                type={type ? type : "text"}
                id={id}
                name={name}
                // value={
                //     acceptType === "number"
                //         ? value?.toString().replace(/[^0-9]/g, '')
                //         : acceptType === "letters"
                //             ? value?.toString().replace(/[^a-zA-Z]/g, '')
                //             : value
                // }
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={onBlur}
                onFocus={onFocus}
                disabled={disabled}
                maxLength={maxLength}
                required={required}
                readOnly={readOnly}
                className={`form-control form-control-sm ${className}`}
                style={style}
                autoComplete='off'
                onClick={onClick}
                ref={ref}
            />
            {errorMessage &&
                <div className="required-input">
                    {errorMessage}
                </div>
            }
        </>
    );
};

export default InputField;
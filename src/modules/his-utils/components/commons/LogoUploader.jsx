import React, { useRef } from 'react'
import InputField from './InputField';



const LogoUploader = ({ name, value, onChange }) => {
    const fileInputRef = useRef();

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(name, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChange(name, "");
    };

    return (
        <div className="d-flex align-items-center">
            <img
                src={value || "/default-upload-icon.png"}
                alt="logo"
                style={{
                    width: "50px",
                    height: "40px",
                    cursor: "pointer",
                    border: "1px solid #808080",
                    borderRadius: "4px",
                    objectFit: "contain"
                }}
                onClick={handleClick}
            />
            {value &&
                <i className='fa fa-close logo-upload-close' onClick={handleRemove}></i>
            }
            <InputField
                type="file"
                ref={fileInputRef}
                name={name}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
                className={'backcolorinput'}
            />
        </div>
    );
};

export default LogoUploader
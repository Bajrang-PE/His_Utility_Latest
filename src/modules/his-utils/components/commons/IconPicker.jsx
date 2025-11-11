import React, { useEffect, useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import InputField from "./InputField";

const iconList = Object.keys(FaIcons);

const IconPicker = ({ setTabIcon, tabIcon, setValues, values }) => {
    const [selectedIcon, setSelectedIcon] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (tabIcon) {
            setSelectedIcon(tabIcon)
        }
    }, [tabIcon])

    // Filter icons based on search
    const filteredIcons = iconList.filter((icon) =>
        icon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle icon selection
    const handleIconClick = (iconName) => {
        setSelectedIcon(iconName);
        setTabIcon(iconName);
        setShowPicker(false);
        setValues({ ...values, ['iconName']: iconName })
    };

    const SelectedIconComponent = selectedIcon ? FaIcons[selectedIcon] : null;

    const onOpenBox = () => {
        setShowPicker(!showPicker)
    }

    const modalRef = useRef();

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowPicker(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <div style={{ position: "relative" }} ref={modalRef}>
            {/* Input Field */}
            <div className="input-group flex-nowrap">
                <span className="input-group-text backcolorinput-icon" id="addon-wrapping">
                    {(selectedIcon && SelectedIconComponent) && (
                        <SelectedIconComponent />
                    )}
                </span>
                <InputField
                    type="text"
                    placeholder="Select an icon"
                    value={selectedIcon}
                    readOnly
                    onClick={() => onOpenBox()}
                    className='backcolorinput-icons form-select form-select-sm'
                    style={{ cursor: "pointer" }}
                />
            </div>

            {/* Icon Picker Popup */}
            {showPicker && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "300px",
                        maxHeight: "250px",
                        overflowY: "auto",
                        background: "#fff",
                        border: "1px solid #005b88",
                        padding: "10px",
                        zIndex: 10,
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        borderRadius: "5px"
                    }}

                >
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search icon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="backcolorinput form-control form-control-sm"
                    />

                    {/* Icons Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(6, 1fr)",
                            gap: "10px",
                        }}
                    >
                        {filteredIcons.map((icon) => {
                            const IconComponent = FaIcons[icon];
                            return (
                                <div
                                    key={icon}
                                    onClick={() => handleIconClick(icon)}
                                    style={{
                                        cursor: "pointer",
                                        textAlign: "center",
                                        fontSize: "24px",
                                        margin: "2px",
                                        borderRadius: "5px",
                                        border: "1px solid transparent",
                                    }}
                                    className="c"
                                    onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid #ccc")}
                                    onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid transparent")}
                                >
                                    <IconComponent />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconPicker;

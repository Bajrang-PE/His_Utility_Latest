import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

const DropdownPortal = ({ children, anchorEl, onClose }) => {
    const [style, setStyle] = useState({});
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (anchorEl) {
            const rect = anchorEl.getBoundingClientRect();
            setStyle({
                position: 'absolute',
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                zIndex: 9999,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
            });
        }
    }, [anchorEl]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !anchorEl.contains(event.target)) {
                onClose?.();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, anchorEl]);

    return ReactDOM.createPortal(
        <div ref={dropdownRef} style={style} className="dropdown-portal">
            {children}
        </div>,
        document.body
    );
};

export default DropdownPortal;

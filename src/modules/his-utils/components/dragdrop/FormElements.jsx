import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';

const ITEM_HEIGHT = 40;
const DROPDOWN_HEIGHT = 180;

function Dropdown({ options = [], value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleSelect = (option) => {
    const fakeEvent = { target: { value: option.value } };
    onChange(fakeEvent);
    closeDropdown();
    setSearchTerm(''); // Reset search on select
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter((opt) =>
      String(opt.label).toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, options]);

  const Row = ({ index, style }) => {
    const option = filteredOptions[index];

    return (
      <div
        className="Wrapper__select--option"
        onClick={() => handleSelect(option)}
        key={option.value}
        style={style}
      >
        {option.label}
      </div>
    );
  };

  // Reset when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="Wrapper" ref={dropdownRef}>
      {label && <label className="Wrapper__label">{label}</label>}

      <div className="Wrapper__select" onClick={toggleDropdown}>
        {selectedOption?.label || 'Please Select'}
      </div>

      {isOpen && (
        <div className="Wrapper__select--menu">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="Wrapper__search"
          />

          <List
            height={DROPDOWN_HEIGHT}
            itemCount={filteredOptions.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
          >
            {Row}
          </List>
        </div>
      )}
    </div>
  );
}

function InputField({
  label,
  fieldType,
  value,
  onChange,
  placeholder = 'Enter Here',
  name=""
}) {
  return (
    <div className="Wrapper">
      {label && <label className="Wrapper__label">{label}</label>}
      <input
        className="Wrapper__input"
        value={value}
        onChange={onChange}
        type={fieldType}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
}

function Label({ labelText }) {
  return (
    <div className="Wrapper">
      <span className="Wrapper__label">{labelText}</span>
    </div>
  );
}

export { Dropdown, InputField, Label };

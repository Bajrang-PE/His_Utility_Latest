import React, { useState, useId, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DraggableItem } from './dragdrop/FlexiLayoutDnD/DraggableItem';

export default function Accordian({ data, label }) {
  const [searchTerm, setSearchTerm] = useState('');
  const uniqueId = useId();

  const filteredParams = data.filter((param) =>
    param?.str_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="accordian">
      <input className="accordian__trigger" id={uniqueId} type="checkbox" />
      <label className="accordian__title" htmlFor={uniqueId}>
        {label}
      </label>

      <div className="accordian__content-wrapper">
        <input
          type="text"
          placeholder="Search..."
          className="accordian__content--search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredParams.map((param) => (
          <DraggableItem
            key={`${label}-${param?.str_name}`}
            id={param?.str_name}
            label={param?.str_name}
            data={param}
          />
        ))}

        {filteredParams.length === 0 && (
          <div className="accordian__content">Not Found</div>
        )}
      </div>
    </div>
  );
}

export function AccordianNonDraggable({
  data,
  label,
  onClick,
  className,
  activeID,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const uniqueId = useId();

  // Filter by 'label' property now, case-insensitive
  const filteredParams = data.filter((param) =>
    param?.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="accordian" style={{ marginTop: 0 }}>
      <input className="accordian__trigger" id={uniqueId} type="checkbox" />
      <label className="accordian__draggable-title" htmlFor={uniqueId}>
        {label}
      </label>

      <div className="accordian__content-wrapper">
        <input
          type="text"
          placeholder="Search..."
          className="accordian__content--search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredParams.length > 0 ? (
          <ul className="accordian__list">
            {filteredParams.map((param) => (
              <li
                key={param.value ?? param.label} // safer key
                onClick={onClick}
                role="button"
                tabIndex={0}
                value={param.value}
                className={`${className} ${activeID === param.value ? 'active' : ''}`}
              >
                {param.label}
              </li>
            ))}
          </ul>
        ) : (
          <div className="accordian__content accordian__noItems">
            No Items Here
          </div>
        )}
      </div>
    </div>
  );
}
export function StaticDataAccordian({ data = [], label }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const uniqueId = uuidv4();

  return (
    <div className="staticAccordian">
      <div
        className="staticAccordian__title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {label}
        <span className={`staticAccordian__arrow ${isOpen ? 'open' : ''}`}>
          +
        </span>
      </div>

      <div
        ref={contentRef}
        className="staticAccordian__content-wrapper"
        style={{
          height: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
      >
        <ul className="staticAccordian__list">
          {data.map((item, index) => (
            <li className="guideLines__desc" key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

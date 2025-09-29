import React, { useState, useId } from 'react';
import { DraggableItem } from './FlexiLayoutDnD/DraggableItem';

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

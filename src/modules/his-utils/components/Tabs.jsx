import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../Features/Tab/TabSlice';

export default function TabComponent({ options }) {
  const dispatch = useDispatch();
  const activeIndex = useSelector((state) => state.tab.activeIndex);

  const handleTabClick = (activeTab) => {
    dispatch(setActiveTab(activeTab));
  };

  return (
    <div className="tab__container">
      <div className="tab__container-header">
        {options.map((option, index) => (
          <button
            key={index}
            className={`tab__container-button ${activeIndex === option ? 'active' : ''}`}
            onClick={() => handleTabClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useContext } from 'react';
import { HISContext } from '../../contextApi/HISContext';

const TabNav = ({ isTabNav, tabNavData, tabName, setTabName, setTabIndex }) => {

  const { dt } = useContext(HISContext);

  const [visibleTabCount, setVisibleTabCount] = useState(4);
  const [showDropdown, setShowDropdown] = useState(false);

  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const calculateTabCount = () => {
      const availableWidth = window.innerWidth;
      if (availableWidth > 1440) {
        setVisibleTabCount(7);
      } else if (availableWidth >= 1200) {
        setVisibleTabCount(5);
      } else if (availableWidth >= 1024) {
        setVisibleTabCount(4);
      } else if (availableWidth >= 768) {
        setVisibleTabCount(3);
      } else {
        setVisibleTabCount(0);
      }
    };

    calculateTabCount();
    window.addEventListener('resize', calculateTabCount);

    return () => {
      window.removeEventListener('resize', calculateTabCount);
    };
  }, []);

  const handleTabClick = (index, value) => {
    setTabName(value);
    setTabIndex(index + 1);
  };


  return (
    <>
      {isTabNav && (
        <div className="text-end py-1 global-tab-group">
          {/* Tabs for larger screens */}
          <div className="tabs d-none d-sm-flex justify-content-end">
            {/* MAIN LIST */}
            {tabNavData?.slice(0, visibleTabCount)?.map((tab, index) => (
              <button
                key={tab.value}
                className={`btn btn-sm ms-1 nav-tab-btn ${tabName?.value === tab.value ? 'active-tab' : ''}`}
                onClick={() => handleTabClick(index, tab)}
              >
                {dt(tab.label)}
              </button>
            ))}

            {/* DROPDOWN BUTTON */}
            {tabNavData?.length > visibleTabCount && (
              <div className="dropdown" ref={modalRef}>
                <button
                  className="btn btn-sm dropdown-button nav-tab-btn ms-1"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  &#9662;
                </button>

                {/* DROPDOWN LIST */}
                {showDropdown && (
                  <div className="dropdown-menu show" style={{ right: 0, left: "auto" }}>
                    {tabNavData?.slice(visibleTabCount)?.map((tab, index) => (
                      <button
                        key={tab.value}
                        className="dropdown-item"
                        onClick={() => { handleTabClick(visibleTabCount + index, tab); setShowDropdown((prev) => !prev); }}
                      >
                        {dt(tab.label)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile view: Show only dropdown */}
          <div className="tabs d-sm-none ">
            <div className="dropdown">
              <button
                className="btn btn-sm dropdown-button nav-tab-btn ms-1 rounded-0"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                &#9662;
              </button>
              {showDropdown && (
                <div className="dropdown-menu show" style={{ right: 0, left: "auto" }}>
                  {tabNavData?.map((tab, index) => (
                    <button
                      key={tab.value}
                      onTouchStart={(e) => { handleTabClick(index, tab); setShowDropdown((prev) => !prev) }}
                      className="dropdown-item"
                      onClick={() => { handleTabClick(index, tab); setShowDropdown((prev) => !prev) }}
                    >
                      {dt(tab.label)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TabNav;

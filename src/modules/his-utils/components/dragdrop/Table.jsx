import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPKColsData,
  setWidgitToExecute,
} from '../../Features/Drilldown/drilldownSlice';

const Table = ({ tableData = [], widgitStyle = '' }) => {
  const hasData = Array.isArray(tableData) && tableData.length > 0;
  const tableStyles =
    widgitStyle === ''
      ? ['Table__wrapper', 'Table__wrapper--table']
      : widgitStyle;

  // Get columns even if there’s no data (so headers stay visible)
  const columns = hasData ? Object.keys(tableData[0]) : [];

  return (
    <div className={tableStyles.at(0)}>
      <table className={tableStyles.at(1)}>
        <thead>
          <tr>
            {columns.length > 0 ? (
              columns.map((col, index) => <th key={index}>{col}</th>)
            ) : (
              <th>Table is Empty</th>
            )}
          </tr>
        </thead>
        <tbody>
          {hasData ? (
            tableData.map((rowData, idx) => (
              <tr key={idx}>
                {columns.map((col, index) => (
                  <td key={index}>
                    {(() => {
                      const cellValue = rowData[col];
                      if (cellValue === null || cellValue === undefined)
                        return 'NA';
                      if (typeof cellValue === 'object') {
                        try {
                          return JSON.stringify(cellValue);
                        } catch {
                          return String(cellValue);
                        }
                      }
                      return cellValue;
                    })()}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length || 1}>No Records Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const DrilldownTable = ({ tableData = [], widgitStyle = '', dataSet }) => {
  const allWidgits = useSelector((state) => state.drilldownConfig.allWidgits);
  const dispatch = useDispatch();

  const drilldown_ids =
    dataSet?.dataSet?.drilldown_ids || dataSet?.drilldown_ids || {};

  const pkCol =
    dataSet?.dataSet?.lt_json?.pkCol ||
    dataSet?.lt_json?.pkCol ||
    dataSet?.lt_json?.pkCols ||
    {};

  const listOfAvailableDrilldowns = Object.keys(drilldown_ids);

  const [selectedRow, setSelectedRow] = useState(null);
  const popupRef = useRef(null);

  const hasData = Array.isArray(tableData) && tableData.length > 0;
  const tableStyles =
    widgitStyle === ''
      ? ['Table__wrapper', 'Table__wrapper--table']
      : widgitStyle;
  const columns = hasData ? Object.keys(tableData[0]) : [];

  function handleDrilldownClick(rowData) {
    setSelectedRow(rowData);
  }

  function handleDrilldown(itemID) {
    const nextWidgit = allWidgits.find((item) => item.id === itemID);
    const nextWidgitPKValues = pkCol[itemID] || pkCol;

    let pkColumnValues = {};

    Object.keys(nextWidgitPKValues).forEach((key) => {
      const pkColFromChart = nextWidgitPKValues[key];
      pkColumnValues[key] = selectedRow[pkColFromChart];
    });

    //setting up next widgit data
    dispatch(setWidgitToExecute(nextWidgit));
    dispatch(setPKColsData({ [String(itemID)]: pkColumnValues }));
  }

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSelectedRow(null);
      }
    }

    if (selectedRow) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedRow]);

  return (
    <div className={tableStyles.at(0)}>
      <table className={tableStyles.at(1)}>
        <thead>
          <tr>
            {columns.length > 0 ? (
              <>
                <th>Drilldown Details</th>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </>
            ) : (
              <th>Table is Empty</th>
            )}
          </tr>
        </thead>
        <tbody>
          {hasData ? (
            tableData.map((rowData, idx) => (
              <tr key={idx}>
                <td>
                  <button
                    type="button"
                    className="drilldownButton"
                    aria-label="Expand row"
                    onClick={() => handleDrilldownClick(rowData)}
                  >
                    <img
                      src="/drilldownArrow.png"
                      alt="Drilldown"
                      className="drilldownButton__Icon"
                    />
                  </button>
                </td>
                {columns.map((col, index) => (
                  <td key={index}>
                    {(() => {
                      const cellValue = rowData[col];
                      if (cellValue === null || cellValue === undefined)
                        return 'NA';
                      if (typeof cellValue === 'object') {
                        try {
                          return JSON.stringify(cellValue);
                        } catch {
                          return String(cellValue);
                        }
                      }
                      return cellValue;
                    })()}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length || 1}>No Records Found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popup Modal */}
      {selectedRow && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.3)',
              zIndex: 999,
            }}
          ></div>
          <div
            id="drilldownPopup"
            className="drilldownMaster__popup"
            ref={popupRef}
          >
            <div className="drilldownMaster__popup--content">
              <h3 className="drilldownMaster__popup--content-heading">
                Drilldown To
              </h3>
              {allWidgits
                .filter((item) =>
                  listOfAvailableDrilldowns.includes(String(item.id))
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="drilldownMaster__popup--content-options"
                    onClick={() => handleDrilldown(item.id)}
                  >
                    {item.str_name}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { DrilldownTable, Table };

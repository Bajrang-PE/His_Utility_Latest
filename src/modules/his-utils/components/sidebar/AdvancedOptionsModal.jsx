import React from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSlidersH, 
  faSort, 
  faEye, 
  faArrowUp, 
  faArrowDown, 
  faSave, 
  faBan 
} from '@fortawesome/free-solid-svg-icons';

const AdvancedOptionsModal = ({
  show,
  onClose,
  columns,
  sortConfig = [],
  onSortConfigChange,
  visibleColumns = [],
  onVisibleColumnsChange
}) => {
  const [localSortConfig, setLocalSortConfig] = React.useState([...sortConfig]);
  const [localVisibleColumns, setLocalVisibleColumns] = React.useState([...visibleColumns]);

  const handleSortChange = (colKey) => {
    setLocalSortConfig(prev => {
      const exists = prev.find(s => s.selector === colKey);
      if (exists) {
        return prev.filter(s => s.selector !== colKey);
      } else {
        return [...prev, { selector: colKey, direction: 'asc' }];
      }
    });
  };

  const handleDirectionToggle = (colKey) => {
    setLocalSortConfig(prev =>
      prev.map(s =>
        s.selector === colKey
          ? { ...s, direction: s.direction === 'asc' ? 'desc' : 'asc' }
          : s
      )
    );
  };

  const handleVisibilityChange = (colKey) => {
    setLocalVisibleColumns(prev => {
      const newVisible = prev.includes(colKey)
        ? prev.filter(k => k !== colKey)
        : [...prev, colKey];
      
      setLocalSortConfig(prevSort => 
        prevSort.filter(sort => newVisible.includes(sort.selector))
      );
      
      return newVisible;
    });
  };

  const handleSave = () => {
    onSortConfigChange(localSortConfig);
    onVisibleColumnsChange(localVisibleColumns);
    onClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      size="xl"
      centered
      backdrop="static"
      className="advanced-options-modal"
    >
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="fw-bold">
          <FontAwesomeIcon icon={faSlidersH} className="me-2" />
          Advanced Options
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <div className="row g-4">
          {/* Sorting Section */}
          <div className="col-md-6">
            <div className="sorting-section">
              <h5 className="section-title">
                <FontAwesomeIcon icon={faSort} className="me-2" />
                Sort Columns
              </h5>
              
              {columns.map((col) => (
                <div 
                  key={col.selector}
                  className="option-item"
                >
                  <div className="form-check form-switch me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`sort-${col.selector}`}
                      checked={localSortConfig.some(s => s.selector === col.selector)}
                      onChange={() => handleSortChange(col.selector)}
                      disabled={!localVisibleColumns.includes(col.selector)}
                    />
                  </div>
                  
                  <label 
                    htmlFor={`sort-${col.selector}`}
                    className="option-label"
                  >
                    {col.name}
                  </label>
                  
                  {localSortConfig.some(s => s.selector === col.selector) && (
                    <button
                      className="direction-btn"
                      onClick={() => handleDirectionToggle(col.selector)}
                    >
                      <FontAwesomeIcon 
                        icon={localSortConfig.find(s => s.selector === col.selector)?.direction === 'asc' 
                          ? faArrowUp 
                          : faArrowDown} 
                        className="me-1" 
                      />
                      {localSortConfig.find(s => s.selector === col.selector)?.direction === 'asc' 
                        ? 'Asc' 
                        : 'Desc'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Visibility Section */}
          <div className="col-md-6">
            <div className="visibility-section">
              <h5 className="section-title">
                <FontAwesomeIcon icon={faEye} className="me-2" />
                Visible Columns
              </h5>
              
              {columns.map((col) => (
                <div 
                  key={col.selector}
                  className="option-item"
                >
                  <div className="form-check form-switch me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`visible-${col.selector}`}
                      checked={localVisibleColumns.includes(col.selector)}
                      onChange={() => handleVisibilityChange(col.selector)}
                    />
                  </div>
                  
                  <label 
                    htmlFor={`visible-${col.selector}`}
                    className="option-label"
                  >
                    {col.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <button
          className="btn-cancel"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faBan} className="me-2" />
          Cancel
        </button>
        
        <button
          className="btn-save"
          onClick={handleSave}
        >
          <FontAwesomeIcon icon={faSave} className="me-2" />
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdvancedOptionsModal;
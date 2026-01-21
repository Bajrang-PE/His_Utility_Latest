import { useState } from 'react';
import { Slider } from 'antd-v5';
//eslint-disable-next-line
import { AnimatePresence, motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Dropdown } from '../dragdrop/FormElements';
import IconLibrary from '../../components/IconLibrary';
import { DraggableItem } from '../dragdrop/FlexiLayoutDnD/DraggableItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const kpiCraftingComponents = [
  { label: 'Heading', value: 'heading' },
  { label: 'Description', value: 'desc' },
];

const directionOptions = [
  { label: '135deg (Default)', value: '135deg' },
  { label: 'To Right', value: 'to right' },
  { label: 'To Left', value: 'to left' },
  { label: 'To Bottom', value: 'to bottom' },
  { label: 'To Top', value: 'to top' },
  { label: '45deg', value: '45deg' },
];

export default function KPIControlPanel({
  dispatch,
  styles,
  selectedComponent,
  setSelectedComponent,
  widgitData,
  setDroppedItems,
  kpiState,
  kpiDispatch,
  setSelectedIcon,
}) {
  const [openControls, setOpenControls] = useState({
    startColor: false,
    endColor: false,
    hoverStartColor: false,
    hoverEndColor: false,
    direction: false,
  });

  const toggleControl = (controlName) => {
    setOpenControls((prev) => ({
      ...prev,
      [controlName]: !prev[controlName],
    }));
  };

  // Destructure colors and states from kpiState
  const { color1, color2, hoverColor1, hoverColor2, direction, hoverActive } =
    kpiState;

  const onBorderRadiusChange = (val) => {
    dispatch({
      type: 'UPDATE_STYLE',
      payload: { key: 'borderRadius', value: val },
    });
  };

  function handleDeleteComponent() {
    setDroppedItems((prev) =>
      prev.filter((item) => item.id !== selectedComponent.id)
    );
    setSelectedComponent({});
  }

  function handleFontsizeChange(val) {
    setDroppedItems((prev) =>
      prev.map((item) => {
        if (selectedComponent.type === 'icon') {
          return item.id === selectedComponent.id
            ? { ...item, size: val }
            : item;
        }
        return item.id === selectedComponent.id
          ? { ...item, fontSize: val }
          : item;
      })
    );
    selectedComponent.type === 'icon'
      ? setSelectedComponent((prev) => ({ ...prev, size: val }))
      : setSelectedComponent((prev) => ({ ...prev, fontSize: val }));
  }

  function handleColorChange(val) {
    setDroppedItems((prev) =>
      prev.map((item) =>
        item.id === selectedComponent.id ? { ...item, color: val } : item
      )
    );
    setSelectedComponent((prev) => ({ ...prev, color: val }));
  }

  // Update colors via dispatch
  const setColor1 = (val) => kpiDispatch({ type: 'SET_COLOR1', payload: val });
  const setColor2 = (val) => kpiDispatch({ type: 'SET_COLOR2', payload: val });
  const setHoverColor1 = (val) =>
    kpiDispatch({ type: 'SET_HOVER_COLOR1', payload: val });

  const setHoverColor2 = (val) =>
    kpiDispatch({ type: 'SET_HOVER_COLOR2', payload: val });

  const setHoverActive = (val) =>
    kpiDispatch({ type: 'SET_HOVER_ACTIVE', payload: val });

  const onDirectionChange = (e) => {
    kpiDispatch({ type: 'SET_DIRECTION', payload: e.target.value });
  };

  return (
    <>
      <h2 className="Kpi__container--guideline-heading">
        Use Double Click To Edit Components In KPI
      </h2>
      <div className="Kpi__container--panel">
        <div className="Kpi__container--controls">
          <div style={{ marginBottom: '2rem' }}>
            <p className="Kpi__container--controls-text">KPI Border Radius</p>
            <Slider
              className="Kpi--slider"
              min={0}
              max={50}
              value={styles.borderRadius}
              onChange={onBorderRadiusChange}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <p className="Kpi__container--controls-text">KPI Color</p>
            <div style={{ padding: '0 1rem' }}>
              {/* Start Color */}
              <p
                className="Kpi__container--controls-link"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleControl('startColor')}
              >
                Start Color
              </p>
              <AnimatePresence>
                {openControls.startColor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', marginTop: '1rem' }}
                    transition={{ duration: 0.3 }}
                  >
                    <HexColorPicker color={color1} onChange={setColor1} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* End Color */}
              <p
                className="Kpi__container--controls-link"
                style={{ cursor: 'pointer', marginTop: '1rem' }}
                onClick={() => toggleControl('endColor')}
              >
                End Color
              </p>
              <AnimatePresence>
                {openControls.endColor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', marginTop: '1rem' }}
                    transition={{ duration: 0.3 }}
                  >
                    <HexColorPicker color={color2} onChange={setColor2} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Blend Direction */}
              <p
                className="Kpi__container--controls-link"
                style={{ cursor: 'pointer', marginTop: '1rem' }}
                onClick={() => toggleControl('direction')}
              >
                Blend Direction
              </p>
              <AnimatePresence>
                {openControls.direction && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dropdown
                      options={directionOptions}
                      value={direction}
                      onChange={onDirectionChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div
          className={
            hoverActive === 'inactive'
              ? 'Kpi__container--controls disable__card'
              : 'Kpi__container--controls'
          }
        >
          <div style={{ marginBottom: '2rem' }}>
            <div className="Kpi__container--controls-hover__container">
              <p
                style={{ marginBottom: 0 }}
                className="Kpi__container--controls-text"
              >
                Hover Effects
              </p>
              <div className="Kpi__container--controls-hover__container--toggler">
                <div
                  className={`Kpi__container--controls-hover__container--toggler-switch ${hoverActive === 'active' ? 'hover-active' : ''}`}
                  onClick={() => setHoverActive('active')}
                >
                  Active
                </div>
                <div
                  className={`Kpi__container--controls-hover__container--toggler-switch ${hoverActive === 'inactive' ? 'hover-inactive' : ''}`}
                  onClick={() => setHoverActive('inactive')}
                >
                  Inactive
                </div>
              </div>
            </div>
            {hoverActive === 'active' && (
              <div style={{ padding: '0 1rem', marginTop: '2rem' }}>
                <p className="Kpi__container--controls-text">KPI Color</p>
                {/* Start Color */}
                <p
                  className="Kpi__container--controls-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleControl('hoverStartColor')}
                >
                  Start Color
                </p>
                <AnimatePresence>
                  {openControls.hoverStartColor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginTop: '1rem' }}
                      transition={{ duration: 0.3 }}
                    >
                      <HexColorPicker
                        color={hoverColor1}
                        onChange={setHoverColor1}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* End Color */}
                <p
                  className="Kpi__container--controls-link"
                  style={{ cursor: 'pointer', marginTop: '1rem' }}
                  onClick={() => toggleControl('hoverEndColor')}
                >
                  End Color
                </p>
                <AnimatePresence>
                  {openControls.hoverEndColor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginTop: '1rem' }}
                      transition={{ duration: 0.3 }}
                    >
                      <HexColorPicker
                        color={hoverColor2}
                        onChange={setHoverColor2}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
        <div className="Kpi__container--controls">
          <div style={{ marginBottom: '2rem' }}>
            <p className="Kpi__container--controls-text">KPI Icon</p>
            <div style={{ padding: '0 1rem' }}>
              <IconLibrary setSelectedIcon={setSelectedIcon} />
            </div>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <p className="Kpi__container--controls-text">Components For KPI</p>
            <div style={{ padding: '0 1rem' }}>
              {kpiCraftingComponents.map((item, index) => (
                <DraggableItem
                  key={index}
                  id={`${item.label}-${index}`}
                  label={item.label}
                  data={item.value}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="Kpi__container--controls-text">
              Data Returned By Your SQL :
            </p>
            <div style={{ padding: '0 1rem' }}>
              {widgitData.map((item, index) =>
                Object.entries(item).map(([key, value]) => (
                  <DraggableItem
                    key={`${key}-${index}`}
                    id={`${key}-${index}`}
                    label={key}
                    data={value}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        {Object.keys(selectedComponent).length > 0 && (
          <div className="Kpi__container--droppedItems_panel">
            <div style={{ marginBottom: '2rem' }}>
              <p className="Kpi__container--controls-text">Configure Items</p>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ padding: '0 1rem' }}>
                  <p className="Kpi__container--controls-text">
                    Font Size For{' '}
                    {selectedComponent.type === 'icon'
                      ? selectedComponent.iconName.replace('fa', '')
                      : selectedComponent.text}
                  </p>
                  <Slider
                    className="Kpi--slider"
                    min={14}
                    max={200}
                    value={
                      selectedComponent.type === 'icon'
                        ? selectedComponent.size
                        : selectedComponent.fontSize
                    }
                    onChange={handleFontsizeChange}
                  />
                </div>
                <div style={{ padding: '0 1rem' }}>
                  <p className="Kpi__container--controls-text">
                    Font Color For {selectedComponent.text}
                  </p>
                  <HexColorPicker
                    value={selectedComponent.color}
                    onChange={handleColorChange}
                  />
                </div>
              </div>
              <button
                className="Kpi__container--droppedItems-delete"
                onClick={handleDeleteComponent}
              >
                Delete Item &nbsp;
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

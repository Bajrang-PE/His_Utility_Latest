import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  graphGuidelines,
  graphPlugins,
  WidgitGraphOptions,
  WidgitOptions,
} from '../../../../Api/dashboardSettings';
import { Dropdown, InputField } from '../../../dragdrop/FormElements';
import Guidelines from '../../../Guidelines';
//eslint-disable-next-line
import { motion, AnimatePresence, easeInOut } from 'framer-motion';

const WidgitType = React.memo(
  // forwardRef((props) => {
  forwardRef((props, ref) => {
    const { handleValueChange, handleRadioChange, radioValues, values, setValues, singleData, rows, setRows, procedureRows, setProcedureRows, errors, setErrors, dt } = props;

    const [widgitName, setWidgitName] = useState(values?.widgetNameDisplay);
    const [isNameVisible, setIsNameVisible] = useState(radioValues?.isWidgetNameVisible);
    const [selectedWidgit, setSelectedWidgit] = useState(radioValues?.widgetViewed);

    useImperativeHandle(ref, () => ({
      getValue: () => [widgitName, selectedWidgit, isNameVisible, graphDetails],
    }));

    //prettier-ignore

    const [graphDetails, setGraphDetails] = useState({
      isSelected: false,
      graphLib: values?.defaultPluginName || 'highchart',
      type: 'column',
    });


    function handleWidgitStyleChange(e) {
      const widgitType = e.target.value;
      setSelectedWidgit(widgitType);

      const ele = {
        target: {
          name: "widgetViewed",
          value: widgitType,
          type: "",
          checked: ""
        }
      }

      if (widgitType === 'Graph') {
        setGraphDetails((prev) => ({
          ...prev,
          isSelected: true,
        }));
        handleRadioChange(ele);
      } else {
        setGraphDetails((prev) => ({
          ...prev,
          isSelected: false,
        }));
        handleRadioChange(ele);
      }
    }

    function handleGraphDetailsChange(e) {
      const widgitType = e.target.value;

      setGraphDetails((prev) => ({
        ...prev,
        type: widgitType,
      }));
    }

    return (
      <>
        {/* <p className="widgitMaster__type">Widgit Styles</p> */}
        <div className="widgitMaster__config">
          <Dropdown
            label="Widgit Type"
            options={WidgitOptions}
            value={selectedWidgit}
            onChange={handleWidgitStyleChange}
          />
          <InputField
            label="Widgit Name"
            value={widgitName}
            fieldType={'text'}
            onChange={(e) => { setWidgitName(e.target.value); handleValueChange(e); }}
            name={'widgetNameDisplay'}
          />
          <Dropdown
            label="Widgit Name Visible?"
            options={[
              { label: 'True', value: 'Yes' },
              { label: 'False', value: 'No' },
            ]}
            value={isNameVisible}
            onChange={(e) => { setIsNameVisible(e.target.value); handleRadioChange({ target: { name: "isWidgetNameVisible", value: e.target.value, type: "", checked: "" } }) }}
          />

          {(graphDetails.isSelected || selectedWidgit === "Graph") && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: easeInOut, delay: 0.3 }}
              >
                <Guidelines
                  heading={'Guidelines for Creating Graphs'}
                  guideLines={graphGuidelines}
                />
              </motion.div>

              <div className="widgitMaster__graph">
                <Dropdown
                  label="Graph Library"
                  options={graphPlugins}
                  value={graphDetails.graphLib}
                  onChange={(e) => {
                    setGraphDetails((prev) => {
                      return { ...prev, graphLib: e.target.value };
                    });
                    const ele = {
                      target: {
                        name: "defaultPluginName",
                        value: e.target.value,
                      }
                    }
                    handleValueChange(ele);
                  }}
                />
              </div>
            </>
          )}

        </div>
      </>
    );
  })
);

export default WidgitType;

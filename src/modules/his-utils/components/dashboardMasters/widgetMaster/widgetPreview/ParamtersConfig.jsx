import React, { useContext, useEffect, useState } from 'react';
import DnDContainer from '../../../DragDrop';
import { Dropdown } from '../../../dragdrop/FormElements';
import { fetchAllParameters } from '../../../../Api/widgitMaster';
import useLoader from '../../../../hooks/useLoader';
import { checkDuplicates } from '../../../../App/commonFunction';
import { ErrorNotification } from '../../../Guidelines';
import useSQLEditor from '../../../../hooks/useSQLEditor';
import { MiniTable } from './ParameterAppendix';
//eslint-disable-next-line
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { HISContext } from '../../../../contextApi/HISContext';

const ParametersConfig = React.memo(
  ({
    isParameterRequired,
    onChange,
    parametersData,
    setParametersData,
    rightItems,
    setRightItems,
    setPreviewVisibility,
    handleRadioChange
  }) => {
    const [savedParameterNames, setSavedParameterNames] = useState([]);
    const [parameterAppendix, setParameterAppendix] = useState([]);
    const [includeCols, setIncludeCols] = useState([]);
    const [duplicateConditions, setDuplicateCondition] = useState([]);

    const { parameterDrpData } = useContext(HISContext);

    //Loader
    // const { showLoader, hideLoader } = useLoader();

    //eslint-disable-next-line
    const { sqlRef, setIsVisible } = useSQLEditor();

    function handleChange(e) {
      const isRequired = e.target.value;
      const ele = {
        target: {
          name: "isParameterReq",
          value: isRequired,
          type: "",
          checked: ""
        }
      }
      onChange(isRequired);
      handleRadioChange(ele)

      if (!isRequired) return;

      // getParameterList();
      setRightItems([]);
    }

    useEffect(() => {
      if (isParameterRequired === "Yes") {
        const data = parameterDrpData;
        setParametersData(data);

        const updatedParameters = data.map((item, index) => ({
          id: item?.value?.toString(),
          label: item?.label,
        }));

        setSavedParameterNames(updatedParameters);
        // hideLoader();
      }

    }, [isParameterRequired])

    // async function getParameterList() {
    //   // showLoader('Getting Parameter List');
    //   // const response = await fetchAllParameters();

    //   // if (!response) return;

    //   const data = parameterDrpData;
    //   setParametersData(data);

    //   const updatedParameters = data.map((item, index) => ({
    //     id: item?.value?.toString(),
    //     label: item?.label,
    //   }));

    //   setSavedParameterNames(updatedParameters);
    //   hideLoader();
    // }

    //Effects
    useEffect(() => {
      setIncludeCols([]);

      if (rightItems.length === 0) return;

      let dataArray = [];
      let appendixArray = [];

      rightItems.map((data, index) => {
        const columnName = data.label;

        const details = parameterDrpData.find((data) => {
          return data.label === columnName;
        });
        // const columnSelectedAsKey = details?.lt_json?.paramterColumns?.value;
        const columnSelectedAsKey = details?.value?.toString();

        setIncludeCols((prev) => {
          return [...prev, columnSelectedAsKey.concat(`#${'Para' + index}`)];
        });
        dataArray.push(columnSelectedAsKey);
        appendixArray.push({
          name: columnName,
          value: columnSelectedAsKey.concat(`#${'Para' + index}`),
        });
      });

      const duplicates = checkDuplicates(dataArray);

      const appendixTable = appendixArray.map((data) => {
        const [col1, col2] = data.value.split('#');
        return { col1, col2, name: data.name };
      });

      setParameterAppendix(appendixTable);
      setDuplicateCondition(duplicates);
      setIsVisible(duplicates.length === 0);

      //eslint-disable-next-line
    }, [rightItems, parametersData]);

    return (
      <div className="widgitMaster__paramConfig">
        <Dropdown
          label="Paramerter Required"
          options={[
            { label: 'No', value: 'No' },
            { label: 'Yes', value: 'Yes' },
          ]}
          value={isParameterRequired}
          onChange={handleChange}
        />

        {isParameterRequired === "Yes" && savedParameterNames.length > 0 && (
          <>
            <DnDContainer
              rightItems={rightItems}
              setRightItems={setRightItems}
              items={savedParameterNames}
              dragDropTitle={
                'Drag Parameters From Left To Right To Add In Your Widgit'
              }
              setPreviewVisibility={setPreviewVisibility}
            />

            {includeCols.length > 0 && duplicateConditions.length === 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: easeInOut, delay: 0.1 }}
                >
                  <h4 className="widgitMaster__paramConfig--warning">
                    Parameter Appendix Table (Please refer for widgit query)
                  </h4>
                  <MiniTable data={parameterAppendix} />
                </motion.div>
              </>
            )}
            {duplicateConditions.length > 0 && (
              <ErrorNotification
                errors={[
                  `Selected Parameters have common columns ${duplicateConditions.join(' , ')}, setting up these parameters in widgit will result in error as system can't figure out which parameter to map for one common column`,
                ]}
              />
            )}
          </>
        )}
      </div>
    );
  }
);

export default ParametersConfig;

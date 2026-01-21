import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PrimaryButton } from '../../../Buttons';
import { widgitConfigOptions } from '../../../../Api/dashboardSettings';
import { InputField, Label } from '../../../dragdrop/FormElements';
import { useDispatch, useSelector } from 'react-redux';
import TabComponent from '../../../Tabs';
import ComboBuilder from '../../../ComboBuilder';

import useSQLEditor from '../../../../hooks/useSQLEditor';
import ParametersConfig from './ParamtersConfig';
import WidgitType from './WidgitType';
import SQLEditor from '../../../SQLEditor';
import { SuccessAlert, WarningAlert } from '../../../../App/commonFunction';
import WidgitPreview from './WidgitPreview';
import {
  setSQL,
  setWidgitType,
  setGraphDetails
} from '../../../../Features/WidgitEngine/WidgitViewerSlice';
import { useNavigate } from 'react-router-dom';
import useLoader from '../../../../hooks/useLoader';
import { saveDataToDB } from '../../../../Api/databaseService';
import { setAttachedParentID } from '../../../../Features/Drilldown/drilldownSlice';
import { HISContext } from '../../../../contextApi/HISContext';

const WidgitMaster = React.memo((props) => {

  const { handleValueChange, handleRadioChange, radioValues, values, setValues, singleData, rows, setRows, procedureRows, setProcedureRows, errors, setErrors, dt, selectedOptions, setSelectedOptions } = props;

  const { widgetGraphPreviewData, setWidgetGraphPreviewData, actionMode } = useContext(HISContext);

  //Global Redux States
  const activeTab = useSelector((state) => state.tab.activeIndex);
  const graphData = useSelector((state) => state.widgitViewer.graphComposition);
  const kpiData = useSelector((state) => state.widgitViewer.kpiData);
  const dispatch = useDispatch();

  //refs
  const sqlEntered = useRef(null);
  const widgitTypeDataRef = useRef(null);
  const sqlEditorRef = useRef(null);

  //React Router
  const navigate = useNavigate();

  //Loader
  const { showLoader, hideLoader } = useLoader();

  //local states
  const [isParameterRequired, setParameterRequired] = useState(radioValues?.isParameterReq);
  const [parametersData, setParametersData] = useState();
  const [rightItems, setRightItems] = useState(selectedOptions);
  const [previewParametersData, setPreviewParametersData] = useState([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(values?.isPreviewVisible === "Yes" || actionMode === 'edit' || false);


  const [sqlEnteredByUser, setSqlEnteredByUser] = useState('');

  //Contexts States
  const { isVisible, setIsVisible } = useSQLEditor();

  useEffect(() => {
    const dt = rightItems?.length > 0 ? rightItems?.map((data) => ({
      value: data?.id,
      label: data?.label
    })) : [];
    setSelectedOptions(dt);
  }, [rightItems])


  //effects
  useEffect(() => {
    if (activeTab === 'SQL Editor') {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    //eslint-disable-next-line
  }, [activeTab]);

  // async function handleSave() {
  //   const widgitTypeArray = widgitTypeDataRef.current?.getValue();
  //   const widgitName = widgitTypeArray?.at(0);
  //   const widgitType = widgitTypeArray?.at(1);
  //   const isNameVisible = widgitTypeArray?.at(2);

  //   if (!validateThings(sqlEnteredByUser, widgitType, widgitName)) return;
  //   const jsonData = {
  //     widgitType,
  //     bindedParameters: rightItems,
  //     widgitQuery: sqlEnteredByUser,
  //     isNameVisible,
  //   };
  //   if (widgitType === 'Graph') {
  //     const graphType = widgitTypeArray?.at(3);
  //     jsonData.graphLib = graphType?.graphLib;
  //     jsonData.graphData = graphData;
  //   }

  //   if (widgitType === 'KPI') {
  //     jsonData.kpiData = kpiData;
  //   }
  //   const saveData = {
  //     strName: widgitName,
  //     strType: 'Widgit',
  //     ltJson: jsonData,
  //     drilldownIDs: {},
  //     dependsOn: 'NA',
  //   };

  //   showLoader('Saving Your Widgit');
  //   const response = await saveDataToDB(saveData);
  //   hideLoader();
  //   if (response?.status === 1) {
  //     SuccessAlert('Widgit Saved Successfully!');
  //     //Go back to settings page after data is saved successfully
  //     navigate(-1);
  //   }
  // }

  useEffect(() => {
    if (actionMode === 'edit') {
      dispatch(setSQL(values?.query[0]?.mainQuery));
      const gdata = {
        "isSelected": false,
        "graphLib": "highchart",
        "type": "column"
      }
      dispatch(setWidgitType(radioValues?.widgetViewed));
      dispatch(setGraphDetails(gdata));
    }
  }, [actionMode])

  function handleShowPreview() {
     setIsPreviewVisible(false);
    dispatch(setAttachedParentID(null));
    const widgitTypeArray = widgitTypeDataRef.current?.getValue();
    const selectedWidgit = widgitTypeArray?.at(1);
    const widgitName = widgitTypeArray?.at(0);
    const graphData = widgitTypeArray?.at(3);


    // const sql = String(sqlEditorRef.current.getValue());
    // const formattedSql = sql.replace(/\r?\n/g, '\r\n');

    if (!validateThings(values?.query[0]?.mainQuery, selectedWidgit, widgitName)) return;

    const filteredData = [];

    rightItems.map((selectedParams) => {
      filteredData.push(
        ...parametersData.filter(
          (data) => data?.value == selectedParams?.id
        )
      );
    });

    //Update local state
    setPreviewParametersData(filteredData);
    setIsPreviewVisible(true);
    const ele = {
      target: {
        name: "isPreviewVisible",
        value: "Yes",
      }
    }
    handleValueChange(ele);
    setSqlEnteredByUser(values?.query[0]?.mainQuery);

    //Update Global Redux state
    dispatch(setSQL(values?.query[0]?.mainQuery));
    dispatch(setWidgitType(selectedWidgit));
    dispatch(setGraphDetails(graphData));

    setWidgetGraphPreviewData({
      "chartColorsPreview": {},
      "chartTypesPreview": {},
      "selectedXAxisPreview": [],
      "selectedYAxisPreview": [],
    })
  }

  function validateThings(sql, selectedWidgit, widgitName) {
    if (sql === '') {
      WarningAlert('Improper SQL', 'Please enter valid sql before proceeding!');
      return false;
    }

    if (selectedWidgit?.trim() === '') {
      WarningAlert(
        'Improper Widgit Type',
        'Please select proper widgit type before proceeding!'
      );
      return false;
    }

    if (!widgitName || widgitName === '') {
      WarningAlert(
        'Improper Widgit Name',
        'Please enter proper widgit name before proceeding!'
      );
      return false;
    }
    if (isParameterRequired === "yes" && rightItems.length === 0) {
      WarningAlert(
        'Invalid Parameter Mapping',
        'Please map proper parameters before proceeding or Select NO in Parameter Required Option'
      );
      return false;
    }

    if (isParameterRequired === "Yes" && !sql?.includes('#PARA#')) {
      WarningAlert(
        'Improper SQL',
        'Please include parameters which you mapped in you sql query or Select NO in Parameter Required Option'
      );
      return false;
    }

    return true;
  }

  return (
    <div className="widgitMaster">
      <WidgitType ref={widgitTypeDataRef} handleValueChange={handleValueChange} handleRadioChange={handleRadioChange} radioValues={radioValues} values={values} setValues={setValues} singleData={singleData} errors={errors} setErrors={setErrors} {...{ rows, setRows, procedureRows, setProcedureRows }} dt={dt} />
      <ParametersConfig
        isParameterRequired={isParameterRequired}
        onChange={setParameterRequired}
        parametersData={parametersData}
        setParametersData={setParametersData}
        rightItems={rightItems}
        setRightItems={setRightItems}
        setPreviewVisibility={setIsPreviewVisible}
        handleRadioChange={handleRadioChange}
      />
      <WidgitConfiguration
        activeTab={activeTab}
        isVisible={isVisible}
        sqlEditorRef={sqlEditorRef}
        setValues={setValues}
        values={values}
      />

      {isVisible && (
        <div className="widgitMaster__controlBox">
          <PrimaryButton
            buttonText="Show Preview"
            handler={handleShowPreview}
          />
        </div>
      )}
      {isPreviewVisible && (
        <>
          <WidgitPreview
            isParameterRequired={isParameterRequired}
            paramData={previewParametersData}
            widgitName={widgitTypeDataRef.current?.getValue()?.at(0)}
            isNameVisible={widgitTypeDataRef.current?.getValue()?.at(2)}
          />
          {/* <div className="widgitMaster__controlBox">
            <PrimaryButton buttonText="Save Widgit" handler={handleSave} />
          </div> */}
        </>
      )}
    </div>
  );

})

export default WidgitMaster

const WidgitConfiguration = React.memo(function WidgitConfiguration({
  activeTab,
  isVisible,
  sqlEditorRef,
  setValues,
  values
}) {

  function Procedure() {
    const [procName, setProcName] = useState('');

    return (
      <>
        <Label labelText={'Enter Procedure Name To Execute'} />
        <InputField
          label={false}
          value={procName}
          fieldType={'text'}
          onChange={(e) => setProcName(e.target.value)}
        />
      </>
    );
  }

  return (
    <>
      <p className="widgitMaster__type">Widgit Config</p>
      <TabComponent options={widgitConfigOptions} />

      {activeTab === 'Procedure' && isVisible && (
        <>
          <Procedure />
          <ComboBuilder
            optionLable="Input Variable Name"
            optionValue="Input Variable Value"
          />
        </>
      )}

      {activeTab === 'SQL Editor' && isVisible && (
        <>
          <Label labelText="Write SQL For Your Widgit" />
          <div className="widgitMaster__sqlEditor">
            <SQLEditor ref={sqlEditorRef} setValues={setValues} values={values} />
          </div>
        </>
      )}
    </>
  );
});


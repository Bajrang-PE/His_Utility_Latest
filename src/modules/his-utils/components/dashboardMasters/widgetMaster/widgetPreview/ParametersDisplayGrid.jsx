import { useEffect, useState } from 'react';
import useLoader from '../../../../hooks/useLoader';
import { useDispatch } from 'react-redux';
import { executeParamSQL } from '../../../../Api/parameterMaster';
import { setParamValues } from '../../../../Features/WidgitEngine/WidgitViewerSlice';
import { Dropdown } from '../../../dragdrop/FormElements';

export default function ParameterGrid({
  paramData,
  containerClass = 'parameters__grid',
  childClass = 'parameters__grid--item-para',
}) {
  const { showLoader, hideLoader } = useLoader();
  const [optionsMap, setOptionsMap] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (!paramData || paramData.length === 0) return;

    let initialStateMap = {};
    const newOptionsMap = {};

    const fetchAllOptions = async () => {
      showLoader('Building Parameters');

      paramData.forEach((item, i) => {
        const key = `Para${i}`;
        initialStateMap[key] = '';
      });

      await Promise.all(
        paramData.map(async (item) => {
          const sql = item?.lt_json?.parameterQuery;
          if (!sql) return;

          const res = await executeParamSQL(sql);
          if (res?.data) {
            newOptionsMap[item.str_name] = res.data.map((row) => ({
              label: row[item?.lt_json?.paramterColumns?.label],
              value: row[item?.lt_json?.paramterColumns?.value],
            }));
          }
        })
      );

      setOptionsMap(newOptionsMap);
      dispatch(setParamValues(initialStateMap));
      hideLoader();
    };

    fetchAllOptions();
  }, [JSON.stringify(paramData)]);

  return (
    <div className={containerClass}>
      {paramData.map((item, index) => {
        return (
          <ParameterGridItem
            item={item}
            key={index}
            itemKey={index}
            options={optionsMap[item.str_name] || []}
            cssClass={childClass}
          />
        );
      })}
    </div>
  );
}

function ParameterGridItem({ item, options, itemKey, cssClass }) {
  const key = `Para${itemKey}`;
  const [selectedValue, setSelectedValue] = useState({ [key]: '' });
  const dispatch = useDispatch();

  function handleValueChange(e) {
    dispatch(setParamValues({ [key]: e.target.value }));

    setSelectedValue((prev) => {
      return { ...prev, [key]: e.target.value };
    });
  }

  return (
    <>
      <p className={cssClass}>{item?.str_name}</p>
      <Dropdown
        options={options}
        value={selectedValue[key]}
        onChange={handleValueChange}
      />
    </>
  );
}

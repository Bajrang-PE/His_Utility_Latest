import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { executeParamSQL } from '../../Api/parameterMaster';
import { setParamValues } from '../../Features/WidgitEngine/WidgitViewerSlice';
import { Dropdown } from '../FormElements';
import { CustomGrid } from '../tabMaster/TabLayoutWrapper';
// import { CustomGrid } from '../TabMaster/TabLayoutWrapper';

export default function Parameters({
  children,
  gridLayout,
  paramData,
  cssClass,
}) {
  // const { showLoader, hideLoader } = useLoader();
  const [optionsMap, setOptionsMap] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (!paramData || paramData.length === 0) return;

    let initialStateMap = {};
    const newOptionsMap = {};

    const fetchAllOptions = async () => {
      // showLoader('Building Parameters');

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
      // hideLoader();
    };

    fetchAllOptions();
  }, [JSON.stringify(paramData)]);

  return (
    <CustomGrid
      layout={gridLayout}
      cssClass={[cssClass?.at(1), cssClass?.at(2)]}
    >
      {paramData.map((data, index) => (
        <ParameterGridItem
          item={data}
          key={data.str_name}
          itemKey={index}
          options={optionsMap[data.str_name] || []}
          cssClass={cssClass?.at(0)}
        />
      ))}
      {children}
    </CustomGrid>
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

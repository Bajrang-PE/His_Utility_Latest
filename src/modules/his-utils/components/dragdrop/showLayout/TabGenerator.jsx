import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { themeClasses } from '../dashboardSettings';
import Parameters from './Parameters';
import { setWidgitStyle } from '../../../Features/WidgitEngine/WidgitViewerSlice';

export default function TabGenerator() {
  let gridLayout = [];

  //Redux States
  const tabData = useSelector((state) => state.tab.tabData);
  const dispatch = useDispatch();

  //Derived State
  const currentLayout = tabData?.lt_json?.tabLayout;
  const selectedStyle = tabData?.lt_json?.tabTheme;

  const [paramsStateData, setParamsData] = useState(
    tabData?.lt_json?.bindedParameters
  );
  const [widgitStateData, setWidgitData] = useState(
    tabData?.lt_json?.bindedWidgits
  );

  const gridStyles = useRef(themeClasses.minimalistic);

  //Normal Vars
  let theme = [];

  switch (selectedStyle) {
    case 'minimalistic':
      theme = [
        'minimalistic__grid-item',
        'minimalistic__background',
        'minimalistic__grid',
      ];
      dispatch(
        setWidgitStyle([
          'minimalistic__grid-widgit-wrapper',
          'minimalistic__grid-widgit-wrapper--table',
        ])
      );
      gridStyles.current = themeClasses.minimalistic;
      break;
    case 'frostWhite':
      theme = [
        'frostWhite__grid-item',
        'frostWhite__background',
        'frostWhite__grid',
      ];
      dispatch(
        setWidgitStyle([
          'frostWhite__grid-widgit-wrapper',
          'frostWhite__grid-widgit-wrapper--table',
        ])
      );
      gridStyles.current = themeClasses.frostWhite;
      break;
    case 'blackGold':
      theme = [
        'blackGold__grid-item',
        'blackGold__background',
        'blackGold__grid',
      ];
      dispatch(
        setWidgitStyle([
          'blackGold__grid-widgit-wrapper',
          'blackGold__grid-widgit-wrapper--table',
        ])
      );
      gridStyles.current = themeClasses.blackGold;
      break;
    case 'emeraldGreen':
      theme = [
        'emeraldGreen__grid-item',
        'emeraldGreen__background',
        'emeraldGreen__grid',
      ];
      dispatch(
        setWidgitStyle([
          'emeraldGreen__grid-widgit-wrapper',
          'emeraldGreen__grid-widgit-wrapper--table',
        ])
      );
      gridStyles.current = themeClasses.emeraldGreen;
      break;
  }

  //building widgits
  widgitStateData.forEach((element) => {
    gridLayout.push(findById(tabData?.lt_json?.tabLayout, element?.str_name));
  });

  //effects
  useEffect(() => {
    dispatch(setPopupData(paramsStateData));
  }, []);

  return (
    <>
      <Parameters
        gridLayout={gridLayout}
        paramData={paramsStateData}
        cssClass={theme}
      >
        {widgitStateData.map((data) => (
          <WidgitGenerator
            key={data.str_name}
            widgitType={data?.lt_json?.widgitType}
            widgitSQL={data?.lt_json?.widgitQuery}
          />
        ))}
      </Parameters>
    </>
  );
}

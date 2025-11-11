import { useCallback, useContext, useEffect, useReducer } from 'react';
import Accordian from '../Accordian';
import axios from 'axios';
import { HISContext } from '../../../contextApi/HISContext';
// import { fetchAllComponents } from '../../Api/tabMaster';
// import useLoader from '../../Hooks/useLoader';


export default function ComponentList() {

  const { widgetDrpData, getAllWidgetData, getAllParameterData, parameterDrpData } = useContext(HISContext);


  const initialState = [
    {
      title: 'Parameters',
      items: [],
    },
    {
      title: 'widgets',
      items: [],
    }
  ];


  const getComponentDetails = useCallback(async () => {
    // showLoader('Getting Component List');

    // const response = await fetchAllComponents();
    // if (!response) return;

    // const data = response?.data || [];

    // const categoryMap = {
    //   Parameters: new Map(),
    //   Tables: new Map(),
    //   Graphs: new Map(),
    //   KPIs: new Map(),
    //   Maps: new Map(),
    // };

    const categoryMap = {
      Parameters: new Map(),
      widgets: new Map()
    };

    widgetDrpData.forEach((object) => {
      const payload = {
        str_name: object?.label,
        // lt_json: object?.lt_json,
        str_type: 'Widgit',
        str_id: object?.value
      };
        categoryMap.widgets.set(payload.str_name, payload);

    });

    parameterDrpData.forEach((object) => {
      const payload = {
        str_name: object?.label,
        // lt_json: null,
        str_type: 'Parameter',
        str_id: object?.value
      };
        categoryMap.Parameters.set(payload.str_name, payload);

    });

    Object.entries(categoryMap).forEach(([type, nameMap]) => {
      nameMap.forEach((value) => {
        dispatcher({ type, payload: value });
      });
    });

    // hideLoader();
  }, []);

  function componentListReducer(state, action) {
    return state.map((section) => {
      if (section.title === action.type) {
        const alreadyExists = section.items.some(
          (item) => item.str_name === action.payload.str_name
        );

        if (alreadyExists) {
          return section;
        }

        return {
          ...section,
          items: [...section.items, action.payload],
        };
      }
      return section;
    });
  }

  const [componentList, dispatcher] = useReducer(
    componentListReducer,
    initialState
  );


  useEffect(() => {
    getComponentDetails();
  }, [getComponentDetails]);

  return (
    <>
      {componentList.map((data, index) => (
        <Accordian data={data.items} label={data.title} key={index} />
      ))}
    </>
  );
}

const dashboardAPI = axios.create({
  baseURL: "/",
  withCredentials: true,
});

export async function fetchAllComponents() {
  const response = await dashboardAPI.get(
    '/api/v1/get-components'
  );

  if (response.data?.status === 0) {
    console.log('Warning', response.data?.message);
    return;
  }

  if (!response.data.status || response.data?.status === -1) {
    console.log(response.message, response.data?.message);
    return;
  }

  return response.data;
}
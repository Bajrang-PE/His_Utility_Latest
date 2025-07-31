import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchPostData } from '../../../utils/HisApiHooks';
import { HISContext } from '../contextApi/HISContext';
import { useContext } from 'react';



//FUNCTION TO MANAGE GLOBAL ALERTS
export const ToastAlert = (message, type) => {
  toast(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    type: type
  });
}

//FUNCTION TO TRANSFORM DATA ACCORDING TO DROPDOWN - TWO COLUMNS
export const DrpDataValLab = (data, col1, col2, isJson) => {
  if (isJson) {
    const result = data?.map((item) => ({
      value: item?.jsonData?.[col1] || "",
      label: item?.jsonData?.[col2] || "",
    }));
    return result;
  } else {
    const result = data?.map((item) =>
      ({ value: item[col1], label: item[col2] })
    )
    return result
  }
}

//FUNCTION TO TRANSFORM DATA ACCORDING TO DROPDOWN - THREE COLUMNS
export const ThreeColDrpData = (data, col1, col2, col3) => {
  const result = data?.map((item) =>
    ({ value: item[col1], label: item[col2], filterID: item[col3] })
  )
  return result
}

export const convertToISODate = (dateStr) => {

  if (!dateStr) return "";
  const months = {
    JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
    JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
  };

  const [day, month, year] = dateStr.split("-");
  const formattedYear = `20${year}`;
  const formattedMonth = months[month?.toUpperCase()];

  return `${formattedYear}-${formattedMonth}-${day}`;
};

export const fetchQueryData = async (queryVO = [], jndiServer, params, pkColumn) => {
  if (!Array.isArray(queryVO) || queryVO.length === 0) {
    console.error("Invalid or empty queryVO array provided.");
    return [];
  }

  try {
    const query = queryVO[0]?.mainQuery;
    if (!query) {
      console.error("No valid query found in queryVO.");
      return [];
    }

    const popupIds = [...query?.matchAll(/#(PK\d+)#/gi)]?.map(match => match[1]);
    const popupIdStr = popupIds?.join(",");

    const requestBody = {
      query, params: {},
      jndi: jndiServer,
      strGroupParaId: params?.strGroupParaId,
      strGroupParaValue: params?.strGroupParaValue,
      popupId: popupIdStr ? popupIdStr : "",
      popupValue: pkColumn ? pkColumn?.toString() : ""
      // popupValue: "22@2020@"
    };
    const response = await fetchPostData("/hisutils/GenericApiQry", requestBody);

    return response?.data || [];
  } catch (error) {
    console.error("Error fetching query data:", error);
    return [];
  }
};

export const fetchProcedureData = async (procedure, params, jndiServer) => {
  if (!procedure) {
    return [];
  }

  try {
    const requestBody = {
      "procedureName": procedure,
      "parameters": params,
      "jndi": jndiServer
    };
    const response = await fetchPostData(`/hisutils/procedures/execute`, requestBody);

    return response?.data || [];
  } catch (error) {
    console.error("Error fetching query data:", error);
    return [];
  }
};

export const fetchLogoAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


export const fetchLocalLogoAsBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = filePath;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const base64String = canvas.toDataURL('image/jpeg').split(',')[1];
      resolve(base64String);
    };

    img.onerror = (err) => reject(`Failed to load image: ${err.message}`);
  });
};


export const formatParams = (allParams, widgetId) => {
  const tabParams = allParams?.tabParams || {};
  const widgetSpecificParams = allParams?.widgetParams?.[widgetId] || {};

  const combinedParams = {
    ...tabParams,
    ...widgetSpecificParams
  };

  if (typeof combinedParams !== 'object' || combinedParams === null || Array.isArray(combinedParams)) {
    return {
      paramsId: "",
      paramsValue: ""
    };
  }

  return {
    paramsId: Object.keys(combinedParams).join(','),
    paramsValue: Object.values(combinedParams).join(',')
  };
};


export const getOrderedParamValues = (query, paramsValues,widgetId) => {
  const paramVal = formatParams(paramsValues ? paramsValues : null, widgetId || '');

  const paramOrder = [];
  const regex = /#PARA#(\d+)#PARA#/g;
  let match;
  while ((match = regex.exec(query)) !== null) {
    // paramOrder.push(match[1]);
     const id = match[1];
    if (!paramOrder.includes(id)) {
      paramOrder.push(id); // Add only if not already included
    }
  }

  const idToValue = {};
  const ids = paramVal?.paramsId.split(',');
  const values = paramVal?.paramsValue.split(',');

  ids.forEach((id, index) => {
    idToValue[id] = values[index];
  });

  // return {
  //   strGroupParaId: Object.keys(idToValue).join(','),
  //   strGroupParaValue: Object.values(idToValue).join(',')
  // };

 const filteredIds = [];
  const filteredValues = [];

  paramOrder.forEach((id) => {
    if (idToValue.hasOwnProperty(id)) {
      filteredIds.push(id);
      filteredValues.push(idToValue[id]);
    }
  });

  return {
    strGroupParaId: filteredIds.join(','),
    strGroupParaValue: filteredValues.join(',')
  };
};


export const formatDate1 = (isoDate) => {
  const dateObject = new Date(isoDate);
  // dateObject.setUTCHours(dateObject.getUTCHours() + dateObject.getTimezoneOffset() / 60);

  const day = dateObject.getUTCDate().toString().padStart(2, '0');
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][dateObject.getUTCMonth()];
  const year = dateObject.getUTCFullYear();
  return `${day}-${month}-${year?.toString()?.slice(-2)}`;
}

export const formatDateFullYear = (isoDate) => {
  const dateObject = new Date(isoDate);
  // dateObject.setUTCHours(dateObject.getUTCHours() + dateObject.getTimezoneOffset() / 60);

  const day = dateObject.getUTCDate().toString().padStart(2, '0');
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][dateObject.getUTCMonth()];
  const year = dateObject.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

export const extractAllPageText = (config = {}) => {
  const {
    includeTags: userIncludeTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'label', 'span', 'button', 'a', 'li', 'th'],
    excludeTags: userExcludeTags = [],
    excludeClasses: userExcludeClasses = [],
    includeClasses: userIncludeClasses = ['card-header-count','apexcharts-title-text','apexcharts-text','rdt_TableCol']
  } = config;

  const texts = new Set();

  const strictExcludeTags = new Set([
    'script', 'style', 'noscript', 'input', 'textarea', 'select', 'option', 'td',
    'canvas', 'svg',
  ]);
  userExcludeTags.forEach(tag => strictExcludeTags.add(tag.toLowerCase()));


  const includeTagsSet = new Set(userIncludeTags.map(tag => tag.toLowerCase()));
  const excludeClassesSet = new Set(userExcludeClasses);
  const includeClassesSet = new Set(userIncludeClasses);

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    // Ensure the text node has a parent element
    const parentElement = node.parentElement;
    if (!parentElement) {
      continue;
    }

    const tagName = parentElement.tagName.toLowerCase();
    const parentClassList = Array.from(parentElement.classList);

    if (strictExcludeTags.has(tagName)) {
      continue;
    }

    let isExcludedByClass = false;
    let currentAncestor = parentElement;
    while (currentAncestor && currentAncestor !== document.body) {
      if (excludeClassesSet.size > 0 && Array.from(currentAncestor.classList).some(cls => excludeClassesSet.has(cls))) {
        isExcludedByClass = true;
        break;
      }
      currentAncestor = currentAncestor.parentElement;
    }
    if (isExcludedByClass) {
      continue;
    }

    let shouldInclude = false;
    if (includeTagsSet.has(tagName) || includeClassesSet.size > 0 && parentClassList.some(cls => includeClassesSet.has(cls))) {
      shouldInclude = true;
    }

    if (shouldInclude) {
      const text = node.textContent.trim();
      if (text && text.length > 1) {
        texts.add(text);
      }
    }
  }

  return Array.from(texts);
};
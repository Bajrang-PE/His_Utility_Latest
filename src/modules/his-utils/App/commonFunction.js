import Swal from 'sweetalert2';

function SuccessAlert(message) {
  Swal.fire({
    icon: 'success',
    title: message,
    customClass: {
      popup: 'global-alert-font',
    },
  });
}
function WarningAlert(title, message) {
  Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    customClass: {
      popup: 'global-alert-font',
    },
  });
}

function FailureAlert(title, message) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    customClass: {
      popup: 'global-alert-font',
    },
  });
}

function checkDuplicates(arrayOfItems) {
  return (
    Object.entries(
      arrayOfItems.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {})
    )
      //eslint-disable-next-line
      .filter(([key, count]) => count > 1)
      .map(([key]) => key)
  );
}

function checkNameForSpecialCharacters(name) {
  const regex = /[^a-zA-Z0-9 ]/; // added space inside the character set
  return regex.test(name);
}

function findById(tabLayout, id) {
  return tabLayout.find((item) => item.i === id);
}

function cleanUpSQL(widgitParams = {}, widgitSQL, pkColsData = {}) {
  const areParamsSupplied = Object.keys(widgitParams).length === 0;
  const arePkColsRequired = Object.keys(pkColsData).length !== 0;


  if (areParamsSupplied && widgitSQL.includes('#PARA#')) {
    return;
  }

  let finalSQL = areParamsSupplied
    ? widgitSQL
    : Object.keys(widgitParams).reduce((acc, key) => {
      return acc.replaceAll(key, widgitParams[key]);
    }, widgitSQL);

  if (finalSQL.includes('#PK') && arePkColsRequired) {
    finalSQL = Object.keys(pkColsData).reduce((acc, key) => {
      return acc.replaceAll(key, pkColsData[key]);
    }, widgitSQL);
  }

  return finalSQL;
}

export {
  SuccessAlert,
  WarningAlert,
  FailureAlert,
  checkDuplicates,
  checkNameForSpecialCharacters,
  findById,
  cleanUpSQL
};

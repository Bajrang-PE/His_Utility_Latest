import { decryptData } from "./SecurityConfig";



export const getAuthUserData = (key) => {
  const sessionData = localStorage.getItem('data');
  const userData = sessionData ? decryptData(sessionData) : '';
  const val = userData[key] || '';
  return val;
}

// Utility function to parse backend date format
export const parseBackendDate = (dateString) => {
  if (!dateString) return new Date();

  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  const parts = dateString.split(' ');
  const dateParts = parts[0].split('-');
  const timeParts = parts[1].split(':');

  return new Date(
    parseInt(dateParts[2]), // year
    months[dateParts[1]],   // month
    parseInt(dateParts[0]), // day
    parseInt(timeParts[0]), // hours
    parseInt(timeParts[1]), // minutes
    parseInt(timeParts[2])  // seconds
  );
};

// Utility function to format date for backend
export const formatDateForBackend = (date) => {
  if (!date || !(date instanceof Date)) return '';

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


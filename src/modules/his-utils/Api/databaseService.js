import axios from 'axios';
import { fetchPostData, fetchUpdateData } from '../../../utils/HisApiHooks';
import { FailureAlert, WarningAlert } from '../App/commonFunction';

export async function testDatabaseConnection(formData) {
  const requestData = {
    hostname: formData.hostname,
    port: formData.port,
    serviceName: formData.serviceName,
    username: formData.userName,
    password: formData.password,
    dbType: formData.currentDB,
  };

  const response = await axios.post(
    'http://10.226.29.202:8025/hisutils/TestDatabaseConnection',
    requestData
  );
  return response.data;
}

export async function saveDatabaseConnection(formData) {
  const requestData = {
    hostname: formData.hostname,
    port: formData.port,
    serviceName: formData.serviceName,
    username: formData.userName,
    password: formData.password,
    dbType: formData.currentDB,
  };

  const response = await axios.put(
    'http://10.226.29.202:8025/hisutils/dashboard-config-save',
    requestData
  );
  return response.data;
}

export async function saveDataToDB(data) {
  const response = await axios.post('http://10.226.29.202:8025/api/v1/save-dashboard', data);

  if (response.data?.status === 0) {
    WarningAlert('Warning', response.data?.message);
    return;
  }

  if (!response.data.status || response.data?.status === -1) {
    FailureAlert(response.message, response.data?.message);
    return;
  }

  return response.data;
}

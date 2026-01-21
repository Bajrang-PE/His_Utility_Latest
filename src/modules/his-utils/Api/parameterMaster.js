import { FailureAlert, WarningAlert } from '../App/commonFunction';
import { fetchPostData } from '../../../utils/HisApiHooks';
import axios from 'axios';

export async function executeParamSQL(sql) {
  const response = await axios.post(
    'http://10.226.29.202:8025/api/v1/preview-parameter',
    {
      sqlQuery: sql,
    }
  );

  if (response.data?.status === 0) {
    WarningAlert('Warning', response.data?.message);
    return [];
  }

  if (!response.data.status || response.data?.status === -1) {
    FailureAlert(response.message, response.data?.message);
    return [];
  }

  return response.data;
}

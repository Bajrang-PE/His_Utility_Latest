import axios from 'axios';
import { decryptAesOrRsa, encryptAesData } from './SecurityConfig';
import { ToastAlert } from '../modules/his-utils/utils/commonFunction';

// const BaseUrl = import.meta.env.VITE_HIS_API_BASE_URL

// const BaseUrl = 'http://10.226.28.17:8024/';  //server
// const BaseUrl = 'http://10.226.25.164:8024/';  //server
// const BaseUrl = 'http://10.226.17.6:8024/';  //server

const apiHis = axios.create({
    baseURL: ''
});

//axios.defaults.baseURL = BaseUrl;

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const getCsrfToken = () => {
    return Cookies.get('csrfToken');
};

const logout = () => {
    localStorage.clear();
    // Cookies.remove('csrfToken');
    window.location.href = "/dvdms/session-expired";
};

// Set the Authorization header globally using an interceptor
apiHis.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        // const CsrfToken = getCsrfToken();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            // config.headers['X-CSRF-TOKEN'] = CsrfToken;

        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiHis.interceptors.response.use(
    async (response) => {
        if (response?.data?.status && response?.data?.status === 401) {
            ToastAlert('Session expired. Please log in again.', 'error');
            // setTimeout(() => {
            //     logout();
            // }, 1000);
        } else {
            return response;
        }
    },
    async (error) => {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401 || status === 403) {
                // Token is expired or unauthorized
                ToastAlert(data?.error, 'error');
                // setTimeout(() => {
                //     logout();
                // }, 1000);

            }
        } else {
            ToastAlert("Authorization Failed!!!!", 'error');
            // setTimeout(() => {
            //     logout();
            // }, 1000);
        }
        // Return the error to allow further handling
        return Promise.reject(error);
    }
);



// export const fetchData = async (url, params) => {
//     try {
//         if (params) {
//             const response = await apiHis.get(url, { params: params ? params : '' });
//             // return response?.data
//             const decryptedData = decryptAesOrRsa(response?.data)
//             return JSON.parse(decryptedData);
//         } else {
//             const response = await apiHis.get(url);
//             const decryptedData = decryptAesOrRsa(response?.data)
//             return JSON.parse(decryptedData);
//             // return response?.data
//         }
//     } catch (error) {
//         console.error('API Error:', error);
//     }
// };

// fetchData.js


export const fetchData = async (url, params = null) => {
    try {
        const response = await apiHis.get(url, { params: params || "" });

        const token = response.headers['authorization'] ||
            response.headers['Authorization'] ||
            response.headers?.get?.('authorization') ||
            response.headers?.get?.('Authorization');

        const decryptedData = decryptAesOrRsa(response?.data);
        const jsonData = JSON.parse(decryptedData);


        if (token) {
            return {
                ...jsonData,
                headers: {
                    authorization: token.replace('Bearer', ''),
                },
            };
        } else {
            return jsonData;
        }


    } catch (error) {
        console.error("Error in fetchData:", error);
        throw error;
    }
};


export const fetchPostData = async (url, data, rtblob, signal) => {
    try {
        if (rtblob) {
            const response = await apiHis.post(url, data, rtblob, { signal });
            //  const decryptedData = decryptAesOrRsa(response?.data)
            //  return JSON.parse(decryptedData);
            return response;
        } else {
            //     const response = await apiHis.post(url, data,{
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // });
            // encodeURIComponent
            const response = await apiHis.post(url, encodeURIComponent(encryptAesData(JSON?.stringify(data))),
                {
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                }
            );
            const decryptedData = decryptAesOrRsa(response?.data)
            return JSON.parse(decryptedData);
            // return response.data;7,18,173
        }

    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};

export const fetchUpdateData = async (url, data) => {
    try {
        const response = await apiHis.put(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }

};

export const fetchUpdatePostData = async (url, data) => {
    try {
        const response = await apiHis.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};

export const fetchDeleteData = async (url, payload) => {
    try {
        const response = await apiHis.delete(url, { data: payload ? payload : '' });
        return response.data;
    } catch (error) {
        console.log('API Error:', error);
        // return error?.response?.data;
    }
};
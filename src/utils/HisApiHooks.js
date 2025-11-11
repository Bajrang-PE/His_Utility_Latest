import axios from 'axios';
import { decryptAesOrRsa, encryptAesData } from './SecurityConfig';
import { ToastAlert } from '../modules/his-utils/utils/commonFunction';

// const BaseUrl = import.meta.env.VITE_HIS_API_BASE_URL

// const BaseUrl = 'http://10.226.28.17:8024/';  //server
// const BaseUrl = 'http://10.226.25.164:8024/';  //server
// const BaseUrl = 'http://10.226.29.102:8024/';  //server

const apiHis = axios.create({
    baseURL: ''
});

//axios.defaults.baseURL = BaseUrl;

const getAccessToken = () => {
    // return localStorage.getItem('accessToken');
    return sessionStorage.getItem('accessToken');
};

const getCsrfToken = () => {
    return Cookies.get('csrfToken');
};

const logout = () => {
    sessionStorage.clear();
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
            ToastAlert("Network Exception!!!", 'error');
            sessionStorage.clear();
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
                ToastAlert("Network Exception!!!", 'error');
                sessionStorage.clear();
                // setTimeout(() => {
                //     logout();
                // }, 1000);

            }
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

        const rawToken = response.headers['authorization'] ||
            response.headers['Authorization'] ||
            response.headers?.get?.('authorization') ||
            response.headers?.get?.('Authorization');

        const decryptedData = decryptAesOrRsa(response?.data);
        const jsonData = JSON.parse(decryptedData);

        // const jsonData = response?.data;

        let token = null;
        if (rawToken) {
            token = rawToken.split(",")[0].trim();
        }

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


// export const fetchPostData = async (url, data, rtblob, signal) => {
//     try {
//         if (rtblob) {
//             const response = await apiHis.post(url, data, rtblob, { signal });
//             //  const decryptedData = decryptAesOrRsa(response?.data)
//             //  return JSON.parse(decryptedData);
//             return response;
//         } else {
//             //     const response = await apiHis.post(url, data,{
//             //     headers: {
//             //         'Content-Type': 'application/json',
//             //     },
//             // });
//             // encodeURIComponent
//             const response = await apiHis.post(url, encodeURIComponent(encryptAesData(JSON?.stringify(data))),
//                 {
//                     headers: {
//                         'Content-Type': 'text/plain',
//                     },
//                 }
//             );
//             const rawToken = response.headers['authorization'] ||
//                 response.headers['Authorization'] ||
//                 response.headers?.get?.('authorization') ||
//                 response.headers?.get?.('Authorization');


//             if (rawToken) {
//                 const token = rawToken.split(",")[0].trim();
//                 const formatToken = token.replace('Bearer', '');
//                 sessionStorage.setItem("accessToken", formatToken);
//             }

//             const decryptedData = decryptAesOrRsa(response?.data);
//             return JSON.parse(decryptedData);
//             // return response.data;
//         }

//     } catch (error) {
//         console.log('API Error:', error);
//         // return error?.response?.data;
//     }
// };

export const fetchPostData = async (url, data, rtblob, options = {}) => {
    try {
        // const { signal } = options;
        
        if (rtblob) {
            // const config = signal ? { signal } : {};
            const config =  {};
            const response = await apiHis.post(url, data, rtblob, config);
            return response;
        } else {
            const requestData = encodeURIComponent(encryptAesData(JSON?.stringify(data)));
            const config = {
                headers: {
                    'Content-Type': 'text/plain',
                },
            };
            
            // Add signal to config if provided
            // if (signal) {
            //     config.signal = signal;
            // }
            
            const response = await apiHis.post(url, requestData, config);

            const rawToken = response.headers['authorization'] ||
                response.headers['Authorization'] ||
                response.headers?.get?.('authorization') ||
                response.headers?.get?.('Authorization');

            if (rawToken) {
                const token = rawToken.split(",")[0].trim();
                const formatToken = token.replace('Bearer', '');
                sessionStorage.setItem("accessToken", formatToken);
            }

            const decryptedData = decryptAesOrRsa(response?.data);
            return JSON.parse(decryptedData);
        }
    } catch (error) {
        // Check if the error is due to abortion
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
            throw error; // Re-throw abort errors so they can be handled by caller
        }
        console.log('API Error:', error);
        throw error; // Re-throw other errors
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
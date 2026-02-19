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

const getCpatToken = () => {
    return sessionStorage.getItem('cpat');
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
        const cpat = getCpatToken();
        if (cpat) {
            config.params = { ...(config.params || {}), cpat };
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
        } else {
            return response;
        }
    },
    async (error) => {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                ToastAlert("Network Exception!!!", 'error');
                sessionStorage.clear();
            }
        }
        return Promise.reject(error);
    }
);


export const fetchData = async (url, params = null) => {
    try {
        // const cpat = getCpatToken();

        // // merge params safely
        // const finalParams = {
        //     ...(params || {}),
        //     ...(cpat ? { cpat } : {}),
        // };
        const response = await apiHis.get(url, { params: params });

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


export const fetchPostData = async (url, data, rtblob) => {
    try {
        // const cpat = getCpatToken();

        // // attach cpat as query param (POST supports this)
        // const configWithCpat = {
        //     params: cpat ? { cpat } : {},
        // };

        if (rtblob) {
            const config = {};
            const response = await apiHis.post(url, data, rtblob, config);
            return response;
        } else {
            const requestData = encodeURIComponent(encryptAesData(JSON?.stringify(data)));
            const config = {
                headers: {
                    'Content-Type': 'text/plain',
                },
                // ...(cpat ? { params: { cpat } } : {}),
            };

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
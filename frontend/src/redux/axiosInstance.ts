import { logoutUser, updateAccessToken } from "./userSlice";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 100000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

const  store  = require("./store");
let dispatch: any;  // переменная для хранения dispatch

export const setDispatch = (newDispatch: any) => {
    dispatch = newDispatch;
};


axiosInstance.interceptors.request.use((config) => {
    console.log("Request:", {
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
        headers: config.headers,
    });

    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`; // Используем обратные кавычки
    }
    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
    (response) => {
        console.log("Response:", {
            url: response.config.url,
            method: response.config.method,
            status: response.status,
            data: response.data,
        });
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        console.log("Error Response:", {
            url: originalRequest.url,
            method: originalRequest.method,
            status: error.response?.status,
            data: error.response?.data,
        });

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}api/token/refresh/`, { refresh: refreshToken });
                    const { access } = response.data;

                    localStorage.setItem("access_token", access);
                    dispatch(updateAccessToken(access));

                    originalRequest.headers = {
                        ...originalRequest.headers,
                        Authorization: `Bearer ${access}`, // Используем обратные кавычки
                    };
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.log("Ошибка обновления токена:", refreshError);
                    dispatch(logoutUser());
                    window.location.href = "/login/";
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    return Promise.reject(refreshError);
                }
            } else {
                window.location.href = "/login/";
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

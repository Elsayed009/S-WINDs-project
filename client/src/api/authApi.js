import axiosInstance from "./axiosInstance";

const registerApi = (data) => axiosInstance.post('/auth/register', data);
const loginApi = (data) => axiosInstance.post('/auth/login', data);
const logoutApi = (data) => axiosInstance.post('/auth/logout');
const getMeApi = (data) => axiosInstance.get('/auth/me');

export {
    registerApi,
    loginApi,
    logoutApi,
    getMeApi
};
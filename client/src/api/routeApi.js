import axiosInstance from "./axiosInstance";
const planRouteApi = (data) => axiosInstance.post('/routes/plan', data);
const getHistoryApi = ()=> axiosInstance.get('/routes/history');

module.exports = {
    planRouteApi,
    getHistoryApi
}
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8080';
axios.defaults.withCredentials = true;
axios.defaults.headers = {'Content-Type': 'application/json'};

export const downExcel = axios.defaults.baseURL + '/job/excel';

export const login = params => {
    return axios.post(`/login`, params).then(res => res.data);
};

export const resetPass = params => {
    return axios.put(`/job/resetPass`, params).then(res => res.data);
};

export const getJobList = params => {
    return axios.get(`/job/`, {params: params});
};

export const getJobListByParams = params => {
    return axios.get(`/job/filter`, {params: params});
};

export const addJob = params => {
    return axios.post(`/job/`, params).then(res => res.data);
};

export const editJob = params => {
    return axios.put(`/job/`, params).then(res => res.data);
};

export const delJob = params => {
    return axios.delete(`/job/${params}`);
};

export const delJobs = params => {
    return axios.delete(`/job/list/${params}`);
};

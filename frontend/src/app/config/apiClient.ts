import axios from 'axios';
import {environment} from '../../environments/environments';

const options: object = {
  baseURL: environment.apiUrl,
}

const API = axios.create(options);

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const {status, data} = error.response;
    return Promise.reject({status, data});
  }
)

export default API;

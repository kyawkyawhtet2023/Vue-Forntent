import axios from 'axios';

axios.defaults.withCredentials = true; 
const axiosAPI = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true,
  withXSRFToken: true,
});



export { axiosAPI };

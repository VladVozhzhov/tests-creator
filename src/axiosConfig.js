import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3500/api';

axios.interceptors.request.use(
  config => {
    const skipPaths = ['/api/auth', '/api/register', '/'];
    if (skipPaths.some(path => config.url?.startsWith(path))) {
      return config;
    }

    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);
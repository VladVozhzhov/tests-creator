import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3500/api';
    
axios.interceptors.request.use(
  config => {
    const skipPaths = ['/api/auth', '/api/register', '/api/refresh', '/'];
    if (skipPaths.some(path => config.url?.startsWith(path))) {
      return config;
    }

    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  async error => {
    const prevRequest = error?.config;

    if (
      error?.response?.status === 401 &&
      !prevRequest._retry
    ) {
      prevRequest._retry = true;

      try {
        await axios.get('http://localhost:3500/api/refresh', null, { withCredentials: true });

        return axios(prevRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
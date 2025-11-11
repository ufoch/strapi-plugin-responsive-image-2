import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  async (config: any) => {
    let token = localStorage.getItem('accessToken'); // For session management mode

    const jwtTokenKey = 'jwtToken';
    if (!token) {
      token = localStorage.getItem(jwtTokenKey);
    }
    if (!token) {
      const decodedCookieStorage = decodeURIComponent(document.cookie);
      token = decodedCookieStorage
        .split('; ')
        .find((row) => row.startsWith(`${jwtTokenKey}=`))
        ?.split('=')[1];
    }

    config.headers = {
      Authorization: `Bearer ${token?.replace(/^"(.*)"$/, '$1')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // whatever you want to do with the error
    if (error.response?.status === 401) {
      window.location.reload();
    }

    throw error;
  }
);

export { axiosInstance };

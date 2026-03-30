import axios from "axios";

const client = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/`,
  withCredentials: true
});

/* interceptor for refresh token */
client.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/user/login") &&
      !originalRequest.url.includes("/user/register") &&
      !originalRequest.url.includes("/user/refresh")
    ) {
      originalRequest._retry = true;

      await client.post(
        `user/refresh/`,
        {},
        { withCredentials: true }
      );

      return client(originalRequest);
    }

    return Promise.reject(error);
  }
);

const api = async (method, url, data=null) => {
  try {

    const res = await client({
      method,
      url,
      data
    });

    return res;

  } catch (error) {
    console.error(`error in ${url}:`, error?.response?.data || error.message);
    throw error;
  }
};

export default api;
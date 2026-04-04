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

    // 🚨 STOP if refresh itself fails
    if (originalRequest.url.includes("user/refresh")) {
      return Promise.reject(error);
    }
if (
  error.response?.status === 401 &&
  !originalRequest._retry &&
  !originalRequest.url.includes("user/refresh")
)
{
      originalRequest._retry = true;

      try {
        await client.post("user/refresh/");

        return client(originalRequest);
      } catch (err) {
        console.log("Refresh failed ❌");

      
        return Promise.reject(err);
      }
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
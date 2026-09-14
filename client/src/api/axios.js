import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message || 'Something went wrong';

    switch (status) {
      case 401:
        if (!error.config?.skipGlobalError) {
          toast.error('Session expired. Please log in again.');
        }
        break;
      case 403:
        toast.error(message || 'You do not have permission.');
        break;
      case 404:
        toast.error(message || 'Resource not found.');
        break;
      case 422:
        if (data?.errors?.length) {
          data.errors.forEach((e) => toast.error(e.message));
        } else {
          toast.error(message);
        }
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        if (!error.config?.skipGlobalError) {
          toast.error(message);
        }
    }

    return Promise.reject(error);
  }
);

export default api;

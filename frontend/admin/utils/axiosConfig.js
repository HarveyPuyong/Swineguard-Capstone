const api = axios.create({
  baseURL: 'http://localhost:2500',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



//  Interceptor for expired token (403)
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.get('/refresh');
        const newAccessToken = refreshRes.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        console.error("Token refresh failed", refreshErr);
        localStorage.removeItem('accessToken');
        window.location.href = '/login.html';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

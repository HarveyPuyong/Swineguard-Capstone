import api from "../../../admin/utils/axiosConfig.js";

const fetchClient = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.location.href = 'auth.html'; // Redirect to client login
    return;
  }

  try {
    const response = await api.get('/client-profile'); // Endpoint for client
    return response.data.userInfo;
  } catch (err) {
    const errStatus = err.response?.status;

    if (errStatus === 403) {
      // Token expired — try refreshing
      try {
        const refreshResponse = await api.get('/refresh');
        const newAccessToken = refreshResponse.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);

        const retryResponse = await api.get('/client-profile');
        return retryResponse.data.userInfo;

      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = 'auth.html';
        return;
      }

    } else if (errStatus === 401) {
      // Unauthorized
      localStorage.removeItem('accessToken');
      window.location.href = 'auth.html';
    } else {
      // Other errors
      console.error(err);
      const errMessage = err.response?.data?.message || 'Something went wrong';
      alert(errMessage);
    }
  }
};

export default fetchClient;
import api from '../../utils/axiosConfig.js';

const fetchMessages = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await api.get('/message/all');
    return response.data;

  } catch (err) {
    const errStatus = err.response?.status;

    if (errStatus === 403) {
      try {
        const refreshResponse = await api.get('/refresh');
        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        const retryResponse = await api.get('/message/all');
        return retryResponse.data;

      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = 'login.html';
      }

    } else if (errStatus === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = 'login.html';

    } else {
      console.error(err);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  }
};



export default fetchMessages;

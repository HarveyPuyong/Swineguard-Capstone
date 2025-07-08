import api from '../../utils/axiosConfig.js';

const fetchMessages = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) window.location.href = 'login.html';

  
  try {
    const response = await api.get('/message/all');
    return response.data;

  } catch (err) {
    const status = err.response?.status;

    if (status === 403) {
      try {
        const refresh = await api.get('/refresh');
        const newAccessToken = refresh.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        const retry = await api.get('/message/all');
        return retry.data;

      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        return redirectToLogin();
      }

    } else if (status === 401) {
      return redirectToLogin();

    } else {
      console.error('Fetch error:', err);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  }
};

const redirectToLogin = () => {
  localStorage.removeItem('accessToken');
  
};


export default fetchMessages;

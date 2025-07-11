import api from '../../utils/axiosConfig.js';

const fetchUser = async () => {
  let accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await api.get('/admin-profile');

    return response.data.userInfo;
  } catch (err) {
    const errStatus = err.response?.status;

    if (errStatus === 403) {
      try {
        const refreshResponse = await api.get('/refresh');

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        const retryResponse = await api.get('/admin-profile');

        return retryResponse.data.userInfo;

      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        localStorage.removeItem('accessToken');
        return;
      }

    } else if (errStatus === 401) {
      localStorage.removeItem('accessToken'); 
      window.location.href = 'login.html';
    } else {
      console.error(err);
      const errMessage = err.response?.data?.message || 'Something went wrong';
      alert(errMessage);
    }
  }
};

export default fetchUser;

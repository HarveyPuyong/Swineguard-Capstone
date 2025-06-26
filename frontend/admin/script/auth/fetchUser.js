const fetchUser = async () => {
  let accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await axios.get('http://localhost:2500/admin-profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    });

    return response.data.userInfo;

  } catch (err) {
    const errStatus = err.response?.status;

    // 🔁 If acess token is expired, hihingi ng bagong aaccess token gamit ang refreshToken
    if (errStatus === 403) {
      try {
        const refreshResponse = await axios.get('http://localhost:2500/refresh', {
          withCredentials: true
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        const retryResponse = await axios.get('http://localhost:2500/admin-profile', {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true
        });

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

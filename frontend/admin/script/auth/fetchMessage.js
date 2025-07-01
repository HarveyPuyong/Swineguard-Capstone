const fetchMessages = async () => {
  let accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.location.href = 'login.html';
    return;
  }

  
  try {
    const response = await axios.get('http://localhost:2500/message/all', {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    });

    //console.log(response.data);
    return response.data;

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

        const retryResponse = await axios.get('http://localhost:2500/message/all', {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true
        });

        //console.log(refreshResponse.data);
        return retryResponse.data;

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

const fetchClient = async () => {
  let accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.location.href = 'login.html';
    return;
  }

  
  try {
    const response = await axios.get('http://localhost:2500/data', {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    });

    //console.log(response.data);
    return response.data;

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

        const retryResponse = await axios.get('http://localhost:2500/data', {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true
        });

        //console.log(retryResponse.data);
        return retryResponse.data;

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

export { fetchMessages, fetchClient };

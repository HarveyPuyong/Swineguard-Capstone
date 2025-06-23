const fetchUser = async () => {
  // get accessToken to localStorage
  const accessToken = localStorage.getItem('accessToken');
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
    // if expired na ang accessToken, a call yung refreshToken para magbigay ng bagong accessToken at asend ulit sa user
    if (errStatus === 403) {
      try {
        const response = await axios.get('http://localhost:2500/refresh', {
          withCredentials: true
        });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
      
        const retry = await axios.get('http://localhost:2500/admin-profile', {
          headers: { Authorization: `Bearer ${newAccessToken}` },
          withCredentials: true
        });

        return retry.data.userInfo;

      } catch (refreshErr) {
        localStorage.removeItem('accessToken');
        window.location.href = 'admin-page.html';
      }

    // if Unauthorized yung nag login
    } else if (errStatus === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = 'admin-page.html';
    } else {
      console.log(err);
      const errMessage = err.response?.data?.message || 'Something went wrong';
      alert(errMessage);
    }
  }
};

export default fetchUser;

const handleLogout = async() => {
  try {
    const response = await axios.post('http://localhost:2500/logout', {}, {withCredentials: true});

    if(response.status === 200){
      localStorage.removeItem('accessToken');
      window.location.href = 'login.html'
    }

  } catch (err) {
    console.log(err);
    alert(err.response?.data?.message || err.message);
  }
}


export default handleLogout;
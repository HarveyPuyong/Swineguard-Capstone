import api from '../../utils/axiosConfig.js';

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'No, stay',
  });

  if (result.isConfirmed) {
    try {
      const response = await api.post('/logout', {});

      if (response.status === 200) {
        localStorage.removeItem('accessToken');

        await Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been successfully logged out.',
          confirmButtonText: 'OK'
        });

        window.location.href = 'login.html';
      }

    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: err.response?.data?.message || err.message,
      });
    }
  }
};

export default handleLogout;


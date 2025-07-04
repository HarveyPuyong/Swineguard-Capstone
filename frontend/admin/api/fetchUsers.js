import api from '../utils/axiosConfig.js';

const fetchUsers = async () => {
  try {
    const response = await api.get('/users');

    if(response.status === 200) return response.data
    console.log(response.data)

  } catch (err) {
    const errStatus = err.response?.status;
    const errMessage = err.response?.data?.message
    console.error(errMessage);
    alert(errMessage || 'Something went wrong');
  }
};


export default fetchUsers
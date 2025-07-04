import api from '../utils/axiosConfig.js';

const fetchSenderReceiver = async () => {
  try {
    const response = await api.get('/users');
    return response.data;

  } catch (err) {
    const errStatus = err.response?.status;
    const errMessage = err.response?.data?.message
    console.error(errMessage);
    alert(errMessage || 'Something went wrong');
  }
};


export default fetchSenderReceiver
import api from '../utils/axiosConfig.js';

const fetchAppointments = async() => {
  try {
    const response = await api.get('/appointment/all', {withCredentials: true});

    if(response.status === 200) return response.data
  } catch (error) {
    cconsole.error('Failed to fetch appointments:', error);
    throw error; 
  }
}

export default fetchAppointments;
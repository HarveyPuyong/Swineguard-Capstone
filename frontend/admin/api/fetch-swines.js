import api from '../utils/axiosConfig.js';

const fetchSwines = async () => {
  try {
    const response = await api.get('/swine/all');

    if(response.status === 200) return response.data
  } catch (error) {
    console.error('Failed to fetch  swines:', error);
    throw error; 
  }
};


export default fetchSwines
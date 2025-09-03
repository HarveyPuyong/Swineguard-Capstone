import api from '../utils/axiosConfig.js';

const fetchSwinePopulation = async () => {
  try {
    const response = await api.get('/swine/get/montly-swine-population');

    if(response.status === 200) return response.data
  } catch (error) {
    console.error('Failed to fetch  swines:', error);
    throw error; 
  }
};


export default fetchSwinePopulation
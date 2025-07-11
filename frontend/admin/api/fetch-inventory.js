import api from '../utils/axiosConfig.js';

const fetchInventory = async() => {
  try {
    const response = await api.get('/inventory/all', {withCredentials: true});

    if(response.status === 200) return response.data
  } catch (error) {
    cconsole.error('Failed to fetch inventory:', error);
    throw error; 
  }
}

export default fetchInventory;
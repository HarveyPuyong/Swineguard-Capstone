import api from '../utils/axiosConfig.js';

const fetchSwineReports = async() => {
  try {
    const response = await api.get('/report/get/all', {withCredentials: true});

    if(response.status === 200) return response.data
  } catch (error) {
    cconsole.error('Failed to fetch swine reports:', error);
    throw error; 
  }
}

const fetchInventoryReports = async() => {
  try {
    const response = await api.get('/report/inventory/all', {withCredentials: true});

    if(response.status === 200) return response.data.reports;
  } catch (error) {
    cconsole.error('Failed to fetch swine reports:', error);
    throw error; 
  }
}

export {
  fetchSwineReports,
  fetchInventoryReports
};
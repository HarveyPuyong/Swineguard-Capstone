import api from '../utils/axiosConfig.js';

const fetchServices = async() => {
  try {
    const response = await api.get('/service/get/all', {withCredentials: true});

    if(response.status === 200) return response.data
  } catch (error) {
    cconsole.error('Failed to fetch services:', error);
    throw error; 
  }
}


async function getServiceName(serviceId) {
  try {

    if (!serviceId) {
      return 'not set';
    }

    const response = await api.get(`/service/get/${serviceId}`);
    const serviceData = response.data;
    return serviceData.serviceName;

  } catch (error) {
    console.error('Error fetching service:', error);
    return 'Service not found.';
  }
}

async function getApplicableItemTypes(serviceId) {
  try {

    if (!serviceId) {
      return 'not set';
    }

    const response = await api.get(`/service/get/${serviceId}`);
    const serviceData = response.data;
    return serviceData.applicableItemTypes;

  } catch (error) {
    console.error('Error fetching service:', error);
    return 'Service not found.';
  }
}

export {fetchServices, getServiceName, getApplicableItemTypes};
import api from '../utils/axiosConfig.js'


export default fetchServices;
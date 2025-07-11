import api from '../utils/axiosConfig.js';

const fetchAppointments = async() => {
  try {
    const response = await api.get('/appointment/all', {withCredentials: true});

    if(response.status === 200) return response.data;
  } catch (error) {
    cconsole.error('Failed to fetch appointments:', error);
    throw error; 
  }
}

const getAppointmentServiceName = async(appointmentId) => {
  try {
    const response = await api.get(`/appointment/${appointmentId}`, {withCredentials: true});
    const appointmentData = response.data;
    if(response.status === 200) return appointmentData.appointmentService;

  } catch (error) {
    cconsole.error('Failed to fetch appointment:', error);
    throw error; 
  }
}


export {fetchAppointments, getAppointmentServiceName};
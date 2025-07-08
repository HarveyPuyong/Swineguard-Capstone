import api from '../../utils/axiosConfig.js';
import renderAppointmentsTable from './../../utils/appointment-table.js'

const displayOngoingAppointments = async() => {
  try {
    const response = await api.get('/appointment/all');

    const allAppointments = response?.data;

    const ongoingAppointments = allAppointments .filter(appointment => appointment.appointmentStatus === 'ongoing');   
    const ongoingAppointmentsTable = document.querySelector('.ongoing-appointment-table .appointment-table__tbody');

    renderAppointmentsTable(ongoingAppointments, ongoingAppointmentsTable);
    
  } catch (error) {
    console.log(error);
  }
}

export default displayOngoingAppointments;
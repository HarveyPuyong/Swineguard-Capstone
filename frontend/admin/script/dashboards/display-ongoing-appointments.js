import api from '../../utils/axiosConfig.js';
import {appointmentsTable, adminPageAppointmentTable} from './../../utils/appointment-table.js'

const displayOngoingAppointments = async() => {
  try {
    const response = await api.get('/appointment/all');

    const allAppointments = response?.data;

    const ongoingAppointments = allAppointments .filter(appointment => appointment.appointmentStatus === 'ongoing');   

    const ongoingAppointmentsTable = document.querySelector('.ongoing-appointment-table .appointment-table__tbody');
    const AdminOngoingAppointmentsTable = document.querySelector('.admin-page__section-wrapper .ongoing-appointment-table .appointment-table__tbody');

    if(ongoingAppointmentsTable) appointmentsTable(ongoingAppointments, ongoingAppointmentsTable);
    if(AdminOngoingAppointmentsTable) adminPageAppointmentTable(ongoingAppointments, AdminOngoingAppointmentsTable)
    
  } catch (error) {
    console.log(error);
  }
}

export default displayOngoingAppointments;
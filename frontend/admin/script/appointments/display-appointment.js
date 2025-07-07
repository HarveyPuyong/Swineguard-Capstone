import api from '../../utils/axiosConfig.js';
import {appointmentsTable, adminPageAppointmentTable} from './../../utils/appointment-table.js'


const handleRenderAppointments = async() => {
  try {
    const response = await api.get('/appointment/all', {withCredentials: true});

    const data = response?.data;

    const appointments = data.slice().reverse(); 
    const appointmentsTableElement = document.querySelector('#appointments-section .appointment-table__tbody');
    const adminAppointmentTableElement = document.querySelector('.admin-page__section-wrapper #appointments-section .appointment-table__tbody');

    appointmentsTable(appointments, appointmentsTableElement);
    adminPageAppointmentTable(appointments, adminAppointmentTableElement);
    

  } catch (error) {
    console.log(error)
  }
}

export default handleRenderAppointments;
import api from '../../utils/axiosConfig.js';
import renderAppointmentsTable from './../../utils/appointment-table.js'


const handleRenderAppointments = async() => {
  try {
    const response = await api.get('/appointment/all', {withCredentials: true});

    const data = response?.data;

    const appointments = data.slice().reverse(); 
    const appointmentTable = document.querySelector('#appointments-section .appointment-table__tbody');

    renderAppointmentsTable(appointments, appointmentTable)

  } catch (error) {
    console.log(error)
  }
}

export default handleRenderAppointments;
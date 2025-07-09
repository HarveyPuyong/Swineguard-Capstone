import fetchAppointments from '../../api/fetch-appointments.js';
import {appointmentsTable, adminPageAppointmentTable} from '../../utils/appointment-table.js'


const displayAcceptedAppointments = async() => {
  try {
    const allAppointments = await fetchAppointments();

    const acceptedAppointments = allAppointments .filter(appointment => appointment.appointmentStatus === 'accepted');   

    const acceptedAppointmentsTable = document.querySelector('.accepted-appointment-table .appointment-table__tbody');
    const AdminacceptedAppointmentsTable = document.querySelector('.admin-page__section-wrapper .accepted-appointment-table .appointment-table__tbody');

    if(acceptedAppointmentsTable) appointmentsTable(acceptedAppointments, acceptedAppointmentsTable);
    if(AdminacceptedAppointmentsTable) adminPageAppointmentTable(acceptedAppointments, AdminacceptedAppointmentsTable)
  } catch (error) {
    console.log(error);
  }
}

export default displayAcceptedAppointments;
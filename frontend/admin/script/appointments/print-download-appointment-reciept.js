import { fetchAppointments } from "../../api/fetch-appointments.js";
import fetchUsers from "../../api/fetch-users.js";

const handlePrintDownloadAppointment = async(appointmentId) => {

    const appointments = await fetchAppointments();
    const appointment = appointments.find(app => app._id === appointmentId);

    const users = await fetchUsers();
    const client =  users.find(u => u._id === appointment.vetPersonnel);

    // HTML for appointment printed copy
    const appointmentRecieptHTML = `
    
    `;
}

export default handlePrintDownloadAppointment;
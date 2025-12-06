import fetchUser from "../script/auth/fetchUser.js";
import { fetchNumOfAppt } from "../api/fetch-schedules.js";


const renderMaxApptPerDay = async() => {
    
    // Get vet Id
    const vet = await fetchUser();
    const vetId = vet._id;

    const role = vet.roles[0];

    const allowedUsers = ["veterinarian","technician"];

    if (!allowedUsers.includes(role)) {
        return;
    }


    // Get all Number of Appointment per Day
    const numOfApptPerDay = await fetchNumOfAppt();
    const findVetNumOfAppt = numOfApptPerDay.find(vet => vet.userId === vetId);
    let vetMaxApptPerDay = findVetNumOfAppt.totalAppointment;

    const numOfApptPerDay_Element = document.getElementById('max-appointment-num');

    numOfApptPerDay_Element.textContent = vetMaxApptPerDay;
}

export {
    renderMaxApptPerDay
};
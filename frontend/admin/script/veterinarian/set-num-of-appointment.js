import { fetchNumOfAppt } from "../../api/fetch-schedules.js";
import fetchUser from "../auth/fetchUser.js";
import popupAlert from "../../utils/popupAlert.js";
import api from "../../utils/axiosConfig.js";


async function editTotalAppointment () {
  // Vet Id
  const vet = await fetchUser();
  const vetId = vet._id;

  const numOfApptOfVet = await fetchNumOfAppt();
  const findVet_NumOfApptOfVet = numOfApptOfVet.find(vet => vet.userId === vetId);
  const maxApptVetId = findVet_NumOfApptOfVet._id;



  const form = document.querySelector('.availability-set__max-appointment');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const numberOfMxAppt = {
      totalAppointment: document.getElementById('max-num-input').value
    }

    //console.log(numberOfMxAppt);
    const overlay = document.querySelector('.availability-overlay');

    try {
      const response = await api.put(`/schedule/edit/vet/total-num-of-app/${maxApptVetId}`, numberOfMxAppt);
      // console.log(maxApptVetId);
      // console.log(numberOfMxAppt);

      if(response.status === 200){
        popupAlert('success', 'Success', `Total number of Appointments has been updated.`).
          then(() => {
            form.reset();
            form.classList.remove('show');
            overlay.classList.remove('show'); 

            // Render the User Number of Appointments
            document.getElementById('max-appointment-num').textContent = numberOfMxAppt.totalAppointment;
            
        });   
      }
    
    } catch (error) {
      // ✅ Handle backend validation messages
      if (error.response && error.response.data && error.response.data.message) {
        popupAlert("error", "Error", error.response.data.message);
      } else {
        popupAlert("error", "Error", "Something went wrong while adding the new schedule.");
      }

      console.error("Add new Schedule error:", error);
    }
  })

}


const getTotalAppointment = async() => {
    const totalAppointmentCount = document.getElementById('max-appointment-num');

    const totalApptOfVet = await fetchNumOfAppt();
    
}


export {
    editTotalAppointment,
    getTotalAppointment
}
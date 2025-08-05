import api from "../../client-utils/axios-config.js";
import popupAlert from "../../client-utils/client-popupAlert.js";
import fetchClient from "../auth/fetch-client.js";

const requestAppointment = async() => {
    // Sanitize all inputs text type
    const inputs = document.querySelectorAll('#add-appointments-form input[type="text"]:not(#client-email):not(#appointment-date):not(#appointment-time)');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
        input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
        });
    });


    const addAppointmentForm = document.querySelector('#add-appointments-form');

    if(!addAppointmentForm) return
  
    addAppointmentForm.addEventListener('submit', async(e) => {
      e.preventDefault();

      const appointmentFormData = {
        clientFirstname: document.querySelector('#first-name').value.trim(),
        clientLastname: document.querySelector('#last-name').value.trim(),
        clientEmail: document.querySelector('#client-email').value.trim(),
        contactNum: document.querySelector('#client-phone').value.trim(),
        municipality: document.querySelector('#municipality').value,
        barangay: document.querySelector('#barangay').value,
        appointmentService: document.querySelector('#appointment-service').value,
        appointmentType: document.querySelector('#appointment-type').value,
        appointmentDate: document.querySelector('#appointment-date').value,
        appointmentTime: document.querySelector('#appointment-time').value,
        swineType: document.querySelector('#swine-type').value,
        swineAge: Number(document.querySelector('#swine-age').value),
        swineCount: Number(document.querySelector('#swine-count').value),
        swineFemale: Number(document.querySelector('#swine-female').value),
        swineMale: Number(document.querySelector('#swine-male').value),
        swineSymptoms: document.querySelector('#swine-symptoms').value.trim(),
        appointmentStatus: 'ongoing'
    };


    try {
      const response = await api.post('/appointment/add', appointmentFormData);

      if(response.status === 201){
        popupAlert('success', 'Success!', 'New appointment has been created successfully').
          then(() => {
            addAppointmentForm.reset();
            addAppointmentForm.parentNode.classList.remove('show');
            handleRenderAppointments();
            appointmentsDashboard();
          });
      }

    } catch (error) {
      console.log(error);
      const errMessage = error.response.data?.message || error.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
    }
  })
}

export default requestAppointment;
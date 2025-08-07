import api from "../../client-utils/axios-config.js";
import popupAlert from "../../client-utils/client-popupAlert.js";
import fetchClient from "../auth/fetch-client.js";
import fetchSwines from "./../../../admin/api/fetch-swines.js"
import { getSwineAgeInMonths, 
         getSwineGenderMale,
         getSwineGenderFemale } from "../../client-utils/get-swine-data.js";
import { checkAppointmentDate, checkTime } from "../../client-utils/checkDates.js";
import displayAppointmentCardList from "./display-appointment-list.js";


const sendRequestAppointment = () => {
  const appointmentForm = document.querySelector('#request-appointment-form');
  const dateInput = document.querySelector('#input-date');
  const timeInput = document.querySelector('#input-time');
  if (!appointmentForm) return;

  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedDate = new Date(dateInput.value);
    const selectedTime = timeInput.value;

    const isDateValid = checkAppointmentDate(selectedDate);
    const isTimeValid = checkTime(selectedTime);

    if (!isDateValid || !isTimeValid) return;

    try {
      const client = await fetchClient();
      const { _id, firstName, lastName } = client;

      const swines = await fetchSwines();
      const selectedSwineCheckboxes = document.querySelectorAll('input[name="swines"]:checked');

      if (selectedSwineCheckboxes.length === 0) {
        popupAlert('error', 'Error', 'Please select at least one swine.');
        return;
      }

      // ✅ Extract swine IDs
      const selectedSwineIds = [];
      let totalMale = 0;
      let totalFemale = 0;
      let totalAge = 0;
      let swineType = 'multiple';

      for (const checkbox of selectedSwineCheckboxes) {
        const swineId = checkbox.value;
        const swine = swines.find(sw => sw._id === swineId && sw.status !== 'removed');
        if (!swine) continue;

        selectedSwineIds.push(swineId);
        totalMale += getSwineGenderMale(swine.sex);
        totalFemale += getSwineGenderFemale(swine.sex);
        totalAge += getSwineAgeInMonths(swine.birthdate);

          if (selectedSwineCheckboxes.length === 1) {
            swineType = swine.type;
          }
      }

      const swineCount = selectedSwineIds.length;
      const averageAge = swineCount > 0 ? Math.round(totalAge / swineCount) : 0;


      const appointmentFormData = {
        clientId: _id,
        swineIds: selectedSwineIds,

        clientFirstname: firstName,
        clientLastname: lastName,
        clientEmail: document.querySelector('#input-email').value.trim(),
        contactNum: document.querySelector('#input-contact-number').value.trim(),
        municipality: document.querySelector('#select-municipal').value,
        barangay: document.querySelector('#select-barangay').value,
        appointmentService: document.querySelector('#select-appointment-service').value,
        appointmentType: document.querySelector('#select-appointment-type').value,

        appointmentDate: document.querySelector('#input-date').value,
        appointmentTime: document.querySelector('#input-time').value,

        swineType: swineType,
        swineAge: averageAge,
        swineCount: selectedSwineIds.length,
        swineMale: totalMale,
        swineFemale: totalFemale,
        swineSymptoms: document.querySelector('#input-note').value
      };
      
      console.log(appointmentFormData);
      const response = await api.post('/appointment/add', appointmentFormData);

      if (response.status === 201) {
        popupAlert('success', 'Success!', 'Appointment requested successfully.');
        appointmentForm.reset();
        displayAppointmentCardList();
        appointmentForm.classList.remove('show');
      }

    } catch (error) {
      console.log(error);
      const errMessage = error.response?.data?.message || error.message;
      popupAlert('error', 'Error!', errMessage);
    }
  });
};

export default sendRequestAppointment;

import api from "../../client-utils/axios-config.js";
import popupAlert from "../../client-utils/client-popupAlert.js";
import fetchClient from "../auth/fetch-client.js";
import fetchSwines from "./../../../admin/api/fetch-swines.js"
import { getSwineAgeInMonths, 
         getSwineGenderMale,
         getSwineGenderFemale } from "../../client-utils/get-swine-data.js";
import { checkAppointmentDate, checkTime } from "../../client-utils/checkDates.js";
import displayAppointmentCardList from "./display-appointment-list.js";
import { fetchServices } from "../../../admin/api/fetch-services.js";
import displaySwineList from "./display-client-swine-list.js";


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

    const serviceSelect = document.getElementById("select-appointment-service");
    const appointmentTypeInput = document.getElementById("select-appointment-type");

    // When the user selects a service
    serviceSelect.addEventListener("change", async () => {
      const services = await fetchServices();
      const selectedService = services.find(service => service._id === serviceSelect.value);

      const serviceType = selectedService ? selectedService.serviceType : "Not set";
      appointmentTypeInput.value = serviceType;
    });

    try {
      const client = await fetchClient();
      const { _id, firstName, lastName, email, municipality, barangay, contactNum } = client;

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

        clientEmail: email,
        contactNum: contactNum,

        municipality: municipality,
        barangay: barangay,

        appointmentService: document.querySelector('#select-appointment-service').value,
        appointmentType: appointmentTypeInput.value,

        appointmentDate: document.querySelector('#input-date').value,
        appointmentTime: document.querySelector('#input-time').value,

        swineType: swineType,
        swineAge: averageAge,
        swineCount: selectedSwineIds.length,
        swineMale: totalMale,
        swineFemale: totalFemale,
        clinicalSigns: getClinicalSigns()
      };
      
      console.log(appointmentFormData);
      const response = await api.post('/appointment/add', appointmentFormData);

      if (response.status === 201) {
        popupAlert('success', 'Success!', 'Appointment requested successfully.');
        appointmentForm.reset();
        displayAppointmentCardList();
        appointmentForm.classList.remove('show');
        displaySwineList();
        document.body.classList.remove('modal-open');
      }

    } catch (error) {
      console.log(error);
      const errMessage = error.response?.data?.message || error.message;
      popupAlert('error', 'Error!', errMessage);
    }
  });
};

const getClinicalSigns = () => {
  const clinicalSigns = [];

  // Get all checked checkboxes
  document.querySelectorAll('input[name="client-side__clinicalSigns"]:checked').forEach(cb => {
    clinicalSigns.push(cb.value);
  });

  // Handle the "Others" textarea
  const othersInput = document.querySelector('#client-side__clinical-signs-others');
  if (othersInput && othersInput.value.trim() !== "") {
    clinicalSigns.push(`Others: ${othersInput.value.trim()}`);
  }

  return clinicalSigns;
};

export default sendRequestAppointment;

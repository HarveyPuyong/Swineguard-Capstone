import popupAlert from './../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from './../../utils/axiosConfig.js'
import appointmentsDashboard from './../dashboards/appointment-dashboards.js';
import { fetchServices } from '../../api/fetch-services.js';
import fetchUser from '../auth/fetchUser.js';


const handleAddAppointment = async() => {

  const user = await fetchUser();
  const userRole = user.roles[0];
  //console.log("Current role:", userRole);

  // Only Appointment Coordinator can use this feature
  if (userRole !== "appointmentCoordinator") {
    //console.log("❌ Add appointment form disabled for role:", userRole);
    return; // 🚪 exit early
  }

  // Sanitize all inputs text type
  const inputs = document.querySelectorAll('#add-appointments-form input[type="text"]:not(#client-email):not(#appointment-date):not(#appointment-time)');
  
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
    });
  });


  const serviceSelect = document.getElementById("appointment-service");
  const appointmentTypeInput = document.getElementById("add-appointment-type");

  // When the user selects a service
  serviceSelect.addEventListener("change", async () => {
    const services = await fetchServices();
    const selectedService = services.find(service => service._id === serviceSelect.value);

    const serviceType = selectedService ? selectedService.serviceType : "Not set";
    appointmentTypeInput.value = serviceType;
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
        appointmentType: appointmentTypeInput.value,
        appointmentDate: document.querySelector('#appointment-date').value,
        appointmentTime: document.querySelector('#appointment-time').value,

        swineType: document.querySelector('#swine-type').value,
        swineAge: Number(document.querySelector('#swine-age').value),
        swineCount: Number(document.querySelector('#swine-count').value),
        swineFemale: Number(document.querySelector('#swine-female').value),
        swineMale: Number(document.querySelector('#swine-male').value),
        clinicalSigns: getClinicalSigns()
      };


    try {
      // 2️⃣ Create a FormData
      const formData = new FormData();

      // 3️⃣ Append the JSON data
      formData.append("data", JSON.stringify(appointmentFormData));

      const response = await api.post('/appointment/add', formData);

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

const getClinicalSigns = () => {
  const clinicalSigns = [];

  // Get all checked checkboxes
  document.querySelectorAll('input[name="clinicalSigns"]:checked').forEach(cb => {
    clinicalSigns.push(cb.value);
  });

  // Handle the "Others" textarea
  const othersInput = document.querySelector('#clinical-signs-others');
  if (othersInput && othersInput.value.trim() !== "") {
    clinicalSigns.push(`Others: ${othersInput.value.trim()}`);
  }

  return clinicalSigns;
};


export default handleAddAppointment;
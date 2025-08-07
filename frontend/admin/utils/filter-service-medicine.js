
import { fetchMedicines } from './../api/fetch-medicine.js';
import { getApplicableItemTypes } from './../api/fetch-services.js';
import { fetchAppointments, getAppointmentServiceName } from './../api/fetch-appointments.js';

const populateFilteredMedicines = async (appointmentId) => {
  const medicineSelectElement = document.querySelector('.appointment-schedule-form #medicine-list');
  const dosageInput = document.getElementById('medicine-amount');
  const serviceTypeInputBox = document.querySelector('.appointment-schedule-form #appointment-type');

  if (!medicineSelectElement || !dosageInput) return;

  try {
    // Get appointment info
    const allAppointments = await fetchAppointments();
    const appointment = allAppointments.find(app => app._id === appointmentId);
    
    if (!appointment) {
      console.error("Appointment not found.");
      return;
    }

    // Display Service Type in the readonly input value
    serviceTypeInputBox.value = appointment.appointmentType;

    const { appointmentType } = appointment;

    // If appointment is a 'visit', disable medicine and dosage
    if (appointmentType === 'visit') {
      medicineSelectElement.disabled = true;
      dosageInput.disabled = true;
      medicineSelectElement.innerHTML = '<option value="">No medicine required</option>';
      dosageInput.value = '0';
      return;
    }

    // Else, continue normally (service appointment)
    medicineSelectElement.disabled = false;
    dosageInput.disabled = false;

    // Get the serviceId from appointment
    const serviceId = await getAppointmentServiceName(appointmentId);

    // Get applicable item types from service
    const applicableItemTypes = await getApplicableItemTypes(serviceId);

    // Get all medicines
    const medicines = await fetchMedicines();

    // Clear and populate select
    medicineSelectElement.innerHTML = '';

    const filtered = medicines.filter(med =>
      applicableItemTypes.includes(med.itemType)
    );

    filtered.forEach(med => {
      const option = document.createElement('option');
      option.value = med._id;
      option.textContent = med.itemName;
      medicineSelectElement.appendChild(option);
    });

  } catch (err) {
    console.error('Error populating filtered medicines:', err);
  }
};

export default populateFilteredMedicines;

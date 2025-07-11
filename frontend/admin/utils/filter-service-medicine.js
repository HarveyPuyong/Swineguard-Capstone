import { fetchMedicines } from './../api/fetch-medicine.js';
import { getApplicableItemTypes } from './../api/fetch-services.js';
import { getAppointmentServiceName } from './../api/fetch-appointments.js';

const populateFilteredMedicines = async (appointmentId) => {
  const medicineSelectElement = document.querySelector('.appointment-schedule-form #medicine-list');
  if (!medicineSelectElement) return;

  try {
    // Step 1: Get the serviceId from appointment
    const serviceId = await getAppointmentServiceName(appointmentId); // returns serviceId like "66d4..."

    // Step 2: Get applicable item types from service
    const applicableItemTypes = await getApplicableItemTypes(serviceId); // e.g., ["Piglet", "Grower"]

    // Step 3: Get all medicines
    const medicines = await fetchMedicines();

    // Step 4: Clear select
    medicineSelectElement.innerHTML = '';

    // Step 5: Filter and populate
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

import { fetchMedicines } from "../api/fetch-medicine.js";
//import { fetchAppointments } from "../api/fetch-appointments.js";
import api from "./axiosConfig.js";


const updatedItemQuantity = async (medicineId, appointmentId) => {
  try {
    const response = await api.put(`/inventory/update-quantity/${medicineId}`, {
      appointmentId: appointmentId
    });

    console.log("Inventory updated:", response.data);
  } catch (error) {
    console.error("Error updating inventory quantity:", error);
  }
};


export default updatedItemQuantity;
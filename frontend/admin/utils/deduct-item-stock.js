import api from "./axiosConfig.js";


const updatedItemQuantity = async (medications) => {
  try {

    const response = await api.put(`/inventory/deduct/stock`, {
      medications: medications
    });


    console.log("Inventory updated:", response.data);
  } catch (error) {
    console.error("Error updating inventory quantity:", error);
  }
};


export default updatedItemQuantity;
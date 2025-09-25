import api from "./axiosConfig.js";


const updatedItemQuantity = async (medicineId, amountUsed) => {
  try {
    const response = await api.put('/inventory/deduct/medicine', {
      medicineId,
      amountUsed
    });

    console.log("Inventory updated:", response.data);
  } catch (error) {
    console.error("Error updating inventory quantity:", error);
  }
};


export default updatedItemQuantity;
import api from "./axiosConfig.js";


const updatedItemQuantity = async (itemId, amountUsed) => {
  try {

    const response = await api.put(`/inventory/deduct/stock/${itemId}`, {
      usedQuantity: amountUsed
    });


    console.log("Inventory updated:", response.data);
  } catch (error) {
    console.error("Error updating inventory quantity:", error);
  }
};


export default updatedItemQuantity;
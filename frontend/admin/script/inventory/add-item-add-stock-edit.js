
import api from "../../utils/axiosConfig.js"
import handleRenderInventory from "./display-inventory.js";
import { createInventoryTable } from "./create-inventory-table.js";
import popupAlert from "../../utils/popupAlert.js";

const addItem = async(medicineId) => {
    const addItemForm = document.querySelector('#add-item-form');
  
  if(!addItemForm) return;

    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const itemFormData = {
            medicineId: medicineId,
            content: document.querySelector('#item-content-input').value,
            quantity: document.querySelector('#item-quantity-input').value,
            expiryDate: document.querySelector('#item-expiry-input').value,
        };

        
            console.log(itemFormData);

        try {
            const response = await api.post('/inventory/add/item', itemFormData);

            const message = response.data.message;

            if (response.status === 201 || response.status === 200) {
            popupAlert('success', 'Success!', `${message}`)
                .then(() => {
                addItemForm.reset();
                addItemForm.classList.remove('show');
                handleRenderInventory();
                createInventoryTable();
                });
            }

        } catch (error) {
            console.log(error);
            const errMessage = error.response?.data?.message || error.response?.data?.error;
            popupAlert('error', 'Error!', errMessage);
        }
    }, { once: true });
}


export {
            addItem
        }
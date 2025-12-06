import api from "../../utils/axiosConfig.js"
import handleRenderInventory from "./display-inventory.js";
import { createInventoryTable } from "./create-inventory-table.js";
import popupAlert from "../../utils/popupAlert.js";



// ======================================
// ========== Handle Add Item
// ======================================
const addItem = async (medicineId) => {
  const addItemForm = document.querySelector('#add-item-form');
  if (!addItemForm) return;

  // Remove any previous listeners to avoid stacking
  addItemForm.onsubmit = async (e) => {
    e.preventDefault();

    const itemFormData = {
      medicineId,
      content: document.querySelector('#item-content-input').value.trim() || 0,
      quantity: document.querySelector('#item-quantity-input').value.trim(),
      expiryDate: document.querySelector('#item-expiry-input').value.trim(),
    };
    //console.log(itemFormData);
    

    try {
      const response = await api.post('/inventory/add/item', itemFormData);
      const message = response.data.message;

      if (response.status === 200 || response.status === 201) {
        popupAlert('success', 'Success!', message).then(() => {
          addItemForm.reset();
          addItemForm.classList.remove('show');
          handleRenderInventory();
          createInventoryTable();
          document.querySelector('.item-content-container').style.display = 'block';
        });
      }
    } catch (error) {
      console.log(error);
      const errMessage = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      popupAlert('error', 'Failed', errMessage);
      document.getElementById('item-expiry-input').value = '';
    }
  };
};


// ======================================
// ========== Handle Add Stock
// ======================================
let currentItemId = null;
const addStockFormContainer = document.querySelector('.inventory-table__add-stock');
const addStockForm = document.querySelector('.add-stock__form');
const handleAddStock = async (e) => {
    e.preventDefault();

    const stockInput = document.querySelector('#stock-num-input').value;
    try {
        const response = await api.put(`/inventory/add/stock/${currentItemId}`, {
            quantity: stockInput
        });
        if(response.status === 200) {
            popupAlert('success', 'Success!', response.data.message).then(() => {
            addStockForm.reset();
            addStockFormContainer.classList.remove('show');
            handleRenderInventory();
            createInventoryTable();
        });
        }
    } catch (error) {
        console.log(error);
        const errMessage = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
        popupAlert('error', 'Error!', errMessage);
    }
}
const addStock = (itemId) => {
  currentItemId = itemId;
};
const setupAddStockFormListener = () => {
  const addStockForm = document.querySelector('.add-stock__form');
  if (addStockForm) {
    addStockForm.addEventListener('submit', handleAddStock); 
  }
};


// ======================================
// ========== Handle Edit Stock
// ======================================
const edittockFormContainer = document.querySelector('.inventory-table__edit-stock');
const editStockForm = document.querySelector('.edit-stock__form');
const handleEditStock = async (e) => {
    e.preventDefault();

    try {
        
        const itemData = {
            content: document.querySelector('#edit-stock__content-input').value,
            quantity: document.querySelector('#edit-stock__quantity-input').value
        }

        const response = await api.put(`/inventory/edit/stock/${currentItemId}`, itemData);

        if(response.status === 200) {
            popupAlert('success', 'Success!', response.data.message).then(() => {
            editStockForm.reset();
            edittockFormContainer.classList.remove('show');
            handleRenderInventory();
            createInventoryTable();
        });
        }
    } catch (error) {
        console.log(error);
        const errMessage = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
        popupAlert('error', 'Error!', errMessage);
    }
}
const editStock = (itemId) => {
  currentItemId = itemId;
};
const setupEditStockFormListener = () => {
  const editStockForm = document.querySelector('.edit-stock__form');
  if (editStockForm) {
    editStockForm.addEventListener('submit', handleEditStock); 
  }
};




export { addItem, addStock, setupAddStockFormListener,
         editStock, setupEditStockFormListener
        };

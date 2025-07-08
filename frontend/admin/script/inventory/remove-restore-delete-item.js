import popupAlert from '../../utils/popupAlert.js';
import handleRenderInventory from './display-inventory.js';
import api from '../../utils/axiosConfig.js'; 
import inventoryDashboard from '../dashboards/inventory-dashboard.js';
import displayLessStockInventory from '../dashboards/display-less-stock-inventory.js'

// ======================================
// ==========Handle Remove Item
// ======================================
const handleRemoveItem = async (itemId) => {
  try {
    const response = await api.patch(`/inventory/remove/${itemId}`); 

    if (response.status === 200) {
      popupAlert('success', 'Success!', 'Item removed successfully')
        .then(() => {
          handleRenderInventory();
          inventoryDashboard();
          displayLessStockInventory()
        });
    }

  } catch (err) {
    console.log(err);
    const errMessage = err.response?.data?.message || err.response?.data?.error;
    popupAlert('error', 'Error!', errMessage);
  }
};


// ======================================
// ==========Handle Restore Item
// ======================================
const handleRestoreItem = async (itemId) => {
  try {
    const response = await api.patch(`/inventory/restore/${itemId}`);

    if (response.status === 200) {
      popupAlert('success', 'Success!', 'Item restored successfully')
        .then(() => {
          handleRenderInventory();
           inventoryDashboard();
           displayLessStockInventory()
        });
    }

  } catch (err) {
    console.log(err);
    const errMessage = err.response?.data?.message || err.response?.data?.error;
    popupAlert('error', 'Error!', errMessage);
  }
};


// ======================================
// ==========Handle Delete Item
// ======================================
const handleDeleteItem = async (itemId) => {
  try {
    const response = await api.delete(`/inventory/delete/${itemId}`);

    if (response.status === 200) {
      popupAlert('success', 'Success!', 'Item deleted successfully')
        .then(() => {
          handleRenderInventory();
          inventoryDashboard();
          displayLessStockInventory();
        });
    }

  } catch (err) {
    console.log(err);
    const errMessage = err.response?.data?.message || err.response?.data?.error;
    popupAlert('error', 'Error!', errMessage);
  }
};

export { handleRemoveItem, handleRestoreItem, handleDeleteItem };

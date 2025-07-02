import popupAlert from '../../utils/popupAlert.js';
import fetchUser from '../auth/fetchUser.js';
import handleRenderInventory from './display-inventory.js';
import api from '../../utils/axiosConfig.js';
import inventoryDashboard from '../dashboards/inventory-dashboard.js';
import displayLessStockInventory from '../dashboards/display-less-stock-inventory.js'

const handleEditItem = (itemId) => {
  const editItemForm = document.querySelector('#edit-medicine-form');

  editItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userInfo = await fetchUser();
    if (!userInfo || !userInfo._id) {
      console.error("User not found");
      return;
    }

    const itemFormData = {
      itemName: document.querySelector('#edit-medicine-form .medicine-name-input').value.trim(),
      dosage: document.querySelector('#edit-medicine-form .dosage-input').value.trim(),
      quantity: document.querySelector('#edit-medicine-form .medicine-quantity-input').value.trim(),
      expiryDate: document.querySelector('#edit-medicine-form .expiration-date-input').value,
      description: document.querySelector('#edit-medicine-form .medicine-description-input').value.trim(),
      createdBy: userInfo._id
    };

    try {
      const response = await api.put(`/inventory/edit/${itemId}`, itemFormData);
      console.log(response)

      if (response.status === 200) {
        popupAlert('success', 'Success!', 'Edit item successfully')
          .then(() => {
            editItemForm.reset();
            editItemForm.classList.remove('show');
            handleRenderInventory();
            inventoryDashboard();
            displayLessStockInventory();
          });
      }

    } catch (error) {
      console.log(error);
      const errMessage = error.response?.data?.message || error.response?.data?.error;
      popupAlert('error', 'Error!', errMessage);
    }
  });
};

export default handleEditItem;

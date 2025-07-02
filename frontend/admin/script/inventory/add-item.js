import popupAlert from './../../utils/popupAlert.js';
import fetchUser from './../auth/fetchUser.js';
import handleRenderInventory from './display-inventory.js';
import api from '../../utils/axiosConfig.js';
import inventoryDashboard from '../dashboards/inventory-dashboard.js';
import displayLessStockInventory from './../dashboards/display-less-stock-inventory.js'

const handleAddItem = () => {
  const addItemForm = document.querySelector('#add-medicine-form');

  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userInfo = await fetchUser();
    if (!userInfo || !userInfo._id) {
      console.error("User not found");
      return;
    }

    const itemFormData = {
      itemName: document.querySelector('#medicine-name-input').value.trim(),
      dosage: document.querySelector('#dosage-input').value.trim(),
      quantity: document.querySelector('#medicine-quantity-input').value.trim(),
      type: document.querySelector('#select-medicine-type').value,
      expiryDate: document.querySelector('#expiration-date-input').value,
      description: document.querySelector('#medicine-description-input').value.trim(),
      createdBy: userInfo._id
    };

    try {
      const response = await api.post('/inventory/add', itemFormData);

      if (response.status === 201) {
        popupAlert('success', 'Success!', 'Add item successfully')
          .then(() => {
            addItemForm.reset();
            addItemForm.classList.remove('show');
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

export default handleAddItem;

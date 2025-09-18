import popupAlert from '../../utils/popupAlert.js';
import fetchUser from '../auth/fetchUser.js';
import handleRenderInventory from './display-inventory.js';
import api from '../../utils/axiosConfig.js';
import inventoryDashboard from '../dashboards/inventory-dashboard.js';
import displayLessStockInventory from '../dashboards/display-less-stock-inventory.js'

const handleAddMedicine = () => {
  const addItemForm = document.querySelector('#add-medicine-form');
  
  if(!addItemForm) return;

  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userInfo = await fetchUser();
    if (!userInfo || !userInfo._id) {
      console.error("User not found");
      return;
    }

    const itemFormData = {
      itemName: document.querySelector('#add-medicine-form .medicine-name-input').value.trim(),
    };

    try {
      const response = await api.post('/inventory/add/medicine', itemFormData);

      const message = response.data.message;
      const itemName = response.data.item.itemName

      if (response.status === 201) {
        popupAlert('success', 'Success!', `${itemName} ${message}`)
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

export default handleAddMedicine;

import popupAlert from './../../utils/popupAlert.js';
import fetchUser from './../auth/fetchUser.js';

const handleAddItem = async () => {
  // Sanitize all text inputs (except expiration date)
  document.querySelectorAll('#add-medicine-form input[type="text"]:not(#expiration-date-input)')
    .forEach(input => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
      });
    });

  const token = localStorage.getItem('accessToken');

  // ✅ Get _id properly
  const user = await fetchUser();
  const AC_Staff_Id = user?._id;

  if (!AC_Staff_Id) {
    popupAlert('error', 'Unauthorized', 'User not found. Please re-login.');
    return;
  }

  const addItemForm = document.getElementById('add-medicine-form');

  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemFormData = {
      itemName: document.getElementById('medicine-name-input').value.trim(),
      dosage: document.getElementById('dosage-input').value,
      quantity: document.getElementById('medicine-quantity-input').value,
      expiryDate: document.getElementById('expiration-date-input').value,
      description: document.getElementById('select-medicine-type').value,
      createdBy: AC_Staff_Id  // ✅ Actual _id value, not a function
    };

    // Basic field validation
    if (!itemFormData.itemName || !itemFormData.dosage || !itemFormData.quantity || !itemFormData.expiryDate || !itemFormData.description) {
      popupAlert('warning', 'Missing Fields', 'Please fill in all required fields.');
      return;
    }

    try {
      console.log("Submitted Item Data:", itemFormData);

      const response = await axios.post('http://localhost:2500/inventory/add', itemFormData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (response.status === 201) {
        popupAlert('success', 'Success!', 'Item added successfully').then(() => window.location.reload());
      }

    } catch (error) {
      console.error(error);
      const errMessage = error.response?.data?.message || error.response?.data?.error || 'An error occurred';
      popupAlert('error', 'Error!', errMessage);
    }
  });
};

export default handleAddItem;

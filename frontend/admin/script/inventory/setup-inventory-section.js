import handleRenderInventory from "./display-inventory.js";
import handleAddItem from "./add-item.js";
import {handleRemoveItem, handleRestoreItem, handleDeleteItem} from "./remove-restore-delete-item.js";

// ======================================
// ========== Search Inventory
// ======================================
const searchInventory = () => {
  document.addEventListener('renderInventory', () => {
    const input = document.querySelector('.inventory-section__search-input');
    const medicines = document.querySelectorAll('.inventory-table .medicine');

    if (!input || medicines.length === 0) return;

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();

      medicines.forEach(medicine => {
        const medicineId = medicine.querySelector('.id')?.textContent.toLowerCase() || '';
        const medicineName = medicine.querySelector('.medicine-name')?.textContent.toLowerCase() || '';
        const dosage = medicine.querySelector('.medicine-dosage')?.textContent.toLowerCase() || '';
        const quantity = medicine.querySelector('.quantity')?.textContent.toLowerCase() || '';
        const expDate =  medicine.querySelector('.exp-date')?.textContent.toLowerCase() || '';
        const createdDate =  medicine.querySelector('.created-date')?.textContent.toLowerCase() || '';
        const updatedDate =  medicine.querySelector('.updated-date')?.textContent.toLowerCase() || '';

        const searchableText = `${medicineId} ${medicineName} ${dosage} ${quantity} ${expDate} ${createdDate} ${updatedDate}`;

        medicine.style.display = searchableText.includes(query) ? 'flex' : 'none';
      });
    });
  });
};

// ======================================
// ========== Filter Inventory
// ======================================
const filterInventory = () => {
  const selectStatus = document.querySelector('.filter-inventory-status');

  selectStatus.addEventListener('change', () => {
    const selectedValue = selectStatus.value.toLowerCase();
    setStatusColor(selectedValue, selectStatus);

    document.querySelectorAll('#inventory-section .inventory-table .medicine .td.status')
      .forEach(status => {
        const statusValue = status.getAttribute('data-status-value');
        const medicineItem = status.parentElement;
        medicineItem.style.display = 'none';

        if(selectedValue === 'all'){
          medicineItem.style.display = 'flex'
        } else if (selectedValue === statusValue) {
          medicineItem.style.display = 'flex';
        }
    });
  });
}


// ======================================
// ========== Set Status Color
// ======================================
const setStatusColor = (statusValue, element) => {
  if(statusValue === 'in-stock'){
    element.style.setProperty('--color', 'rgb(0, 153, 71)');
    element.style.setProperty('--BGcolor', 'rgba(29, 255, 135, 0.13)');
  } else if (statusValue === 'less-stock'){
      element.style.setProperty('--color', 'rgb(153, 115, 0)');
      element.style.setProperty('--BGcolor', 'rgba(255, 191, 0, 0.30)');
  } else if(statusValue === 'out-of-stock'){
      element.style.setProperty('--color', 'rgb(230, 7, 7)'); 
      element.style.setProperty('--BGcolor', 'rgba(226, 35, 35, 0.23)');
  } else if(statusValue === 'expired'){
      element.style.setProperty('--color', 'rgb(230, 54, 0)'); 
      element.style.setProperty('--BGcolor', 'rgba(220, 84, 30, 0.29)');
  } else if(statusValue === 'removed'){
      element.style.setProperty('--color', 'rgb(95, 95, 95)');
      element.style.setProperty('--BGcolor', 'rgba(105, 105, 105, 0.25)');
  } else{
      element.style.setProperty('--color', 'black');
      element.style.setProperty('--BGcolor', 'white');
  }
}

// ======================================
// ========== Change Inventory Status Color
// ======================================
const changeStatusColor = () => {
  document.addEventListener('renderInventory', () => {
    const items = document.querySelectorAll('.inventory-table__tbody .medicine');

    items.forEach(item => {
      const status = item.querySelector('.td.status');
      const statusValue = status.getAttribute('data-status-value');

      setStatusColor(statusValue, status);
    });
  });
}


// ======================================
// ========== Toggle item buttons container
// ======================================
const toggleMedicineButtonsContainer = () => {
  document.addEventListener('renderInventory', () => {
    const medicines = document.querySelectorAll('.inventory-table__tbody .medicine');

    medicines.forEach(medicine => {
      const buttonsContainer = medicine.querySelector('.buttons-container');
      const toggleIcon = medicine.querySelector('.toggle-buttons-icon')
        .addEventListener('click', () => {
          buttonsContainer.classList.toggle('show')
        });
    });
  });
}


// ======================================
// ========== Item Buttons Actions.
//            Dito ko cinall lahat ng handleFuntions (Remove, Restore, Delete, Edit) 
// ======================================
const handleItemButtonsActions = () => {
  document.addEventListener('renderInventory', () => {
    const items = document.querySelectorAll('.inventory-table__tbody .medicine');
    
    items.forEach(item => {
      const buttons = item.querySelectorAll('.buttons-container button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const itemId = button.dataset.itemId;

          if(button.id === 'remove-btn') handleRemoveItem(itemId);
          else if(button.id === 'restore-btn') handleRestoreItem(itemId)
          else if(button.id === 'delete-btn') handleDeleteItem(itemId)
        })
      }); 
    })
  });
}

// ======================================
// ==========Toggle Popup Add Medicine Form
// ======================================
const toggleAddMedicineForm = () => {
  const form = document.querySelector('#add-medicine-form');

  const showFormBtn = document.querySelector('.inventory-section__add-btn')
    .addEventListener('click', () => form.classList.add('show'));

  const closeFormBtn = document.querySelector('.add-medicine-form__buttons-container .cancel-btn')
    .addEventListener('click', () => form.classList.remove('show'))
}


export default function setupInventorySection() {
  handleRenderInventory();
  handleAddItem();
  handleItemButtonsActions();
  searchInventory();
  filterInventory();
  toggleAddMedicineForm();
  changeStatusColor();
  toggleMedicineButtonsContainer();
}

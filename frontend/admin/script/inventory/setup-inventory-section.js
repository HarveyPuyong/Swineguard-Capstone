import handleRenderInventory from "./display-inventory.js";
import handleAddItem from "./add-medicine.js";
import handleEditItem from "./edit-item.js";
import {handleRemoveItem, handleRestoreItem, handleDeleteItem} from "./remove-restore-delete-item.js";
import {generateInventoryReport, /*displayInventoryReport*/} from "../reports/generate-inventory-reports.js";
import fetchUser from "../auth/fetchUser.js";
import {createInventoryTable, getMedicineId, getCurrentMedicineId} from "./create-inventory-table.js";
import { addItem, addStock, setupAddStockFormListener,
         editStock, setupEditStockFormListener
        } from "./add-item-add-stock-edit.js";


import { fetchInventoryStocks } from "../../api/fetch-inventory-stock.js";

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
// ========== Inventory Sorting
// ======================================
const inventorySorting = () => {
  document.addEventListener('renderInventoryPreHeading', () => {
    const sortingSelect = document.querySelector('.inventory-sorting__select');
    const inventoryTable = document.querySelector('#inventory-section .inventory-table__tbody');

    if (!sortingSelect || !inventoryTable) return;

    // Save original order
    const originalInventory = Array.from(inventoryTable.children).map(el => el.cloneNode(true));

    sortingSelect.addEventListener('change', () => {
      const selectedSort = sortingSelect.value;
      let sortedInventories;

      if (selectedSort === 'default') {
        // Restore to original order
        inventoryTable.innerHTML = '';
        originalInventory.forEach(item => inventoryTable.appendChild(item.cloneNode(true))); // use clones again
        return;
      }

      const inventories = Array.from(inventoryTable.querySelectorAll('.medicine'));

      const getText = (el, selector) => el.querySelector(selector)?.textContent.trim().toLowerCase() || '';
      const parseDate = (el, selector) => new Date(el.querySelector(selector)?.textContent.trim());

      sortedInventories = inventories.sort((a, b) => {
        switch (selectedSort) {
          case 'medicine-name':
            return getText(a, '.medicine-name').localeCompare(getText(b, '.medicine-name'));
          case 'quantity':
            return parseInt(getText(a, '.quantity')) - parseInt(getText(b, '.quantity'));
          default:
            return 0;
        }
      });

      // Re-render sorted inventories
      inventoryTable.innerHTML = '';
      sortedInventories.forEach(item => inventoryTable.appendChild(item));
    });

    displayMedicineTable();
    changeStatusColor();
  });
};


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
  } else{
      element.style.setProperty('--color', 'black');
      element.style.setProperty('--BGcolor', 'white');
  }
}

// ======================================
// ========== Change Inventory Status Color
// ======================================
const changeStatusColor = () => {
  const items = document.querySelectorAll('.inventory-table__tbody .medicine');

  items.forEach(item => {
    const status = item.querySelector('.td.status');
    const statusValue = status.getAttribute('data-status-value');

    setStatusColor(statusValue, status);
  });
}


// ======================================
// ========== Toggle item buttons container
// ======================================
const toggleMedicineButtons = () => {
  document.addEventListener('renderInventory', () => {
    const medicines = document.querySelectorAll('.inventory-table__tbody .medicine');

    medicines.forEach(medicine => {
      const buttonsContainer = medicine.querySelector('.buttons-container');
      const toggleIcon = medicine.querySelector('.toggle-buttons-icon');
      
      if(!buttonsContainer || !toggleIcon) return;

      toggleIcon .addEventListener('click', () => buttonsContainer.classList.toggle('show'));
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

          if(button.id === 'edit-btn') {
            const editForm = document.querySelector('#edit-medicine-form');
            editForm.classList.add('show'); 

            const closeFormBtn = document.querySelector('#edit-medicine-form .cancel-btn');             
            closeFormBtn.addEventListener('click', () => editForm.classList.remove('show'));

            const itemId = button.dataset.itemId;
            handleEditItem(itemId)
          }
          else if(button.id === 'remove-btn') handleRemoveItem(itemId);
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
  const showFormBtn = document.querySelector('.inventory-section__add-btn');
  const closeFormBtn = document.querySelector('#add-medicine-form .cancel-btn');

  if(!form || !showFormBtn || !closeFormBtn) return;

  showFormBtn.addEventListener('click', () => form.classList.add('show'));
  closeFormBtn.addEventListener('click', () => form.classList.remove('show'))
}


// ======================================
// ========== View Button (View Graph, Generate Report) Buttons Functionality
// ======================================
const viewBtnsFunctionality = () => {
  const inventoryTableContents = document.querySelector('.inventory-section__table-contents');
  const backToTableBtn = document.querySelector('.inventory-back-table-btn');
  const inventoryReportContents = document.querySelector('.inventory-section__report-contents');
  const viewReportsBtn = document.querySelector('.inventory-section__view-report-btn');

  // When 'Generate Report' is clicked
  if (viewReportsBtn) {
    viewReportsBtn.addEventListener('click', () => {
      inventoryTableContents.classList.remove('show');
      inventoryReportContents.classList.add('show');

      setTimeout(() => {
        generateInventoryReport();
        //displayInventoryReport();
      }, 100);
    });
  }

  if (backToTableBtn) {
    backToTableBtn.addEventListener('click', () => {
      inventoryTableContents.classList.add('show');
      inventoryReportContents.classList.remove('show');
    });
  }
};


const displayMedicineTable = async() => {

  const user = await fetchUser();
  const userRole = user.roles[0];
  //console.log("Current role:", userRole);

  // Only Appointment Coordinator can use this feature
  if (userRole !== "inventoryCoordinator") {
    //console.log("❌ Add appointment form disabled for role:", userRole);
    return; // 🚪 exit early
  }

  const inventoryContainer = document.querySelector('.inventory-table__container');
  const medicine = document.querySelectorAll('.inventory-table__tbody .medicine');
  const cancelBtn = document.querySelector('.add-inventory-container__close-form-btn');
  

  medicine.forEach( med => {
    const medicineId = med.dataset.itemId;

    med.onclick = () => {  // replaces any previous handler
      //console.log(medicineId);
      getMedicineId(medicineId);
      inventoryContainer.classList.add('show');

      // Create Table for stocks
      createInventoryTable();
    };

  })

  // Hide the table
  cancelBtn.addEventListener('click', () => {
    inventoryContainer.classList.remove('show');
  })


}


// ======================================
// ========== Handle Stocks Management
// ======================================
const handleInventoryStocks = () => {
  document.addEventListener('renderInventoryStockTable', () => {

    // Get Id of the Medicine
    const medicineId = getCurrentMedicineId();
    handleInventoryStocksBtn(medicineId);

    // Handle adding stocks each item
    handleAddStock();

  })
}

const handleInventoryStocksBtn = (medicineId) => {
  // Add Item in clicked Medicine
  const addItemBtn = document.querySelector('.add-item__medicine-table');
  const cancelAddItemBtn = document.querySelector('.add-item__cancel-btn');
  const addItemForm = document.querySelector('#add-item-form');
  if (!addItemBtn) return;

  addItemBtn.onclick = () => {
    //alert(`Add Item, Item Id: ${medicineId}`);
    addItemForm.classList.add('show');
    addItem(medicineId);
  };

  if (cancelAddItemBtn) {
    cancelAddItemBtn.addEventListener('click', () => {
      addItemForm.classList.remove('show');
      addItemForm.reset();
    })
  }

}


// ======================================
// ========== Handle Add Stock for each Item
// ======================================
const handleAddStock = () => {
  const addStockFormContainer = document.querySelector('.inventory-table__add-stock');
  const editStockFormContainer = document.querySelector('.inventory-table__edit-stock');

  const addStockForm = document.querySelector('.inventory-table__add-stock .add-stock__form');
  const editStockForm = document.querySelector('.inventory-table__edit-stock .edit-stock__form');

  const addStockBtns = document.querySelectorAll('.add-stock__medicine-table');
  const editStockBtns = document.querySelectorAll('.edit-stock__medicine-table');

  // Add Stock
  addStockBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.dataset.setItemId;
      //alert(`➕ Add Item, Item Id: ${itemId}`);
      addStockFormContainer.classList.add('show');
      addStock(itemId);
    });
  });

  //Edit Stock
  editStockBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.dataset.setItemId;
      //alert(`✏️ Edit Item, Item Id: ${itemId}`);
      editStockFormContainer.classList.add('show');
      setupEditStockForm(itemId);
      editStock(itemId);
    });
  });

  // Hide Form
  const addStock_cancelBtn = document.querySelector('.inventory-table__add-stock .add-stock__cancel-btn');
  const editStock_cancelBtn = document.querySelector('.inventory-table__edit-stock .edit-stock__cancel-btn');
  addStock_cancelBtn.addEventListener('click', function() {
    addStockFormContainer.classList.remove('show');
    addStockForm.reset();
  });
  editStock_cancelBtn.addEventListener('click', function() {
    editStockFormContainer.classList.remove('show');
    editStockForm.reset();
  });
};


// ======================================
// ========== Setup Edit Stock Form
// ======================================
const setupEditStockForm = async(itemId) => {
    const allStocks = await fetchInventoryStocks();
    const stock = allStocks.find(i => i._id === itemId);

    const quantityInputValue = document.querySelector('#edit-stock__quantity-input').value = stock.quantity;
    const contentInputValue = document.querySelector('#edit-stock__content-input').value = stock.content;
}




export default function setupInventorySection() {
  toggleMedicineButtons();
  handleRenderInventory();
  handleAddItem();
  handleItemButtonsActions();
  searchInventory();
  filterInventory();
  inventorySorting();
  toggleAddMedicineForm();
  viewBtnsFunctionality();
  handleInventoryStocks();
  setupAddStockFormListener(); // Listener for adding Stocks
  setupEditStockFormListener() // Listener for updating Stocks
}



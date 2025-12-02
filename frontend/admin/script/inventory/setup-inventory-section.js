import handleRenderInventory from "./display-inventory.js";
import handleAddItem from "./add-medicine.js";
import handleEditItem from "./edit-item.js";
import {handleRemoveItem, handleRestoreItem, handleDeleteItem} from "./remove-restore-delete-item.js";
import {generateInventoryReport, displayInventoryReport} from "../reports/generate-inventory-reports.js";
import fetchUser from "../auth/fetchUser.js";
import {createInventoryTable, getMedicineId, getCurrentMedicineId} from "./create-inventory-table.js";
import { addItem, addStock, setupAddStockFormListener,
         editStock, setupEditStockFormListener
        } from "./add-item-add-stock-edit.js";


import { fetchInventoryStocks } from "../../api/fetch-inventory-stock.js";
import initInventoryFiltering from "../../utils/filter-inventory-items.js";


// ======================================
// ========== Search Inventory
// ======================================
const searchInventory = () => {
  const input = document.querySelector('.inventory-section__search-input');
  if (!input) return;

  let timeout;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const query = input.value.trim().toLowerCase();
      const medicines = document.querySelectorAll('.inventory-table .medicine');

      medicines.forEach(medicine => {
        const name = medicine.querySelector('.medicine-name')?.textContent.toLowerCase() || '';
        const quantity = medicine.querySelector('.quantity')?.textContent.toLowerCase() || '';
        const status = medicine.querySelector('.status')?.textContent.toLowerCase() || '';
        const text = `${name} ${quantity} ${status}`;
        medicine.style.display = text.includes(query) ? 'flex' : 'none';
      });
    }, 200);
  });

  // ✅ Optional: clear input each time inventory reloads
  document.addEventListener('renderInventoryPreHeading', () => {
    input.value = '';
  });
};




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

    initInventoryFiltering();
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
        displayInventoryReport();
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


const renderInventoryPreHeading = () => {
  document.addEventListener('renderInventoryPreHeading', () => {
    displayMedicineTable();
    searchInventory();
  });
}


function InventoryFiltering() {
  const categorySelect = document.getElementById("inventory-category");
  if (!categorySelect) return;

  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value.toLowerCase();  // injectable / solution / consumables / all
    const rows = document.querySelectorAll(".inventory-table__tbody .medicine");

    rows.forEach(row => {
      const category = row.querySelector(".category")?.textContent.trim().toLowerCase() || "";

      if (selected === "all") {
        row.style.display = "flex";
      } else {
        row.style.display = (category === selected) ? "flex" : "none";
      }
    });
  });
}


export default function setupInventorySection() {
  toggleMedicineButtons();
  handleRenderInventory();
  handleAddItem();
  handleItemButtonsActions();
  toggleAddMedicineForm();
  viewBtnsFunctionality();
  handleInventoryStocks();
  setupAddStockFormListener(); // Listener for adding Stocks
  setupEditStockFormListener() // Listener for updating Stocks
  renderInventoryPreHeading();
  InventoryFiltering();
}

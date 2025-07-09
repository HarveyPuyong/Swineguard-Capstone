import {inventoryTable, adminPageInventoryTable} from '../../utils/inventory-table.js';
import api from './../../utils/axiosConfig.js';


const handleRenderInventory = async() => {
  try {
    const response = await api.get('/inventory/all');

    const data = response?.data;
    const inventories = data.slice().reverse(); 

    const inventoryTableElement = document.querySelector('#inventory-section .inventory-table__tbody');
    const AdminInventoryTableElement = document.querySelector('.admin-page__section-wrapper #inventory-section .inventory-table__tbody');

    inventoryTable(inventories, inventoryTableElement);
    adminPageInventoryTable(inventories, AdminInventoryTableElement);

  } catch (error) {
    console.log(error)
  }
}

export default handleRenderInventory;
import renderInventoryTable from '../../utils/inventoryTable.js';
import api from './../../utils/axiosConfig.js';


const handleRenderInventory = async() => {
  try {
    const response = await api.get('/inventory/all');

    const data = response?.data;
    const inventories = data.slice().reverse(); 

    const inventoryTable = document.querySelector('#inventory-section .inventory-table__tbody')

    renderInventoryTable(inventories, inventoryTable);

  } catch (error) {
    console.log(error)
  }
}

export default handleRenderInventory;
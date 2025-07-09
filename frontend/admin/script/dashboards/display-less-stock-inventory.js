import {inventoryTable, adminPageInventoryTable} from '../../utils/inventory-table.js';
import formatItemStatus from '../../utils/format-item-status.js';
import api from '../../utils/axiosConfig.js';

const displayLessStockInventory = async () => {
  try {
    const response = await api.get('/inventory/all');
    const inventories = response?.data;

    const filteredInventory = inventories.filter(item => {
      const status = formatItemStatus(item.itemStatus);
      return status === 'less-stock' || status === 'out-of-stock';
    });

    const inventoryTableElement = document.querySelector('#dashboard-section .inventory-table__tbody');
    const adminInventoryTableElement = document.querySelector('.admin-page__section-wrapper #dashboard-section .inventory-table__tbody');

    inventoryTable(filteredInventory, inventoryTableElement);
    adminPageInventoryTable(filteredInventory, adminInventoryTableElement);

  } catch (error) {
    console.error(error);
  }
};

export default displayLessStockInventory;

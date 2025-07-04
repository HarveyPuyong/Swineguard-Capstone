import renderInventoryTable from '../../utils/inventory-table.js';
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

    const inventoryTable = document.querySelector('#dashboard-section .inventory-table__tbody');

    renderInventoryTable(filteredInventory, inventoryTable)

  } catch (error) {
    console.error(error);
  }
};

export default displayLessStockInventory;

import api from '../utils/axiosConfig.js';
import fetchInventory from './fetch-inventory.js';

const fetchInventoryStocks = async() => {
  try {
    const response = await api.get('/inventory/all/items', {withCredentials: true});

    if(response.status === 200) return response.data
  } catch (error) {
    cconsole.error('Failed to fetch inventory:', error);
    throw error; 
  }
}

const returnStockNumber = async(medicine_Id) => {

  const stocks = await fetchInventoryStocks();
  const filteredStock = stocks.filter(stock => stock.medicineId === medicine_Id);

  let totalQuantity = 0;

  filteredStock.forEach(item => {
    //totalQuantity.push(item.quantity); 
    totalQuantity += item.quantity; 
  });

  return totalQuantity;
}

export {
          fetchInventoryStocks,
          returnStockNumber
        };
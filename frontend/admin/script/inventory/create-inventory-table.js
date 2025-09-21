import fetchInventory from "../../api/fetch-inventory.js";
import {fetchInventoryStocks} from "../../api/fetch-inventory-stock.js";
import { formatDate, formattedDate } from "../../utils/formated-date-time.js";

// Medicine Id that changes every click of pre heading of medicines
let currentMedicineId = null;

const createInventoryTable = async () => {
    const heading = document.querySelector(".medicine-table__heading"); // Heading H2
    const inventories = await fetchInventory();
    const stocks = await fetchInventoryStocks();

    const findMedicine = inventories.find((i) => i._id === currentMedicineId);
    const filteredStocks = stocks.filter(stock => stock.medicineId === currentMedicineId);

    let table = ''; //Stock storage

    if (!findMedicine) {
        heading.textContent = "Medicine not found";
        return;
    }

    if (filteredStocks.length === 0) {
        table = `
            <thead>
                <tr>
                    <th>Item No.</th>
                    <th>Content (ml)</th>
                    <th>Quantity</th>
                    <th>Expiration Date</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td colspan='5'>No Stock found</td>
                </tr>
            </tbody>
        `;
        document.querySelector("#inventory-table__stock-management").innerHTML = table;
    }

    const medicineName = findMedicine.itemName || "Unnamed";
    heading.textContent = medicineName.charAt(0).toUpperCase() + medicineName.slice(1);

    let count = 1;
    let rows = '';

    filteredStocks.forEach(stock => {
        rows += `
            <tr>
                <td>${count}</td>
                <td>${stock.content}</td>
                <td>${stock.quantity}</td>
                <td>${formattedDate(stock.expiryDate)}</td>
                <td>
                    <button class="add-stock__medicine-table" data-set-item-id="${stock._id}">➕ Add Stock</button>
                    <button class="edit-stock__medicine-table" data-set-item-id="${stock._id}">✏️ Edit</button>
                </td>
            </tr>
        `;
        count++;
    });

    table = `
        <thead>
            <tr>
                <th>Item No.</th>
                <th>Content (ml)</th>
                <th>Quantity</th>
                <th>Expiration Date</th>
                <th>Actions</th>
            </tr>
        </thead>

        <tbody>
            ${rows || '<tr><td colspan="4">Click add item to add some stocks</td></tr>'}
        </tbody>
    `;

    document.querySelector("#inventory-table__stock-management").innerHTML = table;

    // fire custom event after rendering
    document.dispatchEvent(new Event("renderInventoryStockTable"));
};

const getMedicineId = (medicineId) => {
  currentMedicineId = medicineId;
};

const getCurrentMedicineId = () => currentMedicineId;

export { createInventoryTable, getMedicineId, getCurrentMedicineId };

//const Inventory = require('../models/inventoryModel');
const { Inventory, InventoryStock } = require('../models/inventoryModel');
const appointmentDB = require('../models/appointmentModel');

const mongoose = require('mongoose');
const {isValidNumber, isInvalidInput, checkExpiryDate} = require('./../utils/inventoryUtils');


//Add Medicine Name Main
exports.AddMedicine = async (req, res) => {
    const { itemName, category } = req.body;

    if (isInvalidInput(itemName) || isInvalidInput(category)) {
        return res.status(400).json({ message: 'Medicine name must not contain emoji' });
    }

    try {
        // Check if the medicine already exists (case-insensitive)
        const existing = await Inventory.findOne({ itemName: new RegExp(`^${itemName}$`, 'i'), category: category  });
        if (existing) {
        return res.status(409).json({ message: 'Medicine name already exists.' });
        }

        // Create new medicine document
        const newMedicine = new Inventory({ itemName, category });
        await newMedicine.save();

        return res.status(201).json({
        message: "Medicine added successfully.",
        item: newMedicine
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({
        message: 'Something went wrong while adding medicine.'
        });
    }
};


// Add Item to the collections
// Add Item to the collections
exports.AddItem = async (req, res) => {
  try {
    const { medicineId, content, quantity, expiryDate } = req.body;

    // Fetch medicine to check its category
    const medicine = await Inventory.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found." });
    }

    // Force content = 0 if category is consumables
    let finalContent = content;
    if (medicine.category === "consumables") {
      finalContent = 0; 
    }

    // Empty check (but content is allowed to be 0 for consumables)
    const itemData = { medicineId, finalContent, quantity, expiryDate };
    const hasEmpty = Object.values(itemData).some(
      v => v === undefined || v === null || v === ""
    );
    if (hasEmpty) {
      return res.status(400).json({ message: "itemData contains empty fields", itemData });
    }

    // Validate quantity only (content is ignored for consumables)
    if (!isValidNumber(quantity)) {
      return res.status(400).json({ message: "Quantity must be a number > 0" });
    }

    // Validate content only if NOT consumables
    if (medicine.category !== "consumables" && !isValidNumber(finalContent)) {
      return res.status(400).json({ message: "Content must be a number > 0" });
    }

    // Validate expiry
    if (!checkExpiryDate(expiryDate)) {
      return res.status(400).json({
        message: "Expiration must be 1 month ahead or future date",
      });
    }

    // Convert to numbers
    const numericContent = Number(finalContent);
    const numericQuantity = Number(quantity);

    // Find existing item
    const existingItem = await InventoryStock.findOne({
      medicineId,
      content: numericContent,
      expiryDate,
    });

    if (existingItem) {
      existingItem.quantity += numericQuantity;
      await existingItem.save();
      return res.status(200).json({
        message: "Item already exists. Quantity updated.",
        item: existingItem,
      });
    }

    // Create new item
    const newItem = new InventoryStock({
      medicineId,
      content: numericContent,
      quantity: numericQuantity,
      expiryDate,
    });

    await newItem.save();

    return res.status(201).json({
      message: "New item added successfully.",
      item: newItem,
    });
  } catch (err) {
    console.error("Error while adding item:", err);
    return res.status(500).json({
      message: "Something went wrong while adding new Item.",
      error: err.message,
    });
  }
};


// Add Stock
exports.addStock = async (req, res) => {
  try {

    const { id } = req.params;
    const { quantity } = req.body;

    // Validate content/quantity
    if (!isValidNumber(quantity)) {
      return res.status(400).json({ message: "Item quantity must be numbers > 0" });
    }

    const numericQuantity = Number(quantity);

    const updatedStock = await InventoryStock.findByIdAndUpdate(
      id,
      { $inc: { quantity: numericQuantity }},
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found." });
    }

    return res.status(200).json({
            message: 'Stock added successfully.',
            item: updatedStock
    });

  } catch (err) {
    console.error("Error while adding item:", err);
    return res.status(500).json({ message: "Something went wrong while adding stocks.", error: err.message });
  }
}


// Edit Stock
exports.editStock = async (req, res) => {
  try {

    const { id } = req.params;
    const { quantity, content } = req.body;

    // Validate content/quantity
    if (!isValidNumber(quantity) || !isValidNumber(content)) {
      return res.status(400).json({ message: "Item quantity & content must be numbers > 0" });
    }

    const numericQuantity = Number(quantity);
    const numericContent = Number(content);

    const itemData = { quantity: numericQuantity, content: numericContent }

    const updatedStock = await InventoryStock.findByIdAndUpdate(
      id,
      itemData,
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found." });
    }

    return res.status(200).json({
            message: 'Stock updated successfully.',
            item: updatedStock
    });

  } catch (err) {
    console.error("Error while adding item:", err);
    return res.status(500).json({ message: "Something went wrong while updating stocks.", error: err.message });
  }
}


// Get All Medicine
exports.getAllMedicine = async (req, res) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Medicine
exports.getAllItem = async (req, res) => {
    try {
        const items = await InventoryStock.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Use Medicine (subtract based on ml and stock content)
exports.useMedicine = async (req, res) => {
  try {
    const { id, amountUsed } = req.body;

    if (!isValidNumber(amountUsed)) {
      return res.status(400).json({ message: "Amount used must be a valid number > 0" });
    }

    let remainingMl = Number(amountUsed);

    // Fetch medicine stocks sorted by expiry (soonest first)
    let stocks = await InventoryStock.find({ id }).sort({ expiryDate: 1 });

    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ message: "No stock available for this medicine." });
    }

    const updates = [];

    for (let stock of stocks) {
      if (remainingMl <= 0) break;

      // how many ml this stock can provide
      let stockCapacityMl = stock.content * stock.quantity;

      if (stockCapacityMl > 0) {
        // how much we take from this stock (in ml)
        let deductMl = Math.min(stockCapacityMl, remainingMl);

        // how many full units we need to remove
        let unitsToDeduct = Math.floor(deductMl / stock.content);

        // if there’s leftover ml smaller than 1 full unit, still consume 1 unit
        if (deductMl % stock.content > 0) {
          unitsToDeduct += 1;
        }

        // but don’t remove more units than available
        unitsToDeduct = Math.min(unitsToDeduct, stock.quantity);

        // update stock
        stock.quantity -= unitsToDeduct;
        await stock.save();

        // reduce the ml still needed
        remainingMl -= unitsToDeduct * stock.content;

        updates.push({
          stockId: stock._id,
          deductedUnits: unitsToDeduct,
          unitContent: stock.content,
          deductedMl: unitsToDeduct * stock.content,
          leftUnits: stock.quantity
        });
      }
    }

    if (remainingMl > 0) {
      return res.status(400).json({
        message: `Not enough stock. Short by ${remainingMl} ml.`,
        updates
      });
    }

    return res.status(200).json({
      message: "Medicine usage recorded successfully.",
      updates
    });

  } catch (err) {
    console.error("Error while using medicine:", err);
    return res.status(500).json({
      message: "Something went wrong while using medicine.",
      error: err.message
    });
  }
};


// Update Quantity
// Update Quantity (simple, no filters)
exports.deductStock = async (req, res) => {
  try {
    const { medications } = req.body;

    if (!Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({ message: "Medications array is required." });
    }

    const updatedStocks = [];

    for (const med of medications) {
      const stock = await InventoryStock.findById(med.variation);

      if (!stock) {
        return res.status(404).json({ message: `Stock not found: ${med.variation}` });
      }

      stock.quantity -= med.amount;

      if (stock.quantity <= 0) stock.status = "Out of Stock";

      await stock.save();

      updatedStocks.push({
        stockId: stock._id,
        deducted: med.amount,
        remaining: stock.quantity
      });
    }

    return res.status(200).json({
      message: "Stock deducted successfully.",
      updatedStocks
    });

  } catch (err) {
    console.error("Error deducting stock:", err);
    return res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
};


// Edit Stock
// Edit Medicine Category
exports.editMedicineCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    // Validate input
    if (!category || category.trim() === "") {
      return res.status(400).json({ message: "Category cannot be empty." });
    }

    const updatedStock = await Inventory.findByIdAndUpdate(
      id,
      { category },   // <-- FIX: wrap in an object
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Item not found." });
    }

    return res.status(200).json({
      message: "Category updated successfully.",
      item: updatedStock
    });

  } catch (err) {
    console.error("Error while updating category:", err);
    return res.status(500).json({
      message: "Something went wrong while updating category.",
      error: err.message
    });
  }
};

// Get All Medicine
exports.getMedicineById = async (req, res) => {
    try {
      const {id} = req.params;
      const items = await Inventory.findById(id);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};



// Check item Id
function checkItemId (id) {
    return mongoose.Types.ObjectId.isValid(id);
}
const { SwineReport, InventoryReport } = require('../models/monthlyReportModel');
const { Inventory, InventoryStock } = require('./../models/inventoryModel');

// ======================================
// ========== Monthly Swine Report
// ======================================
exports.saveMonthlyReport = async (req, res) => {
  const { month, year, swineData, overwrite } = req.body;

  try {
    const existingReport = await SwineReport.findOne({ month, year });

    if (existingReport) {
      if (!overwrite) {
        return res.status(409).json({
          message: 'Monthly report already exists. Overwrite?'
        });
      }

      // Overwrite existing report
      existingReport.swineData = swineData; // ✅ Save full barangay data including raisers info
      await existingReport.save();

      return res.status(200).json({ message: 'Monthly report overwritten successfully.' });
    }

    // Create new report
    const newSwineReport = new SwineReport({
      month,
      year,
      swineData // ✅ Each object has raisersCount, maleRaisers, femaleRaisers
    });

    await newSwineReport.save();

    res.status(200).json({ message: 'Monthly report saved successfully.' });

  } catch (error) {
    console.error('Save report error:', error);
    res.status(500).json({ message: 'Failed to save monthly report.' });
  }
};

exports.getMonthlyReport = async (req, res) => {
    try {
        const reports = await SwineReport.find();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ message: 'Failed to get report.' });
    }
}


// ======================================
// ========== Monthly Inventory Report
// ======================================
exports.saveInventoryReport = async (req, res) => {
  const { month, year, inventoryData } = req.body;
  console.log("Incoming report data:", req.body); // <--- add this

  try {
    const existingReport = await InventoryReport.findOne({ month, year });

    if (existingReport) {
      return res.status(400).json({ message: 'Monthly report already existed.' });
    }

    const newInventoryReport = new InventoryReport({
      month,
      year,
      inventoryData
    });

    await newInventoryReport.save();
    res.status(200).json({ message: 'Monthly report saved successfully.' });

  } catch (error) {
    console.error('Save report error:', error); // <--- check this
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Monthly report already exists (duplicate).' });
    }
    res.status(500).json({ message: 'Failed to save monthly report.' });
  }
};

exports.fetchInventoryReport = async (req, res) => {
  try {
    const reports = await InventoryReport.find();
    res.status(200).json({reports});
  } catch (error) {
      console.error('Get report error:', error);
      res.status(500).json({ message: 'Failed to get report.' });
    }
}

exports.fetchFullInventory = async (req, res) => {
  try {
    const stocks = await InventoryStock.find().populate("medicineId", "itemName");
    const formatted = stocks.map(stock => ({
      _id: stock.medicineId,
      itemName: stock.medicineId.itemName, // from Inventory
      content: stock.content,               // stock
      quantity: stock.quantity,
      expiryDate: stock.expiryDate,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    }));
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

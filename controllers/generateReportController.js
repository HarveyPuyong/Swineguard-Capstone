const { SwineReport, InventoryReport } = require('../models/monthlyReportModel');

// ======================================
// ========== Monthly Swine Report
// ======================================
// exports.saveMonthlyReport = async (req, res) => {
//   const { month, year, swineData } = req.body;

//     try {
//         const existingReport = await SwineReport.findOne({ month, year });

//         if (existingReport) return res.status(400).json({ message: 'Monthly report already existed.' });

//         // No report yet — create a new one
//         const newSwineReport = new SwineReport({
//             month,
//             year,
//             swineData
//         });

//         await newSwineReport.save();
//         res.status(200).json({ message: 'Monthly report saved successfully.' });

//     } catch (error) {
//         console.error('Save report error:', error);
//         if (error.code === 11000) {
//           return res.status(400).json({ message: 'Monthly report already exists (duplicate).' });
//         }
//         res.status(500).json({ message: 'Failed to save monthly report.' });
//     }
// };

exports.saveMonthlyReport = async (req, res) => {
  const { month, year, swineData, overwrite } = req.body;

  try {
    const existingReport = await SwineReport.findOne({ month, year });

    if (existingReport) {
      if (!overwrite) {
        // Tell frontend it exists
        return res.status(409).json({ 
          message: 'Monthly report already exists. Overwrite?' 
        });
      }
      // Overwrite if confirmed
      existingReport.swineData = swineData;
      await existingReport.save();
      return res.status(200).json({ message: 'Monthly report overwritten successfully.' });
    }

    // Create new report
    const newSwineReport = new SwineReport({ month, year, swineData });
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
  try {
    const existingReport = await InventoryReport.findOne({ month, year });

    if (existingReport) return res.status(400).json({ message: 'Monthly report already existed.' });

    // No report yet — create a new one
    const newInventoryReport = new InventoryReport({
        month,
        year,
        inventoryData
    });

    await newInventoryReport.save();
    res.status(200).json({ message: 'Monthly report saved successfully.' });

  } catch (error) {
    console.error('Save report error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Monthly report already exists (duplicate).' });
    }
    res.status(500).json({ message: 'Failed to save monthly report.' });
}
};

// Get all inventory reports
exports.getAllInventoryReports = async (req, res) => {
  try {
    const reports = await InventoryReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory reports', error });
  }
};
const reportDB = require('../models/monthlyReportModel');

exports.saveMonthlyReport = async (req, res) => {
  const { month, year, swineData } = req.body;

    try {
        const existingReport = await reportDB.findOne({ month, year });

        if (existingReport) return res.status(400).json({ message: 'Monthly report already existed.' });

        // No report yet — create a new one
        const newSwineReport = new reportDB({
            month,
            year,
            swineData
        });

        await newSwineReport.save();
        res.status(200).json({ message: 'Monthly report saved successfully.' });

    } catch (error) {
        console.error('Save report error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Monthly report already exists (duplicate).' });
        }
        res.status(500).json({ message: 'Failed to save monthly report.' });
    }
};

exports.getMonthlyReport = async (req, res) => {
    try {
        const reports = await reportDB.find();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ message: 'Failed to get report.' });
    }
}


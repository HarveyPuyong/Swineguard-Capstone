const {swineSchema, swineHealthRecordSchema, SwinePopulation} = require('./../models/swineModel');
const generateSwineId = require('./../utils/generate-swine-id')
const mongoose = require('mongoose');

// Add Swine
exports.addSwine = async (req, res) => {
    const { swines, clientId } = req.body;

    if (!Array.isArray(swines) || swines.length === 0) {
        return res.status(400).json({ message: 'No swine added. Please provide at least one swine.' });
    }

    try {
        const newSwines = [];

        for (const swine of swines) {
            const { breed, type, birthdate, sex, status, weight } = swine;

            // Validate birthdate
            if (new Date(birthdate) > new Date()) {
                return res.status(400).json({ message: 'Birthdate cannot be in the future.' });
            }

            // Validate weight
            if (!isValidNumber(weight)) {
                return res.status(400).json({ message: 'Swine weight must be valid numbers greater than 0.' });
            }

            const numericWeight = Number(weight);

            // Generate Unique 4-digit ID
            const generatedSwineId = await generateSwineId();

            const swineData = {
                swineFourDigitId: generatedSwineId,
                breed,
                type,
                birthdate,
                sex,
                status,
                weight: numericWeight,
                clientId
            };

            if (Object.values(swineData).some(field => field === undefined || field === null)) {
                return res.status(400).json({ message: 'Kindly check your swine details.' });
            }

            const newSwine = new swineSchema(swineData);
            await newSwine.save();
            newSwines.push(newSwine);
        }

        return res.status(201).json({
            message: `${newSwines.length} swine(s) added successfully.`,
            newSwines
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({
            message: 'Something went wrong while adding swine.',
            error: err.message
        });
    }
};

// Update Swine
exports.editSwine = async (req, res) => {
    const { id } = req.params;

    const {type, weight, status, cause} = req.body;

    // Validate object Id
    if (!isValidSwineId(id)) return res.status(400).json({ message: "Invalid Swine ID." });

    // Validate swine weight
    if(!isValidNumber(weight)) return res.status(400).json({ message: 'Swine weight must be valid numbers greater than 0' });

    // ✅ Convert to numbers after validation
    const numericWeight = Number(weight);

    const swineData = {type, weight: numericWeight, status, cause};

    // Validate input fields
    if (Object.values(swineData).some(field => field === undefined || field === null)) {
        return res.status(400).json({ message: 'Kindly check your swine details' });
    }

    if(!id) return res.status(400).json({message: "Swine id not found."});

    try {
        const updatedSwineData = await swineSchema.findByIdAndUpdate(
            id,
            { ...swineData },
            { new: true }
        );

        if (!updatedSwineData) {
            return res.status(404).json({ message: 'Swine not found.' });
        }

        return res.status(200).json({
            message: 'Swine updated successfully.',
            item: updatedSwineData
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({
            message: 'Something went wrong while updating swine data.'
        });
    }
}

// Remove Swine 
exports.removeSwine = async (req, res) => {
    const {id} = req.params;

    // Validate Object Id
    if(!isValidSwineId(id)) return res.status(400).json({ message: "Invalid Swine Id." });
    try {
        const removedSwine = await swineSchema.findByIdAndUpdate(
            id,
            { status: "removed" },
            { new: true }
        );

        if (!removedSwine) { return res.status(404).json({ message: 'Swine not found.' }); }

        res.status(200).json({
            message: " Swine removed successfully.",
            swine: removedSwine
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({ message: "Something went wrong when removing swine." });
    }

}

// Restore Swine
exports.restoreSwine = async (req, res) => {
    const { id } = req.params;
    
    // Validate Object Id / Swine Id
    if (!isValidSwineId(id)) return res.status(400).json({ message: 'Invalid Swine Id.' });

    try {
        const restoredSwine = await swineSchema.findByIdAndUpdate (
            id,
            { status: 'active' },
            {new: true}
        );

        if (!restoredSwine) return res.status(404).json({ message: "Swine not found." });

        res.status(200).json({
            message: 'Swine restored successfully.',
            swine: restoredSwine
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({ message: 'Something went wrong while restoring swine.'});
    }

}

// Delete Swine
exports.deleteSwine = async (req, res) => {

    const {id} = req.params;

    //Validate Object Id
    if(!isValidSwineId(id)) return res.status(400).json({ message: "Invalid Swine Id." });

    try {
        const deletedSwine = await swineSchema.findByIdAndDelete(id);

        if(!deletedSwine) return res.status(404).json({ message: "Swine not found." });

        res.status(200).json({ message: "Swine deleted successfully", swine: deletedSwine });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({ message: "Something went wrong while deleting Swine." });
    }
}

// Get all Swine
exports.getSwine = async (req, res) => {
    try {
        const swines = await swineSchema.find();
        res.status(200).json(swines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get Swine by id
exports.getSwineById = async (req, res) => {
    const { id } = req.params;
    try {
        const swineFound = await swineSchema.findById(id);
        res.status(200).json(swineFound);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Edit and save swine data to the montly records
exports.saveSwineMonthlyRecords = async (req, res) => {
    const { monthlyWeight, monthlyStatus, swineId, month, year, overwrite } = req.body;

    try {
        const existingRecord = await swineHealthRecordSchema.findOne({ swineId, month, year });

        if (existingRecord) {
            if (!overwrite) {
                return res.status(409).json({
                    message: 'Monthly record already exists. Do you want to overwrite it?'
                });
            }

            // Overwrite existing record
            existingRecord.monthlyWeight = Number(monthlyWeight);
            existingRecord.monthlyStatus = monthlyStatus;
            await existingRecord.save();

            return res.status(200).json({
                message: 'Swine monthly record overwritten successfully.'
            });
        }

        // Create new record
        const newRecord = new swineHealthRecordSchema({
            swineId,
            monthlyWeight: Number(monthlyWeight),
            monthlyStatus,
            month,
            year
        });

        await newRecord.save();

        return res.status(200).json({
            message: 'Swine monthly record saved successfully.'
        });

    } catch (error) {
        console.error('Save swine monthly record error:', error);
        res.status(500).json({ message: 'Failed to save swine monthly record.' });
    }
};


// Save multiple swine
exports.saveMultipleSwineMonthlyRecords = async (req, res) => {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({ message: 'No records provided.' });
    }

    try {
        const results = [];

        for (const record of records) {
            const { swineId, monthlyWeight, monthlyStatus, month, year, overwrite } = record;

            if (!swineId || isNaN(monthlyWeight) || monthlyWeight <= 0 || !month || !year) {
                results.push({ swineId, status: 'failed', reason: 'Invalid data' });
                continue;
            }

            const existingRecord = await swineHealthRecordSchema.findOne({ swineId, month, year });

            if (existingRecord) {
                if (!overwrite) {
                    results.push({ swineId, status: 'skipped', reason: 'Record exists' });
                    continue;
                }

                existingRecord.monthlyWeight = monthlyWeight;
                existingRecord.monthlyStatus = monthlyStatus;
                await existingRecord.save();
                results.push({ swineId, status: 'updated' });
            } else {
                const newRecord = new swineHealthRecordSchema({
                    swineId,
                    monthlyWeight,
                    monthlyStatus,
                    month,
                    year
                });
                await newRecord.save();
                results.push({ swineId, status: 'created' });
            }
        }

        return res.status(200).json({ message: 'Monthly records processed', results });

    } catch (error) {
        console.error('Save multiple monthly records error:', error);
        res.status(500).json({ message: 'Failed to save monthly records.' });
    }
};


// Get swine Montly Records
exports.getSwineMontlyRecords = async (req, res) => {
    try {
        const swineRecords = await swineHealthRecordSchema.find();
        res.status(200).json({ records: swineRecords });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong getting swine monthly records' })
    }
}


// Check item Id
function isValidSwineId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// Validate inputs letters and negative numbers are not allowed
function isValidNumber (value) {
    if (typeof value !== 'string') return false; // Only allow strings

    // Reject exponential, letters, negatives, etc.
    if (!/^\d+(\.\d+)?$/.test(value)) return false;

    const number = Number(value);
    return !isNaN(number) && isFinite(number) && number > 0;
};





// Add Swine Population
exports.addSwinePopulation = async (req, res) => {
  try {
    const { municipality, barangays, month, year } = req.body;

    if (!municipality || !Array.isArray(barangays) || barangays.length === 0) {
      return res.status(400).json({ message: "Municipality and barangays data required" });
    }

    const population = new SwinePopulation({
      municipality,
      barangays,
      month,
      year,
    });

    await population.save();
    res.status(201).json({ message: "Swine population saved successfully", data: population });
  } catch (error) {
    console.error("Error saving swine population:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all swine population records
exports.getSwinePopulations = async (req, res) => {
  try {
    const data = await SwinePopulation.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get by municipality / month / year
exports.getSwinePopulationByFilter = async (req, res) => {
  try {
    const { municipality, month, year } = req.query;
    const filter = {};

    if (municipality) filter.municipality = municipality;
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);

    const data = await SwinePopulation.find(filter);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
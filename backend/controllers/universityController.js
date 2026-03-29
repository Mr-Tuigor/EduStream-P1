const University = require('../models/University');

// @desc    Get all universitys, classes, and subjects
// @route   GET /api/universitys
const getUniversity = async (req, res) => {
    try {
        const universities = await University.find({}); // Fetch everything from the universitys collection
        res.json(universities);
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not fetch universitys" });
    }
};

module.exports = { getUniversity };
const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    university: { type: String, required: true }, // e.g., "Nagpur"
    branches: [
        {
            branchName: { type: String }, // e.g., "ETC"
            semesters: [
                {
                 semester: String,  // e.g., "5"
                 subjects: [{ type: String }]  // e.g., ["EMW, DSP"]
                }
            ],
            
        }
    ]
});

module.exports = mongoose.model('University', universitySchema);
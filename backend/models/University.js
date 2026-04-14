const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    university: { type: String, required: true }, // e.g., "Nagpur"
    branches: [
        {
            branchName: { type: String }, // e.g., "ETC"
            semesters: [
                {
                    semester: String,  // e.g., "5"
                    subjects: [
                        {
                            subjectName: { type: String, required: true }, // e.g., "Java Programming(OE)"
                            units: [
                                {
                                    unitNumber: { type: String, required: true }, // e.g., "Unit 1"
                                    unitName: { type: String, default: "" }       // e.g., "Introduction to Java" (OPTIONAL — show in frontend if present)
                                }
                            ]
                        }
                    ]
                }
            ],
            
        }
    ]
});

// Index for fast university lookups
universitySchema.index({ university: 1 });

module.exports = mongoose.model('University', universitySchema);
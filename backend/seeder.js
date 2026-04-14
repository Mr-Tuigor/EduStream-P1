const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Universities = require('./models/University'); // Import the University model
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await Universities.deleteMany();

        const universities = [
            {
                university: "Nagpur",
                branches: [ // Matches plural schema
                    {
                        branchName: "ETC",
                        semesters: [ // Matches nested plural schema
                            {
                                semester: "5",
                                subjects: [
                                    {
                                        subjectName: "Sensor and Systems",
                                        units: [
                                            { unitNumber: "Unit 1", unitName: "" },
                                            { unitNumber: "Unit 2", unitName: "" },
                                            { unitNumber: "Unit 3", unitName: "" },
                                            { unitNumber: "Unit 4", unitName: "" },
                                            { unitNumber: "Unit 5", unitName: "" }
                                        ]
                                    },
                                    {
                                        subjectName: "Embedded System",
                                        units: [
                                            { unitNumber: "Unit 1", unitName: "" },
                                            { unitNumber: "Unit 2", unitName: "" },
                                            { unitNumber: "Unit 3", unitName: "" },
                                            { unitNumber: "Unit 4", unitName: "" },
                                            { unitNumber: "Unit 5", unitName: "" }
                                        ]
                                    },
                                    {
                                        subjectName: "DSP",
                                        units: [
                                            { unitNumber: "Unit 1", unitName: "" },
                                            { unitNumber: "Unit 2", unitName: "" },
                                            { unitNumber: "Unit 3", unitName: "" },
                                            { unitNumber: "Unit 4", unitName: "" },
                                            { unitNumber: "Unit 5", unitName: "" }
                                        ]
                                    },
                                    {
                                        subjectName: "EMW",
                                        units: [
                                            { unitNumber: "Unit 1", unitName: "" },
                                            { unitNumber: "Unit 2", unitName: "" },
                                            { unitNumber: "Unit 3", unitName: "" },
                                            { unitNumber: "Unit 4", unitName: "" },
                                            { unitNumber: "Unit 5", unitName: "" }
                                        ]
                                    }
                                ] 
                            },
                            {
                                semester: "6",
                                subjects: [
                                    {
                                        subjectName: "CSE",
                                        units: [
                                            { unitNumber: "Unit 1", unitName: "" },
                                            { unitNumber: "Unit 2", unitName: "" },
                                            { unitNumber: "Unit 3", unitName: "" },
                                            { unitNumber: "Unit 4", unitName: "" },
                                            { unitNumber: "Unit 5", unitName: "" }
                                        ]
                                    },
                                    {
                                        subjectName: "CCN",
                                        units: [
                                            { unitNumber: "Unit 1", unitName: "" },
                                            { unitNumber: "Unit 2", unitName: "" },
                                            { unitNumber: "Unit 3", unitName: "" },
                                            { unitNumber: "Unit 4", unitName: "" },
                                            { unitNumber: "Unit 5", unitName: "" }
                                        ]
                                    },
                                    {
                                        subjectName: "WSN",
                                        units: [
                                            { unitNumber: "Unit 1", unitName: "" },
                                            { unitNumber: "Unit 2", unitName: "" },
                                            { unitNumber: "Unit 3", unitName: "" },
                                            { unitNumber: "Unit 4", unitName: "" },
                                            { unitNumber: "Unit 5", unitName: "" }
                                        ]
                                    },
                                    {
                                        subjectName: "IOT",
                                        units: [
                                            { unitNumber: "Unit 1", unitName: "" },
                                            { unitNumber: "Unit 2", unitName: "" },
                                            { unitNumber: "Unit 3", unitName: "" },
                                            { unitNumber: "Unit 4", unitName: "" },
                                            { unitNumber: "Unit 5", unitName: "" }
                                        ]
                                    },
                                    {
                                        subjectName: "Java Programming(OE)",
                                        units: [
                                            { unitNumber: "Unit 1", unitName: "" },
                                            { unitNumber: "Unit 2", unitName: "" },
                                            { unitNumber: "Unit 3", unitName: "" },
                                            { unitNumber: "Unit 4", unitName: "" },
                                            { unitNumber: "Unit 5", unitName: "" }
                                        ]
                                    }
                                ] 
                            },
                        ]
                    }
                ]
            }
        ];

        await Universities.insertMany(universities);
        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

seedData();
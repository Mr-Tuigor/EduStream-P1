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
                                    "Sensor and Systems", 
                                    "Embedded System", 
                                    "DSP", 
                                    "EMW"
                                ] 
                            },
                            {
                                semester: "6",
                                subjects: [
                                    "CSE", 
                                    "CCN", 
                                    "WSN", 
                                    "IOT"
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
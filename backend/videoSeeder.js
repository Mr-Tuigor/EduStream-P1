const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const sampleVideos = [
    {
        title: "What is Electricity? - Animated Explained",
        youtubeId: "mc979OhitAg",
        imgId: "null",
        university: "Nagpur",
        branch: "ETC",
        semester: "5",
        subject: "Embedded System",
        topic: "Electricity",
        description: "A clear animation explaining the flow of electrons and current."
    },
    {
        title: "Newton's First Law of Motion",
        youtubeId: "1XSyyuE6x1I",
        imgId: "null",
        university: "Nagpur",
        branch: "ETC",
        semester: "5",
        subject: "EMW",
        topic: "Laws of Motion",
        description: "Conceptual video about inertia and Newton's first law."
    },
    {
        title: "Structure of an Atom - Animation",
        youtubeId: "h6LPAwArayg",
        imgId: "null",
        university: "Nagpur",
        branch: "ETC",
        semester: "5",
        subject: "DSP",
        topic: "Atoms and Molecules",
        description: "High-quality visual of electrons, protons, and neutrons."
    }
];

const importVideos = async () => {
    try {
        await Video.deleteMany(); // Clear existing videos
        await Video.insertMany(sampleVideos);
        console.log('Sample Videos Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

importVideos();
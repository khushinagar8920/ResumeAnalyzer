const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Analysis = require("./Analysis");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(function () {
        console.log("MongoDB connected successfully!");
    })
    .catch(function (error) {
        console.error("MongoDB connection failed:", error);
    });

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
    res.send("Resume Analyzer Backend is running!");
});

app.get("/api/test", function (req, res) {
    res.json({
        message: "Resume Analyzer API is working!"
    });
});

app.post("/api/analyze", async function (req, res) {
    try {
        const resumeSkills = req.body.resumeSkills;
        const requiredSkills = req.body.requiredSkills;

        const matchedSkills = requiredSkills.filter(function (skill) {
            return resumeSkills.includes(skill);
        });

        const missingSkills = requiredSkills.filter(function (skill) {
            return !resumeSkills.includes(skill);
        });

        let matchPercentage = 0;

        if (requiredSkills.length > 0) {
            matchPercentage = Math.round(
                (matchedSkills.length / requiredSkills.length) * 100
            );
        }

        const analysis = new Analysis({
            resumeSkills: resumeSkills,
            requiredSkills: requiredSkills,
            matchedSkills: matchedSkills,
            missingSkills: missingSkills,
            matchPercentage: matchPercentage
        });

        await analysis.save();
        console.log("Analysis saved to MongoDB!");

        res.json({
            matchedSkills: matchedSkills,
            missingSkills: missingSkills,
            matchPercentage: matchPercentage,
            message: "Analysis saved successfully!"
        });

    } catch (error) {
        console.error("Analysis save failed:", error);

        res.status(500).json({
            message: "Failed to save analysis"
        });
    }
});
app.get("/api/history", async function (req, res) {
    try {
        const analyses = await Analysis.find()
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(analyses);

    } catch (error) {
        console.error("History fetch failed:", error);

        res.status(500).json({
            message: "Failed to fetch analysis history"
        });
    }
});
app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`);
});
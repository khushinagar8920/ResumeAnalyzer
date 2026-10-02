const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
    resumeSkills: {
        type: [String],
        required: true
    },

    requiredSkills: {
        type: [String],
        required: true
    },

    matchedSkills: {
        type: [String],
        required: true
    },

    missingSkills: {
        type: [String],
        required: true
    },

    matchPercentage: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Analysis", analysisSchema);
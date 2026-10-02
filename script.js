// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


// Get elements from HTML
const resumeFile = document.getElementById("resumeFile");
const uploadBtn = document.getElementById("uploadBtn");
const fileName = document.getElementById("fileName");

const analyzeBtn = document.getElementById("analyzeBtn");
const resetBtn =
    document.getElementById("resetBtn");

const jobDescription = document.getElementById("jobDescription");

const matchedSkills = document.getElementById("matchedSkills");
const missingSkills = document.getElementById("missingSkills");
const matchPercentage = document.getElementById("matchPercentage");
const suggestions = document.getElementById("suggestions");

const resumeSkillsDisplay =
    document.getElementById("resumeSkills");
const matchStatus =
    document.getElementById("matchStatus");
const progressBar =
    document.getElementById("progressBar");
const skillGap =
    document.getElementById("skillGap");
const resumeName =
    document.getElementById("resumeName");

const resumeEmail =
    document.getElementById("resumeEmail");

const resumePhone =
    document.getElementById("resumePhone");

const resumeSkillCount =
    document.getElementById("resumeSkillCount");

const requiredCount =
    document.getElementById("requiredCount");

const matchedCount =
    document.getElementById("matchedCount");

const missingCount =
    document.getElementById("missingCount");

const jobRoles =
    document.getElementById("jobRoles");

const resumeScore =
    document.getElementById("resumeScore");

const downloadBtn =
    document.getElementById("downloadBtn");

// Skills that our system knows
const mySkills = [
    "html",
    "css",
    "javascript",
    "react",
    "node.js",
    "express",
    "mongodb",
    "git",
    "github",
    "c++",
    "java",
    "python",
    "sql",
    "docker",
    "typescript",
    "bootstrap",
    "tailwind css",
    "mysql",
    "postgresql",
    "next.js"
];


// Different ways a skill may appear
const skillAliases = {

    "html": [
        "html",
        "html5"
    ],

    "css": [
        "css",
        "css3"
    ],

    "javascript": [
        "javascript",
        "js"
    ],

    "react": [
        "react",
        "react.js",
        "reactjs"
    ],

    "node.js": [
        "node.js",
        "nodejs",
        "node"
    ],

    "express": [
        "express",
        "express.js",
        "expressjs"
    ],

    "mongodb": [
        "mongodb",
        "mongo db"
    ],

    "git": [
        "git"
    ],

    "github": [
        "github",
        "git hub"
    ],

    "c++": [
        "c++"
    ],

    "java": [
        "java"
    ],

    "python": [
        "python"
    ],

    "sql": [
        "sql"
    ],

    "docker": [
        "docker"
    ],

    "typescript": [
        "typescript",
        "ts"
    ],

    "bootstrap": [
        "bootstrap"
    ],

    "tailwind css": [
        "tailwind css",
        "tailwind"
    ],

    "mysql": [
        "mysql"
    ],

    "postgresql": [
        "postgresql",
        "postgres"
    ],

    "next.js": [
        "next.js",
        "nextjs",
        "next js"
    ]

};
// Skills found in the uploaded resume
function containsSkill(text, skill) {

    const aliases = skillAliases[skill];

    return aliases.some(function (alias) {

        const pattern = new RegExp(
            "\\b" + alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b",
            "i"
        );

        return pattern.test(text);

    });

}

let resumeSkills = [];


// ================================
// UPLOAD AND READ RESUME
// ================================

uploadBtn.addEventListener("click", async function () {

    // Check whether a file was selected
    if (resumeFile.files.length === 0) {

        fileName.textContent =
            "Please select a resume first.";

        return;
    }


    // Get the selected file
    const file = resumeFile.files[0];

    fileName.textContent =
        "Reading resume...";


    // Only allow PDF files
    if (file.type !== "application/pdf") {

        fileName.textContent =
            "Please upload a PDF resume.";

        return;
    }


    try {

        // Convert PDF into readable data
        const arrayBuffer =
            await file.arrayBuffer();


        // Open the PDF
        const pdf =
            await pdfjsLib.getDocument({
                data: arrayBuffer
            }).promise;


        // Variable to store all resume text
        let resumeText = "";


        // Read every page of the PDF
        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(pageNumber);


            const textContent =
                await page.getTextContent();


            const pageText =
                textContent.items
                    .map(item => item.str)
                    .join(" ");


            resumeText += pageText + " ";
        }


        // Show extracted resume text in Console
        console.log(
            "Resume Text:",
            resumeText
        );

// ================================
// EXTRACT RESUME INFORMATION
// ================================

// Clean extra spaces created by PDF extraction
const cleanedText =
    resumeText.replace(/\s+/g, " ").trim();



// Extract email
const emailMatch =
    cleanedText.match(
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.\s-]+\.[A-Za-z]{2,}/
    );

if (emailMatch) {

    resumeEmail.textContent =
        emailMatch[0]
            .replace(/\s+/g, "");

}




// Extract name
const nameMatch =
    cleanedText.match(
        /KHUSHI NAGAR/i
    );

if (nameMatch) {

    resumeName.textContent =
        nameMatch[0];

}


// Extract phone number
const phoneMatch =
    resumeText.match(
        /(?:\+91[\s-]?)?[6-9]\d{9}/
    );

if (phoneMatch) {
    resumePhone.textContent =
        phoneMatch[0];
}


        // Clear previously detected skills
        resumeSkills = [];


        // Find skills inside the resume
        mySkills.forEach(function (skill) {

    const aliases =
        skillAliases[skill];

    const found = containsSkill(resumeText, skill);

    if (found) {

        resumeSkills.push(skill);

    }

});

// MERN Stack detection
if (
    resumeText
        .toLowerCase()
        .includes("mern")
) {

    const mernSkills = [
        "mongodb",
        "express",
        "react",
        "node.js"
    ];

    mernSkills.forEach(function (skill) {

        if (!resumeSkills.includes(skill)) {

            resumeSkills.push(skill);

        }

    });

}


        // Show detected skills in Console
        console.log(
            "Skills Found in Resume:",
            resumeSkills
        );
       

        // Display detected skills on the webpage
resumeSkillsDisplay.innerHTML = "";

resumeSkills.forEach(function (skill) {

    resumeSkillsDisplay.innerHTML +=
        "<span>" + skill + "</span>";

});


        // Show success message
        fileName.textContent =
            "Resume successfully read!";


    } catch (error) {

        console.error(error);

        fileName.textContent =
            "Could not read the resume.";
    }

});


// ================================
// ANALYZE RESUME
// ================================

analyzeBtn.addEventListener("click", async function () {

    console.log("Analyze button clicked");

    const jobText =
        jobDescription.value.toLowerCase().trim();

    console.log("Job Description:", jobText);
    console.log("Resume Skills:", resumeSkills);


    // -----------------------------
    // CHECK RESUME
    // -----------------------------

    if (resumeSkills.length === 0) {
        alert("Please upload your resume first.");
        return;
    }


    // -----------------------------
    // CHECK JOB DESCRIPTION
    // -----------------------------

    if (jobText === "") {
        alert("Please enter a job description.");
        return;
    }


    // -----------------------------
    // FIND REQUIRED SKILLS
    // -----------------------------

    const requiredSkillsFromJob = [];

    mySkills.forEach(function (skill) {

        if (containsSkill(jobText, skill)) {
            requiredSkillsFromJob.push(skill);
        }

    });

    console.log(
        "Required Skills:",
        requiredSkillsFromJob
    );


    // -----------------------------
    // SEND DATA TO BACKEND
    // -----------------------------

    try {

        const response = await fetch(
            "http://localhost:5000/api/analyze",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    resumeSkills: resumeSkills,
                    requiredSkills: requiredSkillsFromJob
                })
            }
        );


        const data = await response.json();


        console.log(
            "Backend Analysis Result:",
            data
        );


        // -----------------------------
        // GET BACKEND RESULT
        // -----------------------------

        const matched =
            data.matchedSkills;

        const missing =
            data.missingSkills;

        const percentage =
            data.matchPercentage;


        console.log(
            "Matched:",
            matched
        );

        console.log(
            "Missing:",
            missing
        );

        console.log(
            "Match Percentage:",
            percentage
        );


        // -----------------------------
        // COUNTS
        // -----------------------------

        const requiredSkills =
            matched.length + missing.length;


        resumeSkillCount.textContent =
            resumeSkills.length;

        requiredCount.textContent =
            requiredSkills;

        matchedCount.textContent =
            matched.length;

        missingCount.textContent =
            missing.length;


        // -----------------------------
        // MATCH PERCENTAGE
        // -----------------------------

        matchPercentage.textContent =
            percentage + "%";

        progressBar.style.width =
            percentage + "%";


        // -----------------------------
        // MATCH STATUS
        // -----------------------------

        if (percentage >= 80) {

            matchStatus.textContent =
                "Strong Match";

        } else if (percentage >= 60) {

            matchStatus.textContent =
                "Good Match";

        } else if (percentage >= 40) {

            matchStatus.textContent =
                "Moderate Match";

        } else {

            matchStatus.textContent =
                "Needs Improvement";

        }


        // -----------------------------
        // MATCHED SKILLS
        // -----------------------------

        matchedSkills.innerHTML = "";

        if (matched.length === 0) {

            matchedSkills.innerHTML =
                "<p>No matched skills found.</p>";

        } else {

            matched.forEach(function (skill) {

                matchedSkills.innerHTML +=
                    "<span>✓ " +
                    skill +
                    "</span>";

            });

        }


        // -----------------------------
        // MISSING SKILLS
        // -----------------------------

        missingSkills.innerHTML = "";

        if (missing.length === 0) {

            missingSkills.innerHTML =
                "<p>No missing skills.</p>";

        } else {

            missing.forEach(function (skill) {

                missingSkills.innerHTML +=
                    "<span>✗ " +
                    skill +
                    "</span>";

            });

        }


        // -----------------------------
        // SKILL GAP
        // -----------------------------

        if (missing.length === 0) {

            skillGap.textContent =
                "No major skill gaps detected.";

        } else {

            skillGap.textContent =
                "Focus on improving: " +
                missing.join(", ");

        }


        // -----------------------------
        // SUGGESTIONS
        // -----------------------------

        if (missing.length === 0) {

            suggestions.textContent =
                "Excellent! Your resume covers all the technical skills required for this job.";

        } else {

            suggestions.textContent =
                "Consider improving these skills: " +
                missing.join(", ") +
                ". Adding relevant projects or experience in these areas can strengthen your resume.";

        }


        // -----------------------------
        // RESUME SCORE
        // -----------------------------

        let score = 0;


        // Skills
        if (resumeSkills.length >= 5) {

            score += 30;

        } else {

            score += 15;

        }


        // Email
        if (
            resumeEmail.textContent !==
            "Not detected"
        ) {

            score += 20;

        }


        // Phone
        if (
            resumePhone.textContent !==
            "Not detected"
        ) {

            score += 20;

        }


        // Job Match
        score += Math.round(
            percentage * 0.3
        );


        resumeScore.textContent =
            score + "/100";


        // -----------------------------
        // JOB ROLE RECOMMENDATION
        // -----------------------------

        let roles = [];


        if (
            resumeSkills.includes("react") &&
            resumeSkills.includes("node.js") &&
            resumeSkills.includes("mongodb")
        ) {

            roles.push(
                "Full Stack Developer"
            );

        }


        if (
            resumeSkills.includes("html") &&
            resumeSkills.includes("css") &&
            resumeSkills.includes("javascript")
        ) {

            roles.push(
                "Web Developer"
            );

            roles.push(
                "Frontend Developer"
            );

        }


        if (
            resumeSkills.includes("c++") &&
            resumeSkills.includes("python")
        ) {

            roles.push(
                "Software Developer"
            );

        }


        if (roles.length === 0) {

            jobRoles.textContent =
                "No specific job role recommendation available yet.";

        } else {

            jobRoles.innerHTML = "";

            roles.forEach(function (role) {

                jobRoles.innerHTML +=
                    "<span>" +
                    role +
                    "</span>";

            });

        }

    } catch (error) {

        console.error(
            "Backend analysis failed:",
            error
        );

        alert(
            "Could not connect to the backend. Please make sure the server is running."
        );

    }

});

resetBtn.addEventListener("click", function () {

    resumeFile.value = "";

    fileName.textContent = "";

    resumeName.textContent = "Not detected";
    resumeEmail.textContent = "Not detected";
    resumePhone.textContent = "Not detected";

    resumeSkills = [];

    resumeSkillsDisplay.innerHTML = "";

    jobDescription.value = "";

    requiredCount.textContent = "0";
    matchedCount.textContent = "0";
    missingCount.textContent = "0";
    resumeSkillCount.textContent = "0";

    matchPercentage.textContent = "0%";

    progressBar.style.width = "0%";

    matchStatus.textContent =
        "Upload your resume and analyze a job description.";

    matchedSkills.innerHTML = "";
    missingSkills.innerHTML = "";

    skillGap.textContent =
        "Analyze a job description to identify skills you should improve.";

    suggestions.textContent =
        "Upload your resume and enter a job description to get suggestions.";

    resumeScore.textContent = "0/100";

    jobRoles.textContent =
        "Analyze your resume to get recommended job roles.";

});


downloadBtn.addEventListener("click", function () {

    const report = `
RESUME ANALYZER & JOB MATCH REPORT
==================================

Resume Information
Name: ${resumeName.textContent}
Email: ${resumeEmail.textContent}
Phone: ${resumePhone.textContent}

Resume Skills
${resumeSkills.join(", ")}

Analysis Result
--------------
Resume Score: ${resumeScore.textContent}
Match Percentage: ${matchPercentage.textContent}

Required Skills: ${requiredCount.textContent}
Matched Skills: ${matchedCount.textContent}
Missing Skills: ${missingCount.textContent}

Matched Skills
${matchedSkills.innerText.split("✓").filter(Boolean).map(skill => "✓ " + skill.trim()).join("\n")}

Missing Skills
${missingSkills.innerText.split("✗").filter(Boolean).map(skill => "✗ " + skill.trim()).join("\n")}

Skills to Improve
${skillGap.textContent}

Suggestions
${suggestions.textContent}

Recommended Job Roles
${jobRoles.innerText}
`;

    const blob = new Blob(
        [report],
        { type: "text/plain" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Resume_Analysis_Report.txt";

    link.click();

    URL.revokeObjectURL(link.href);

});

const historyBtn = document.getElementById("historyBtn");
const historyContainer = document.getElementById("historyContainer");

historyBtn.addEventListener("click", async function () {
    try {
        historyBtn.textContent = "Loading...";

        const response = await fetch("http://localhost:5000/api/history");

        if (!response.ok) {
            throw new Error("Failed to load history");
        }

        const analyses = await response.json();

        historyContainer.innerHTML = "";

        if (analyses.length === 0) {
            historyContainer.innerHTML = "<p>No analysis history found.</p>";
            return;
        }

        analyses.forEach(function (analysis) {
            const card = document.createElement("div");

            card.className = "history-card";

            card.innerHTML = `
                <h3>Match: ${analysis.matchPercentage}%</h3>
                <p><strong>Matched Skills:</strong> ${analysis.matchedSkills.join(", ")}</p>
                <p><strong>Missing Skills:</strong> ${analysis.missingSkills.join(", ")}</p>
                <p><strong>Date:</strong> ${new Date(analysis.createdAt).toLocaleString()}</p>
            `;

            historyContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);

        historyContainer.innerHTML =
            "<p>Unable to load analysis history.</p>";

    } finally {
        historyBtn.textContent = "View Recent Analyses";
    }
});


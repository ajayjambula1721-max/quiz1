
const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Quiz submission API
app.post("/submit-quiz", (req, res) => {

    console.log("Quiz submission received!");

    const { studentName, answers } = req.body;

    if (!studentName || !answers) {
        return res.status(400).json({
            error: "Student name or answers missing"
        });
    }

    const correctAnswers = {
        q1: "A",
        q2: "B",
        q3: "C",
        q4: "D",
        q5: "C"
    };

    let marks = 0;

    for (let q in correctAnswers) {
        if (answers[q] === correctAnswers[q]) {
            marks++;
        }
    }

    const sql = `
        INSERT INTO results
        (student_name, quiz_id, marks_obtained, total_marks)
        VALUES (?, 1, ?, ?)
    `;

    db.query(sql, [studentName.trim(), marks, 5], (err, result) => {

        if (err) {
            console.log("MySQL Error:", err.message);

            return res.status(500).json({
                error: err.message
            });
        }

        console.log("Marks saved in database!");

        res.json({
            success: true,
            studentName: studentName,
            marks: marks,
            totalMarks: 5
        });

    });

});

// Serve HTML, CSS and JavaScript
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log("Server running at http://localhost:3000");
});

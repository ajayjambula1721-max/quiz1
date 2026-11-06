
const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ajay@2006",
    database: "online_quiz"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL Error:", err.message);
    } else {
        console.log("MySQL Connected Successfully!");
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/test", (req, res) => {
    res.send("Express server is working!");
});

// Quiz submission route
app.post("/submit-quiz", (req, res) => {

    console.log("SUBMIT QUIZ ROUTE REACHED");

    const { studentName, answers } = req.body;

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

    db.query(sql, [studentName, marks, 5], (err, result) => {

        if (err) {
            console.log("Insert Error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json({
            success: true,
            studentName: studentName,
            marks: marks,
            totalMarks: 5
        });
    });
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Start server
app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});

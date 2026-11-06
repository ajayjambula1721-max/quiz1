
const studentName = localStorage.getItem("studentName");

if (!studentName) {
    window.location.href = "index.html";
}

document.getElementById("welcome").innerText =
    "Welcome, " + studentName;

async function loadQuestions() {
    const response = await fetch("/api/questions");
    const questions = await response.json();

    const container = document.getElementById("questions");

    questions.forEach((q, index) => {
        let html = `
            <div class="question">
                <h3>${index + 1}. ${q.question}</h3>
        `;

        q.options.forEach(option => {
            html += `
                <label>
                    <input type="radio"
                        name="q${q.id}"
                        value="${option.id}" required>
                    ${option.text}
                </label><br>
            `;
        });

        html += "</div>";
        container.innerHTML += html;
    });
}

document.getElementById("quizForm").addEventListener("submit",
async function(e) {
    e.preventDefault();

    const answers = {};

    document.querySelectorAll(
        '#questions input[type="radio"]:checked'
    ).forEach(input => {
        const questionId = input.name.substring(1);
        answers[questionId] = input.value;
    });

    const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            studentName: studentName,
            answers: answers
        })
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error || "Submission failed");
        return;
    }

    localStorage.setItem("quizResult", JSON.stringify(result));
    window.location.href = "result.html";
});

loadQuestions().catch(err => {
    alert("Unable to load quiz questions.");
    console.error(err);
});

document.addEventListener("DOMContentLoaded", () => {
    let quizData = [];
    let currentQuestionIndex = 0;

    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    let numberOfQuestion = 0;

    // Load the last question index from Local Storage
    function loadLastQuestionIndex() {
        const savedIndex = localStorage.getItem("currentQuestionIndex");
        return savedIndex ? parseInt(savedIndex, 10) : 0;
    }

    // Save the current question index to Local Storage
    function saveCurrentQuestionIndex(index) {
        localStorage.setItem("currentQuestionIndex", index);
    }

    // Fetch JSON data
    async function loadQuizData() {
        try {
            const response = await fetch("tak.json"); // Ścieżka do pliku JSON
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            quizData = data.data; // Pobierz dane z klucza "data"

            // Load the last saved question index
            currentQuestionIndex = loadLastQuestionIndex();

            loadQuestion(currentQuestionIndex);
        } catch (error) {
            console.error("Error loading quiz data:", error);
            questionElement.textContent = "Failed to load quiz data.";
        }
    }

    // Load a specific question
    function loadQuestion(index) {
        if (!quizData || !quizData[index]) {
            console.error("Invalid question index:", index);
            questionElement.textContent = "No more questions available.";
            answersElement.innerHTML = "";
            return;
        }

        const questionData = quizData[index];
        questionElement.textContent = `${numberOfQuestion++}.
        questionData.question `;

        // Clear existing answers
        answersElement.innerHTML = "";

        // Populate answers
        questionData.answers.forEach((answer, i) => {
            const answerButton = document.createElement("button");
            answerButton.textContent = answer.answer;
            answerButton.addEventListener("click", () => {
                answer.correct ? answerButton.style.backgroundColor = 'green' : answerButton.style.backgroundColor = 'red';
            });
            const listItem = document.createElement("li");
            listItem.appendChild(answerButton);
            answersElement.appendChild(listItem);
        });

        // Update navigation buttons
        prevButton.disabled = index === 0;
        nextButton.disabled = index === quizData.length - 1;

        // Save the current question index to Local Storage
        saveCurrentQuestionIndex(index);
    }

    // Event listeners for navigation buttons
    prevButton.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        }
    });

    // Load quiz data on page load
    loadQuizData();
});
document.addEventListener("DOMContentLoaded", () => {
    let quizData = [];
    let currentQuestionIndex = 0;

    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");


    function loadLastQuestionIndex() {
        const savedIndex = localStorage.getItem("currentQuestionIndex");
        return savedIndex ? parseInt(savedIndex, 10) : 0;
    }


    function saveCurrentQuestionIndex(index) {
        localStorage.setItem("currentQuestionIndex", index);
    }

    // Fetch
    async function loadQuizData() {
        try {
            const response = await fetch("tak.json"); // Ścieżka do pliku JSON
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            quizData = data.data;

            // Pobierz zapisany indeks lub ustaw na 0
            const savedIndex = loadLastQuestionIndex();
            currentQuestionIndex = Math.min(
                Math.max(savedIndex, 0),
                quizData.length - 1
            );
            console.log("Starting at question index:", currentQuestionIndex);

            loadQuestion(currentQuestionIndex);
        } catch (error) {
            console.error("Error loading quiz data:", error);
            questionElement.textContent = "Failed to load quiz data.";
        }
    }


    function loadQuestion(index) {
        if (!quizData || !quizData[index]) {
            console.error("Invalid question index:", index);
            questionElement.textContent = "No more questions available.";
            answersElement.innerHTML = "";
            return;
        }

        const questionData = quizData[index];
        questionElement.textContent = `${index + 1}. ${questionData.question}`;


        answersElement.innerHTML = "";


        questionData.answers.forEach((answer, i) => {
            const answerButton = document.createElement("button");
            answerButton.textContent = answer.answer;
            answerButton.addEventListener("click", () => {
                answerButton.style.backgroundColor = answer.correct ? "green" : "red";
            });
            const listItem = document.createElement("li");
            listItem.appendChild(answerButton);
            answersElement.appendChild(listItem);
        });

   
        prevButton.disabled = index === 0;
        nextButton.disabled = index === quizData.length - 1;

        // Save the current question index to Local Storage
        saveCurrentQuestionIndex(index);
    }


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




    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") { // Obsługa strzałki w lewo
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuestion(currentQuestionIndex);
            }
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") { // Obsługa strzałki w prawo
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuestion(currentQuestionIndex);
            }
        }
    });



    window.addEventListener("beforeunload", () => {
        saveCurrentQuestionIndex(currentQuestionIndex);
    });

    loadQuizData();
});

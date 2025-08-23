let fileUpload = document.querySelector('.fileUpload');
let startButton = document.querySelector('.start');
let resetButton = document.querySelector('.reset');
let maxqInput = document.querySelector('.maxq');
let scoreDisplay = document.querySelector('.score');
let qcountDisplay = document.querySelector('.qcount');
let timerDisplay = document.querySelector('.timer');
let timerMinutes = document.querySelector('.timer-minutes');
let timerSeconds = document.querySelector('.timer-seconds');
let question = document.querySelector('div.question');
let option1 = document.querySelector('.option1');
let option2 = document.querySelector('.option2');
let option3 = document.querySelector('.option3');
let option4 = document.querySelector('.option4');
let next = document.querySelector('.next');
let questions;
let answers;
let op1;
let op2;
let op3;
let op4;
let answer;
let choice = "";
let qcount = 0;
let score = 0;
let maxq;
let startingTime;
let time = 1;
let running = false;

startButton.addEventListener('click', () => {
    readFile();
    maxq = parseInt(maxqInput.value);
    startingTime = (parseInt(timerMinutes.value) * 60) + parseInt(timerSeconds.value);
    time = startingTime;
    running = true;
    scoreDisplay.innerText = `Score: ${score}`;
    qcountDisplay.innerText = `Questions answered: ${qcount}`;
});

resetButton.addEventListener('click', () => {
    reset();
    scoreDisplay.innerText = `Score: ${score}`;
    qcountDisplay.innerText = `Questions answered: ${qcount}`;
});

option1.addEventListener('click', () => choose(option1));
option2.addEventListener('click', () => choose(option2));
option3.addEventListener('click', () => choose(option3));
option4.addEventListener('click', () => choose(option4));

setInterval(updateTimer, 1000);

function readFile() {
    reset();
    let reader = new FileReader();
    reader.readAsText(fileUpload.files[0]);

    reader.onload = function () {
        let results = Papa.parse(reader.result, { header: false });
        lines = results.data.slice(1);
        questions = lines.map(line => line[0]);
        answers = lines.map(line => line[1]);
        op1 = lines.map(line => line[2]);
        op2 = lines.map(line => line[3]);
        op3 = lines.map(line => line[4]);
        op4 = lines.map(line => line[5]);
        loadNewQuestion();
    }
}

function updateTimer() {
    if (time > 0 && running == true) {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        time--;
    } else if (time == 0 && running == true) {
        timerDisplay.innerText = "Time's up!";
        choice = "";
        option1.style.display = "none";
        option2.style.display = "none";
        option3.style.display = "none";
        option4.style.display = "none";
        question.innerText = "END OF TIME";
    }
}

function reset() {
    questions = [];
    answers = [];
    op1 = [];
    op2 = [];
    op3 = [];
    op4 = [];
    qcount = 0;
    score = 0;
    running = false;
    time = 0;
    timerDisplay.innerText = "";
    choice = "";
    next.disabled = true;
    next.className = "next disabled";
    // option1.style.display = "none";
    // option2.style.display = "none";
    // option3.style.display = "none";
    // option4.style.display = "none";
    option1.innerText = "";
    option2.innerText = "";
    option3.innerText = "";
    option4.innerText = "";
    option1.style.backgroundColor = "var(--options-bg)";
    option2.style.backgroundColor = "var(--options-bg)";
    option3.style.backgroundColor = "var(--options-bg)";
    option4.style.backgroundColor = "var(--options-bg)";
    question.innerText = "";
    timerDisplay.innerText = "00:00";
    // question.innerText = "Please upload a file to start.";
}

function choose(option) {
    choice = option.innerText.slice(3);
    option.disabled = true;

    next.disabled = false;
    next.className = "next enabled";
    if (choice == answer) {
        qcount += 1;
        score += 1;
        scoreDisplay.innerText = `Score: ${score}`;
        qcountDisplay.innerText = `Questions answered: ${qcount}`;
        option.style.backgroundColor = "var(--correct-color)";
        option.style.color = "var(--panel-bg)";
    } else {
        score -= 0.5;
        scoreDisplay.innerText = `Score: ${score}`;
        option.style.backgroundColor = "var(--wrong-color)";
        option.style.color = "var(--panel-bg)";
    }
}

function loadNewQuestion() {
    if (questions.length === 0 || qcount >= maxq) {
        choice = "";
        option1.style.display = "none";
        option2.style.display = "none";
        option3.style.display = "none";
        option4.style.display = "none";
        question.innerText = "END OF QUESTIONS";
    } else {
        let qaIndex = Math.floor(Math.random() * questions.length);
        question.innerText = questions.splice(qaIndex, 1)[0];
        answer = answers.splice(qaIndex, 1)[0];

        let optionsArray = [
            op1.splice(qaIndex, 1)[0],
            op2.splice(qaIndex, 1)[0],
            op3.splice(qaIndex, 1)[0],
            op4.splice(qaIndex, 1)[0]
        ];

        for (let i = optionsArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
        }

        option1.innerText = "A: " + optionsArray[0];
        option2.innerText = "B: " + optionsArray[1];
        option3.innerText = "C: " + optionsArray[2];
        option4.innerText = "D: " + optionsArray[3];

        option1.disabled = false;
        option2.disabled = false;
        option3.disabled = false;
        option4.disabled = false;

        option1.removeAttribute('style');
        option2.removeAttribute('style');
        option3.removeAttribute('style');
        option4.removeAttribute('style');
        choice = "";
        next.disabled = true;
        next.className = "next disabled";
    }
}

/* 
TODO:
- [X] Read questions, answers and choices from a file.
- [X] Improve option generation to ensure that the options are not too different from the answer.
- [X] Improve the algorithm to ensure that the same question is not loaded twice.
- [X] Implement a way to track which questions have been loaded.
- [X] Implement a way to track which questions have been answered correctly.
- [X] Load a random question that hasn't yet been loaded in `loadNewQuestion()`.
- [X] Implement a start button to start the quiz.
- [X] Implement a reset button to reset the quiz.
- [X] Add a score counter.
- [X] Style the app.
- [X] Add a timer.
*/

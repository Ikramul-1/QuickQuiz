// Selecting all the necessary elements from the DOM.
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
let panel = document.querySelector('.panel');
let stats = document.querySelector('.stats');
let timerInputs = document.querySelector('.timer-inputs');
let NavButton = document.querySelector('.nav-btn');
let NavBar = document.querySelector('.nav-bar');
let exampleDropdown = document.getElementById('quizDropdown');
let themeSelector = document.getElementById('themeSelector');
let randomizeQuestionsCheckbox = document.getElementById('randomizeQuestions');
let shuffleOptionsCheckbox = document.getElementById('shuffleOptions');

// Declaring global variables
let questions; // Array to hold the questions
let answers; // Array to hold the answers
let op1;
let op2;
let op3;
let op4;
let answer; // Answer to current question
let choice = ""; // Users choosen option
let qcount = 0; // Question counter
let score = 0;
let maxq; // Maximum number of questions to answer
let startingTime; // Starting time in seconds
let time = 1; // Default time (just set to 1 to avoid shenanigans)
let running = false; // For the timer to know if it should tick

// Set theme
const theme = localStorage.getItem('theme') || 'default-dark';
document.body.className = theme;
themeSelector.value = theme;

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

NavButton.addEventListener('click', () => {
    // Toggle the panel visibility.
    if (panel.className == "panel inactive") {
        // panel.className = "panel";
        panel.classList.remove('inactive');
        panel.style.display = 'flex';
    } else {
        // panel.className = "panel inactive";
        panel.classList.add('inactive');
        panel.addEventListener('transitionend', function handler() {
            panel.style.display = 'none';
            panel.removeEventListener('transitionend', handler);
        });
    }
});

// Change theme.
themeSelector.addEventListener('change', () => {
    document.body.className = themeSelector.value;
    localStorage.setItem('theme', themeSelector.value);
});

// Update the timer. Just keeps ticking every second. The timer is reset to a "normal" value once the user actually start the quiz.
setInterval(updateTimer, 1000);

// Read the .csv for quizzes and options and answers.
function readFile() {
    reset(); // Just felt right to put it here :).

    if (exampleDropdown && exampleDropdown.value && fileUpload.files[0] == undefined) {
        fetch(exampleDropdown.value).then(response => response.text()).then(exampleQuestions => {
            let results = Papa.parse(exampleQuestions, { header: false });
            lines = results.data.slice(1);
            questions = lines.map(line => line[0]);
            answers = lines.map(line => line[1]);
            op1 = lines.map(line => line[2]);
            op2 = lines.map(line => line[3]);
            op3 = lines.map(line => line[4]);
            op4 = lines.map(line => line[5]);
            loadNewQuestion();
        });
    } else if (fileUpload.files[0]) {
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
}

// What happenes when the user clicks on an option.
function choose(option) {
    choice = option.innerText.slice(3);
    option.disabled = true;

    if (choice == answer) {
        qcount += 1;
        score += 1;
        scoreDisplay.innerText = `Score: ${score}`;
        qcountDisplay.innerText = `Questions answered: ${qcount}`;
        option.style.backgroundColor = "var(--correct-color)";
        option.style.color = "var(--options-fg)";
        next.disabled = false;
        next.className = "next enabled";
    } else {
        score -= 0.5;
        scoreDisplay.innerText = `Score: ${score}`;
        option.style.backgroundColor = "var(--wrong-color)";
        option.style.color = "var(--options-fg)";
    }
}

// Function to randomly load a question from the .csv file.
function loadNewQuestion() {
    if (questions.length === 0 || qcount >= maxq) { // If there are no more questions left in the array or the max limit is hit.
        choice = "";
        option1.style.display = "none";
        option2.style.display = "none";
        option3.style.display = "none";
        option4.style.display = "none";
        question.innerText = "END OF QUESTIONS";
        next.disabled = true;
        next.className = "next disabled";
        running = false;
    } else { // Just keep selecting new questions until there are no more left, or the max limit is hit.
        let qaIndex;
        if (randomizeQuestionsCheckbox.checked) {
            qaIndex = Math.floor(Math.random() * questions.length);
        } else {
            qaIndex = 0;
        }

        question.innerText = questions.splice(qaIndex, 1)[0];
        answer = answers.splice(qaIndex, 1)[0];

        // There might be a better way to do this, but this is the simplest way I could think of :).
        let optionsArray = [
            op1.splice(qaIndex, 1)[0],
            op2.splice(qaIndex, 1)[0],
            op3.splice(qaIndex, 1)[0],
            op4.splice(qaIndex, 1)[0]
        ];

        if (shuffleOptionsCheckbox.checked) {
            for (let i = optionsArray.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
            }
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
- [X] Add a dropdown to select from some example questions.
- [X] Add some more example questions.
- [X] Add a toggle for randomizing the order of questions.
- [X] Add a toggle for randomizing the order of options.
- [X] Add a theme selector.
- [ ] Add sound effects.
- [ ] Add a way to save the info for each run.
- [ ] Add a way to load the saved info.
- [ ] Make this app a PWA.
*/
const sounds = {
    red: new Audio("sounds/bark.mp3"),
    yellow: new Audio("sounds/clown.mp3"),
    blue: new Audio("sounds/glass.mp3"),
    green: new Audio("sounds/joke.mp3"),
}
const colors = ["red", "yellow", "blue", "green"]
const timerEl = document.querySelector(".timer h1")
const start = document.querySelector(".start-btn")
const gameButtons = document.querySelectorAll(".game-btn")

const gameState = {
    currentSequence: [],
    score: 0,
    round: 0,
    startTime: 0,
    timerInterval: 0,
    userIndex: 0,
    isUserTurn: false,
    acceptingInput: false,
}

function playSound(color) {
    const sound = sounds[color];
    sound.currentTime = 0;
    sound.play();
    console.log(color)
    guess(color);
}
function startGame() {
    console.log("start game please");
    reset();
    startTimer();
    start.classList.add("hidden");
    cpuTurn();
    // startTime = null;
    // timerEl.textContent = "00:00:00";
}
function startTimer() {
    gameState.startTime = Date.now();

    gameState.timerInterval = setInterval(() => {
        const now = Date.now();
        const diff = now - gameState.startTime;

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        const ms = Math.floor((diff % 1000) / 10);

        timerEl.textContent =
            `${pad(minutes)}:${pad(seconds)}:${pad(ms)}`;
    }, 10);
}
function pad(value) {
    return value.toString().padStart(2, "0");
}
function reset() {
    gameState.currentSequence = [];
    gameState.score = 0;
    gameButtons.round = 0,
    clearInterval(gameState.timerInterval)
    gameState.timerInterval = 0;
    timerEl.textContent = "00:00:00"
    gameState.userIndex = 0;
    gameState.isUserTurn = false;
    gameState.acceptingInput = false;
}
function cpuTurn() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    gameState.currentSequence.push(randomColor)
    console.log(gameState.currentSequence)
}
function guess(color) {
    if (color === gameState.currentSequence[gameState.userIndex]) {
        gameState.userIndex++;
        console.log("correct")
        if (gameState.userIndex === gameState.currentSequence.length) {
            gameState.userIndex = 0
            flashButtons()
            cpuTurn();
        }
    }
    else {
        console.log("game over")
        gameOverButtons()
        console.log(gameState.currentSequence)
        start.classList.remove("hidden");
        clearInterval(gameState.timerInterval);
    }
}
function flashOn() {
    gameButtons.forEach(button => {
        button.classList.add("active");
    });
}
function flashOff() {
    gameButtons.forEach(button => {
        button.classList.remove("active");
    });
}
function flashButtons() {
    let flashes = 0;

    const flashInterval = setInterval(() => {
        flashOn();

        setTimeout(() => {
            flashOff();
        }, 100);

        flashes++;

        if (flashes >= 5) {
            clearInterval(flashInterval);
            flashOff();
        }

    }, 200);
}
function gameOverOn() {
    gameButtons.forEach(button => {
        button.classList.add("game-over");
    });
}
function gameOverOff() {
    gameButtons.forEach(button => {
        button.classList.remove("game-over");
    });
}
function gameOverButtons(flashes = 0) {
    if (flashes >= 5) {
        gameOverOff();
        return;
    }

    gameOverOn();

    setTimeout(() => {
        gameOverOff();

        setTimeout(() => {
            gameOverButtons(flashes + 1);
        }, 300);

    }, 600);
}
document.querySelector(".red").addEventListener("click", () => playSound("red"));
document.querySelector(".yellow").addEventListener("click", () => playSound("yellow"));
document.querySelector(".blue").addEventListener("click", () => playSound("blue"));
document.querySelector(".green").addEventListener("click", () => playSound("green"));
start.addEventListener("click", startGame);
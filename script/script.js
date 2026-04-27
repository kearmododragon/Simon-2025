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
const scoreEl = document.querySelector("#score")
const leaderboardEl = document.querySelector(".leaderboard")

const gameState = {
    currentSequence: [],
    score: 0,
    round: 0,
    startTime: 0,
    timerInterval: 0,
    userIndex: 0,
    isUserTurn: false,
    acceptingInput: false,
    userTimer: 0,
    timeLeft: 0,
    attempts: [],
    leaderboard: [],
}

function playSound(color) {
    const sound = sounds[color];
    sound.currentTime = 0;
    sound.play();
    console.log(color)
}
function startGame() {
    reset();
    setInputEnabled(false)
    startTimer();
    start.classList.add("hidden");
    cpuTurn();
    gameState.round++;
    console.log("Round: ", gameState.round)
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
    gameState.round = 0,
    clearInterval(gameState.timerInterval)
    gameState.timerInterval = 0;
    timerEl.textContent = "00:00:00"
    gameState.userIndex = 0;
    gameState.isUserTurn = false;
    gameState.acceptingInput = false;
    setInputEnabled(false);
    scoreEl.textContent = "Score: 0";
    gameState.timeLeft = 0;
}
async function cpuTurn() {
    gameState.isUserTurn = false;
    gameState.acceptingInput = false;

    setInputEnabled(false)

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameState.currentSequence.push(randomColor);

    await playSequence();

    gameState.isUserTurn = true;
    gameState.userIndex = 0;

    setInputEnabled(true)

}
function guess(color) {
    if (!gameState.acceptingInput) return;
    if (color === gameState.currentSequence[gameState.userIndex]) {
        gameState.userIndex++;
        console.log("correct")
        if (gameState.userIndex === gameState.currentSequence.length) {
            gameState.score += gameState.timeLeft;
            scoreEl.textContent = `Score: ${gameState.score}`
            clearInterval(gameState.userTimer);
            gameState.userIndex = 0
            gameState.round++;
            console.log(gameState.round)
            handleTurn();
            gameState.acceptingInput = false
            setInputEnabled(false);
        }
    }
else {
    triggerGameOver("wrong answer");
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
function flashButtonsAsync() {
    return new Promise((resolve) => {
        let flashes = 0;

        const interval = setInterval(() => {
            flashOn();

            setTimeout(() => {
                flashOff();
            }, 100);

            flashes++;

            if (flashes >= 5) {
                clearInterval(interval);
                flashOff();
                resolve();
            }

        }, 200);
    });
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
function flashColor(color) {
    return new Promise((resolve) => {
        const button = document.querySelector(`.${color}`);

        button.classList.add("active");
        playSound(color);

        setTimeout(() => {
            button.classList.remove("active");
            resolve();
        }, 300);
    });
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function playSequence() {
    gameState.isUserTurn = false;

    for (let i = 0; i < gameState.currentSequence.length; i++) {
        await flashColor(gameState.currentSequence[i]);
        await delay(200);
    }

    gameState.isUserTurn = true;
    gameState.userIndex = 0;
    setInputEnabled(true);
    startUserTurnTimer();
}
async function handleTurn() {
    await flashButtonsAsync();
    cpuTurn();
}
function setInputEnabled(value) {
    gameState.acceptingInput = value;

    gameButtons.forEach(btn => {
        btn.style.pointerEvents = value ? "auto" : "none";
        btn.style.opacity = value ? "1" : "0.6"
    })
}
function startUserTurnTimer() {
    const duration = 5 * (gameState.round || 1);

    gameState.timeLeft = duration;

    clearInterval(gameState.userTimer);

    gameState.userTimer = setInterval(() => {
        gameState.timeLeft--;

        console.log("Time Left: ", gameState.timeLeft)

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.userTimer);
            triggerGameOver("time ran out")
        }
    }, 1000)
}
function triggerGameOver(reason) {
    console.log("Game over:", reason);

    console.log(gameState.score)
    const totalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    console.log(totalTime)

    gameState.attempts.push({
    round: gameState.round,    
    score: gameState.score,
    time: Math.floor((Date.now() - gameState.startTime) / 1000)
});
    gameState.attempts
    .sort((a, b) => b.score - a.score)
    .splice(5);

    gameState.acceptingInput = false;
    gameState.isUserTurn = false;

    setInputEnabled(false);

    clearInterval(gameState.timerInterval);
    clearInterval(gameState.userTimer);

    gameState.timerInterval = 0;
    gameState.userTimer = 0;

    gameOverButtons();

    start.classList.remove("hidden");
    renderLeaderboard();
}
function renderLeaderboard() {
    const body = document.querySelector(".leaderboard-body");

    body.innerHTML = "";

    gameState.attempts.forEach((entry, index) => {
        const row = document.createElement("div");
        row.classList.add("leaderboard-row");

        row.innerHTML = `
            <span>${entry.round}</span>
            <span>${entry.score}</span>
            <span>${entry.time}s</span>
        `;

        body.appendChild(row);
    });
}
document.querySelector(".red").addEventListener("click", () => {
    playSound("red");
    guess("red");
});
document.querySelector(".blue").addEventListener("click", () => {
    playSound("blue");
    guess("blue");
});
document.querySelector(".yellow").addEventListener("click", () => {
    playSound("yellow");
    guess("yellow");
});
document.querySelector(".green").addEventListener("click", () => {
    playSound("green");
    guess("green");
});
start.addEventListener("click", startGame);
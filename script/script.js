const sounds = {
    red: new Audio("sounds/bark.mp3"),
    yellow: new Audio("sounds/clown.mp3"),
    blue: new Audio("sounds/glass.mp3"),
    green: new Audio("sounds/joke.mp3"),
}
const timerEl = document.querySelector(".timer h1")
const start = document.querySelector(".start-btn")


function playSound(color) {
    const sound = sounds[color];
    sound.currentTime = 0;
    sound.play();
    console.log(color)
}
function startGame() {
    console.log("start game please");
    start.classList.add("hidden");
    startTimer();
    // startTime = null;
    // timerEl.textContent = "00:00:00";
}
function startTimer() {
    let startTime
    let timerInterval
    clearInterval(timerInterval);
    startTime = Date.now();

    timerInterval = setInterval(() => {
        const now = Date.now();
        const diff = now - startTime;

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


document.querySelector(".red").addEventListener("click", () => playSound("red"));
document.querySelector(".yellow").addEventListener("click", () => playSound("yellow"));
document.querySelector(".blue").addEventListener("click", () => playSound("blue"));
document.querySelector(".green").addEventListener("click", () => playSound("green"));
start.addEventListener("click", startGame);
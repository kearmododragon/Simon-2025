const sounds = {
    red: new Audio("sounds/bark.mp3"),
    yellow: new Audio("sounds/clown.mp3"),
    blue: new Audio("sounds/glass.mp3"),
    green: new Audio("sounds/joke.mp3"),
}

function playSound(color) {
    const sound = sounds[color];
    sound.currentTime = 0;
    sound.play();
    console.log(color)
}

function startGame() {
    console.log("start game please")
}
document.querySelector(".red").addEventListener("click", () => playSound("red"));
document.querySelector(".yellow").addEventListener("click", () => playSound("yellow"));
document.querySelector(".blue").addEventListener("click", () => playSound("blue"));
document.querySelector(".green").addEventListener("click", () => playSound("green"));
document.querySelector(".startbtn").addEventListener("click", () => startGame());
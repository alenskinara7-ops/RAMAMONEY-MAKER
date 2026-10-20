
let points = 1000;
let multiplier = 1.00;
let flying = false;
let flightTimer = null;
let crashPoint = 0;

const multiplierDisplay = document.getElementById("multiplier");
const plane = document.getElementById("plane");
const statusDisplay = document.getElementById("status");
const pointsDisplay = document.getElementById("points");
const startButton = document.getElementById("startButton");
const cashOutButton = document.getElementById("cashOutButton");

function startFlight() {
    if (flying) return;

    flying = true;
	playGameSound("takeoff");
    multiplier = 1.00;

    crashPoint = Math.random() * 4 + 1.5;

    multiplierDisplay.textContent = "1.00x";
    statusDisplay.textContent = "Plane is flying!";
    plane.style.left = "10%";
    plane.style.bottom = "50px";

    startButton.disabled = true;
    cashOutButton.disabled = false;

    flightTimer = setInterval(function () {
        multiplier += 0.01;

        multiplierDisplay.textContent =
            multiplier.toFixed(2) + "x";

       
const progress = Math.min(multiplier - 1, 5);

plane.style.left =
    Math.min(10 + progress * 12, 75) + "%";

plane.style.bottom =
    Math.min(50 + progress * progress * 18, 240) + "px";
        if (multiplier >= crashPoint) {
            endFlight();
        }
    }, 100);
}

function endFlight() {
    clearInterval(flightTimer);
    flying = false;
	playGameSound("crash");
	addHistory("Crashed at " + multiplier.toFixed(2) + "x");
addHistory("Crashed at " + multiplier.toFixed(2) + "x");
    statusDisplay.textContent = "CRASH! Try another flight.";

    multiplierDisplay.textContent =
        multiplier.toFixed(2) + "x";

    startButton.disabled = false;
    cashOutButton.disabled = true;
}

function cashOut() {
    if (!flying) return;

    const reward = Math.floor(10 * multiplier);

    points += reward;
    pointsDisplay.textContent = points;
updateLeaderboard();
    clearInterval(flightTimer);
    flying = false;

    statusDisplay.textContent =
        "Cashed out! +" + reward + " virtual points!";

    startButton.disabled = false;
    cashOutButton.disabled = true;
}

startButton.addEventListener("click", startFlight);
cashOutButton.addEventListener("click", cashOut);

cashOutButton.disabled = true;

function addHistory(message) {
    const historyList = document.getElementById("historyList");

    if (!historyList) return;

    if (historyList.children.length === 1 &&
        historyList.textContent.includes("No flights yet")) {
        historyList.innerHTML = "";
    }

    const item = document.createElement("li");
    item.textContent = message;
    historyList.prepend(item);

    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}
function updateLeaderboard() {
    const rows = document.querySelectorAll(".leader-row");

    const scores = [
        { name: "You", score: points },
        { name: "Player One", score: 900 },
        { name: "Player Two", score: 700 },
        { name: "Player Three", score: 500 }
    ];

    scores.sort((a, b) => b.score - a.score);

    rows.forEach(function (row, index) {
        if (index < scores.length) {
            row.querySelector("span").textContent =
                ["🥇 ", "🥈 ", "🥉 "][index] + scores[index].name;

            row.querySelector("strong").textContent =
                scores[index].score + " points";
        }
    });
}
let soundContext;


  function playGameSound(type) {
  if (!soundOn) return;
    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!soundContext) {
        soundContext = new AudioContextClass();
    }

    if (soundContext.state === "suspended") {
        soundContext.resume();
    }

    const oscillator = soundContext.createOscillator();
    const volume = soundContext.createGain();

    oscillator.connect(volume);
    volume.connect(soundContext.destination);

    if (type === "takeoff") {
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(
            180, soundContext.currentTime
        );
        oscillator.frequency.exponentialRampToValueAtTime(
            520, soundContext.currentTime + 0.5
        );
        volume.gain.setValueAtTime(
            0.15, soundContext.currentTime
        );
        volume.gain.exponentialRampToValueAtTime(
            0.01, soundContext.currentTime + 0.5
        );
        oscillator.start();
        oscillator.stop(soundContext.currentTime + 0.5);
    }

    if (type === "crash") {
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(
            180, soundContext.currentTime
        );
        oscillator.frequency.exponentialRampToValueAtTime(
            55, soundContext.currentTime + 0.35
        );
        volume.gain.setValueAtTime(
            0.18, soundContext.currentTime
        );
        volume.gain.exponentialRampToValueAtTime(
            0.01, soundContext.currentTime + 0.35
        );
        oscillator.start();
        oscillator.stop(soundContext.currentTime + 0.35);
    }
}let soundOn = true;

document.getElementById("soundButton").addEventListener("click", function () {
    soundOn = !soundOn;

    this.textContent = soundOn
        ? "🔊 SOUND: ON"
        : "🔇 SOUND: OFF";
});
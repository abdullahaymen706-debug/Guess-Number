
"use strict";

// Original Elements
let btnCheck = document.querySelector(".check");
let input = document.querySelector("[type='number']");
let message = document.querySelector(".message");
let score = document.querySelector(".score");
let highScore = document.querySelector(".highscore");
let guessTrue = document.querySelector(".number");
let again = document.querySelector(".again");

// Game Variables
let guessNum = Math.ceil(Math.random() * 20);
let playing = true;
let bestScore = Number(localStorage.getItem("highScore")) || 0;
let attempts = 0;
let seconds = 0;
let timer = null;
let wins = Number(localStorage.getItem("wins")) || 0;
let losses = Number(localStorage.getItem("losses")) || 0;
let hintsUsed = 0;

// Load saved high score
highScore.textContent = bestScore;
console.log("Secret number:", guessNum);

// Add optional feature elements
function addFeature(className, tag, text) {
  let element = document.querySelector("." + className);

  if (!element) {
    element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    document.body.appendChild(element);
  }

  return element;
}

let timerDisplay = addFeature("timerDisplay", "p", "Time: 0s");
let attemptsDisplay = addFeature("attemptsDisplay", "p", "Attempts: 0");
let hintBtn = addFeature("hintBtn", "button", "💡 Get Hint");
let hintDisplay = addFeature("hintDisplay", "p", "");
let statsDisplay = addFeature("statsDisplay", "p", "");
let colorBtn = addFeature("colorBtn", "button", "🎨 Change Color");
let resetStatsBtn = addFeature(
  "resetStatsBtn", "button", "🗑 Reset Statistics"
);

// Load saved background color
let savedColor = localStorage.getItem("bgColor");

if (savedColor) {
  document.body.style.background = savedColor;
}

// Display saved statistics
function updateStats() {
  statsDisplay.textContent =
    `🏆 Wins: ${wins} | ❌ Losses: ${losses}`;
}

updateStats();

// Timer
function startTimer() {
  if (timer !== null) return;

  timer = setInterval(function () {
    if (!playing) return;

    seconds++;
    timerDisplay.textContent = `⏱ Time: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

// Sound effects using browser audio
function playSound(frequency, duration) {
  try {
    let audio = new AudioContext();
    let oscillator = audio.createOscillator();
    let gain = audio.createGain();

    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    gain.connect(audio.destination);
    gain.gain.value = 0.08;

    oscillator.start();
    oscillator.stop(audio.currentTime + duration);

    oscillator.onended = () => audio.close();
  } catch (error) {
    console.log("Audio is not supported.");
  }
}

// Update attempts
function updateAttempts() {
  attemptsDisplay.textContent = `🎯 Attempts: ${attempts}`;
}

// Message helper
function showMessage(text) {
  message.textContent = text;
}

// Disable input after game ends
function finishGame() {
  playing = false;
  input.disabled = true;
  btnCheck.disabled = true;
  hintBtn.disabled = true;
  stopTimer();
}

// Keyboard support
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    btnCheck.click();
  }
});

// Check button
btnCheck.addEventListener("click", function () {
  if (!playing) return;

  let guess = Number(input.value);

  if (input.value.trim() === "" || guess < 1 || guess > 20 ||
      !Number.isInteger(guess)) {
    showMessage("⚠️ Enter a whole number from 1 to 20!");
    input.focus();
    return;
  }

  startTimer();
  attempts++;
  updateAttempts();

  if (guess === guessNum) {
    showMessage("Correct Number! 🎉");
    document.body.style.background = "green";
    guessTrue.textContent = guessNum;

    wins++;
    localStorage.setItem("wins", wins);
    updateStats();

    if (Number(score.textContent) > bestScore) {
      bestScore = Number(score.textContent);
      localStorage.setItem("highScore", bestScore);
      highScore.textContent = bestScore;
    }

    localStorage.setItem("bestTime", seconds);
    playSound(880, 0.3);
    finishGame();

  } else {
    score.textContent = Math.max(
      0, Number(score.textContent) - 1
    );

    if (guess > guessNum) {
      showMessage("📈 Too High!");
    } else {
      showMessage("📉 Too Low!");
    }

    playSound(220, 0.12);

    if (Number(score.textContent) <= 0) {
      showMessage(`💔 Game Over! The number was ${guessNum}`);
      guessTrue.textContent = guessNum;
      losses++;
      localStorage.setItem("losses", losses);
      updateStats();
      document.body.style.background = "darkred";
      finishGame();
    }
  }

  input.value = "";
  input.focus();
});

// Hint feature
hintBtn.addEventListener("click", function () {
  if (!playing) return;

  hintsUsed++;

  if (hintsUsed === 1) {
    hintDisplay.textContent =
      guessNum % 2 === 0
        ? "💡 Hint: The number is even."
        : "💡 Hint: The number is odd.";
  } else if (hintsUsed === 2) {
    hintDisplay.textContent =
      `💡 Hint: The number is ${guessNum <= 10 ? "between 1 and 10" : "between 11 and 20"}.`;
  } else {
    hintDisplay.textContent =
      `💡 Hint: The number is ${guessNum % 5 === 0 ? "divisible by 5" : "not divisible by 5"}.`;
  }

  score.textContent = Math.max(
    0, Number(score.textContent) - 1
  );
});

// Change background color
colorBtn.addEventListener("click", function () {
  let colors = ["#34495e", "#8e44ad", "#16a085",
                "#d35400", "#2c3e50", "#2980b9"];

  let color = colors[Math.floor(Math.random() * colors.length)];

  document.body.style.background = color;
  localStorage.setItem("bgColor", color);
});

// Reset game without deleting high score
again.addEventListener("click", function () {
  stopTimer();

  guessNum = Math.ceil(Math.random() * 20);
  playing = true;
  attempts = 0;
  seconds = 0;
  hintsUsed = 0;

  score.textContent = "20";
  message.textContent = "Start guessing...";
  guessTrue.textContent = "?";
  input.value = "";
  input.disabled = false;
  btnCheck.disabled = false;
  hintBtn.disabled = false;

  timerDisplay.textContent = "⏱ Time: 0s";
  attemptsDisplay.textContent = "🎯 Attempts: 0";
  hintDisplay.textContent = "";

  document.body.style.background = savedColor || "";
  console.log("New secret number:", guessNum);
  input.focus();
});

// Reset statistics separately
resetStatsBtn.addEventListener("click", function () {
  let confirmReset = confirm(
    "Are you sure you want to reset wins and losses?"
  );

  if (!confirmReset) return;

  wins = 0;
  losses = 0;

  localStorage.setItem("wins", 0);
  localStorage.setItem("losses", 0);

  updateStats();
});

// Show best time if available
let bestTime = localStorage.getItem("bestTime");

if (bestTime !== null) {
  let bestTimeDisplay = addFeature(
    "bestTimeDisplay", "p", ""
  );

  bestTimeDisplay.textContent =
    `⏱ Last winning time: ${bestTime}s`;
}

// Start game message
if (playing) {
  showMessage("🎮 Guess a number between 1 and 20!");
}

updateAttempts();

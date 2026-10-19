"use strict";
let btnCheck = document.querySelector(".check");
let input = document.querySelector("[type = 'number']");
let message = document.querySelector(".message");
let score = document.querySelector(".score");
let highScore = document.querySelector(".highscore");
let guessTrue = document.querySelector(".number");
let again = document.querySelector(".again");
let guessNum = Math.ceil(Math.random() * 20);
console.log(guessNum);
let playing = true;
let bestScore = Number(localStorage.getItem("highScore")) || 0;
highScore.textContent = bestScore;
input.focus();

function checkGuess() {
  if (!playing) return;
  let value = Number(input.value);
  if (!input.value || value < 1 || value > 20) {
    message.textContent = "Enter a number from 1 to 20!";
    return;
  }
  if (value === guessNum) {
    message.textContent = "Correct Number! 🎉";
    document.body.style.background = "Green";
    guessTrue.textContent = guessNum;
    playing = false;
    let currentScore = Number(score.textContent);
    if (currentScore > bestScore) {
      bestScore = currentScore;
      localStorage.setItem("highScore", bestScore);
      highScore.textContent = bestScore;
      message.textContent = "New High Score! 🏆";
    }
  } else {
    score.textContent = Number(score.textContent) - 1;
    message.textContent = value > guessNum ? "📈 Too High" : "📉 Too Low";
    if (Number(score.textContent) <= 0) {
      message.textContent = "Game Over! 😢";
      playing = false;
      guessTrue.textContent = guessNum;
    }
  }
  input.value = "";
  input.focus();
}
btnCheck.addEventListener("click", checkGuess);
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkGuess();
  }
});
again.addEventListener("click", function () {
  guessNum = Math.ceil(Math.random() * 20);
  console.log(guessNum);
  playing = true;
  score.textContent = 20;
  message.textContent = "Start guessing...";
  guessTrue.textContent = "?";
  document.body.style.background = "";
  input.value = "";
  input.disabled = false;
  btnCheck.disabled = false;
  input.focus();
});
input.addEventListener("input", function () {
  if (input.value.length > 2) {
    input.value = input.value.slice(0, 2);
  }
});



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

// Load the saved high score
let bestScore = Number(localStorage.getItem("highScore")) || 0;
highScore.textContent = bestScore;

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    btnCheck.click();
    if (guessNum === Number(input.value)) {
      input.value === guessNum;
      input.style.background = "black";
    } else input.value = null;
  }
});

btnCheck.addEventListener("click", function (event) {
  if (!playing) return;
  // Return Here Stop The Function
  if (input.value > 0 && input.value <= 20) {
    if (Number(input.value) === guessNum) {
      message.textContent = "Correct Number! 🎉";
      document.body.style.background = "Green";
      guessTrue.textContent = guessNum;
      playing = false;
      let currentScore = Number(score.textContent);
      if (currentScore > bestScore) {
        bestScore = currentScore;
        localStorage.setItem("highScore", bestScore);
        highScore.textContent = bestScore;
      }
    } else if (input.value > guessNum) {
      score.textContent = Number(score.textContent) - 1;
      message.textContent = "📈 Too High";
    } else {
      score.textContent = Number(score.textContent) - 1;
      message.textContent = "📉 Too Low";
    }
  } else {
    alert("The Correct Value Between ( 1 To 20 )");
    input.value = null;
  }
});
again.addEventListener("click", function (event) {
  localStorage.removeItem("highScore");
  location.reload();
});

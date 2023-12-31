const formEl = document.getElementById("form");
const inputContainerEl = document.getElementById("input-container");
const dateEl = document.getElementById("date");

const countdownContainerEl = document.getElementById("countdown");
const completeContainerEl = document.getElementById("complete");

const countdownTitleEl = document.getElementById("countdown-title");
const countdownBtnEl = document.getElementById("countdown-btn");
const spanEl = document.querySelectorAll("span");

const completeInfoEl = document.querySelector(".complete-info");
const completeBtnEl = document.querySelector(".complete-btn");

let savedCountdown;
let countdownTitle = "";
let countdownDate = "";
let countdownActive;
let countdownValue = new Date();

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with Today's date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

//Populate Countdown / Hide UI
const countdownHandler = () => {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const diffTime = countdownValue - now;

    const diffDays = Math.floor(diffTime / day);
    const diffHours = Math.floor((diffTime % day) / hour);
    const diffMinutes = Math.floor((diffTime % hour) / minute);
    const diffSeconds = Math.floor((diffTime % minute) / second);

    inputContainerEl.hidden = true;

    // If the countdown has ended, show final state
    if (diffTime < 0) {
      countdownContainerEl.hidden = true;
      clearInterval(countdownActive);
      completeInfoEl.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeContainerEl.hidden = false;
    } else {
      // else, show the countdown in progress
      countdownTitleEl.textContent = `${countdownTitle}`;
      spanEl[0].textContent = `${diffDays < 10 ? `0${diffDays}` : diffDays}`;
      spanEl[1].textContent = `${diffHours < 10 ? `0${diffHours}` : diffHours}`;
      spanEl[2].textContent = `${
        diffMinutes < 10 ? `0${diffMinutes}` : diffMinutes
      }`;
      spanEl[3].textContent = `${
        diffSeconds < 10 ? `0${diffSeconds}` : diffSeconds
      }`;
      countdownContainerEl.hidden = false;
      completeContainerEl.hidden = true;
    }
  }, 1000);
};

const reset = () => {
  clearInterval(countdownActive);
  inputContainerEl.hidden = false;
  countdownContainerEl.hidden = true;
  completeContainerEl.hidden = true;

  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
};

const createCountdown = (e) => {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  if (countdownDate && countdownTitle) {
    localStorage.setItem("countdown", JSON.stringify(savedCountdown));
    // Get number version of current Date
    countdownValue = new Date(countdownDate).getTime();
    countdownHandler();
  } else {
    alert("Please fill out all the fields");
  }
};

const restorePreviousCountdown = () => {
  if (localStorage.getItem("countdown")) {
    inputContainerEl.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    countdownHandler();
  }
};

// Event listeners
formEl.addEventListener("submit", createCountdown);
countdownBtnEl.addEventListener("click", reset);
completeBtnEl.addEventListener("click", reset);

restorePreviousCountdown();

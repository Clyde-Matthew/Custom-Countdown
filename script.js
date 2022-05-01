"use-strict";
const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");
const video = document.getElementById("video-background");
const countdownEL = document.getElementById("countdown");
const countdownELTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");
const completeEL = document.getElementById("complete");
const completeELinfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// slow down video background
function slowDownVideoBackGround(number) {
  video.playbackRate = number;
}
slowDownVideoBackGround(1.1)

// set date input with todays date
const today = new Date().toISOString().split("T")[0];
// console.log(today);
dateEl.setAttribute("min", today);

// Populate countdown/completer the UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    console.log(now);
    const distance = countdownValue - now;
    console.log(distance);

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);
    console.log(days, hours, minutes, seconds);
    // hide input
    inputContainer.hidden = true;

    // if the countdown has ended, show complete
    if (distance < 0) {
      countdownEL.hidden = true;
      clearInterval(countdownActive);
      completeELinfo.textContent = `${countdownTitle.toUpperCase()} finished on ${countdownDate}`;
      completeEL.hidden = false;
    } else {
      // show countdown in progress
      // populating countdown
      countdownELTitle.textContent = `${countdownTitle.toUpperCase()}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${minutes}`;
      timeElements[2].textContent = `${hours}`;
      timeElements[3].textContent = `${seconds}`;
      completeEL.hidden = true;
      countdownEL.hidden = false;
    }
  }, second);
}

// updateCountdown function
function updateCountdown(e) {
  e.preventDefault();
  console.log(e);
  countdownTitle = e.srcElement[0].value;
  console.log(countdownTitle);
  countdownDate = e.srcElement[1].value;
  console.log(countdownDate);
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem("countdown", JSON.stringify(savedCountdown));
  // check for a valid date
  if (!countdownDate) {
    alert("please select a valid date for the countdown.");
  } else {
    // get number version of date from the current date and update the DOM
    countdownValue = new Date(countdownDate).getTime();
    console.log(countdownValue);
    //   function to update the DOM
    updateDOM();
  }
}

// reset function
function reset() {
  // hide countdown/ show input
  countdownEL.hidden = true;
  completeEL.hidden = true;
  inputContainer.hidden = false;

  // stop the countdown
  clearInterval(countdownActive);
  // reset values
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
  slowDownVideoBackGround(0.4);
}

//  restoring data from local storage
function restorePreviousCountdown() {
  // get countdown from local storage if available
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}
// on load, check local storage
restorePreviousCountdown();

// event listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

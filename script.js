// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations

let equationsArray = [];
let questionAmount = 0;
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";
let bestScoreArray = [];

// Scroll
let valueY = 0;

// to refresh spalsh page best score
function bestScoreToDOM() {
	bestScores.forEach((e, index) => {
		e.textContent = `${bestScoreArray[index].bestScore}s`;
	});
}

// check ls for best score, set best score
function getSavedBestScore() {
	if (localStorage.getItem("bestScore"))
		bestScoreArray = JSON.parse(localStorage.bestScore);
	else {
		bestScoreArray = [
			{ question: 10, bestScore: finalTimeDisplay },
			{ question: 25, bestScore: finalTimeDisplay },
			{ question: 50, bestScore: finalTimeDisplay },
			{ question: 99, bestScore: finalTimeDisplay },
		];
		localStorage.setItem("bestScore", JSON.stringify(bestScoreArray));
	}
	bestScoreToDOM();
}
// update best score array
function updateBestScore() {
	bestScoreArray.forEach((e, index) => {
		// select the correct best score
		if (questionAmount == e.question) {
			// return the best score as a No. with one decimal
			const savedBestScore = Number(bestScoreArray[index].bestScore);
			// update new best score if new value is less or replacin 0
			if (savedBestScore === 0 || savedBestScore > finalTime)
				bestScoreArray[index].bestScore = finalTimeDisplay;
		}
		// update the splash page
		bestScoreToDOM();
		// save to localStorage
		localStorage.setItem("bestScore", JSON.stringify(bestScoreArray));
	});
	console.log(baseTime);
}

// Reset the game
function playAgain() {
	gamePage.addEventListener("click", startTimer);
	scorePage.hidden = true;
	splashPage.hidden = false;
	equationsArray = [];
	playerGuessArray = [];
	valueY = 0;
	playAgainBtn.hidden = true;
	timePlayed = 0;
}

// Show Score Page
function showScorePage() {
	gamePage.hidden = true;
	scorePage.hidden = false;
	setTimeout(() => {
		playAgainBtn.hidden = false;
	}, 1000);
}

// Format and display time in dom
function scoreToDOM() {
	finalTimeDisplay = finalTime.toFixed(1);
	baseTime = timePlayed.toFixed(1);
	penaltyTime = penaltyTime.toFixed(1);

	baseTimeEl.textContent = `Base Time: ${baseTime}s`;
	penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime}s`;
	finalTimeEl.textContent = `${finalTimeDisplay}s`;

	updateBestScore();
	// scroll to the top go to the score page
	itemContainer.scroll({
		top: 0,
		behavior: "instant",
	});

	showScorePage();
}

// Stop timer , process result, go to score page
function checkTime() {
	if (playerGuessArray.length == questionAmount) {
		clearInterval(timer);
		console.log("player guess ; ", playerGuessArray);

		// check for correct guess and incorrect guess
		equationsArray.forEach((eq, index) => {
			if (eq.evaluated === playerGuessArray[index]) {
				// correct guess
			} else {
				// incorrect guess
				penaltyTime += 0.5;
			}
		});
		finalTime = timePlayed + penaltyTime;
		console.log(
			`Time:${timePlayed} , penalty:${penaltyTime} , Final:${finalTime}`
		);
		scoreToDOM();
	}
}

// add a tenth of a sec to timePlayed
function addTime() {
	timePlayed += 0.1;
	checkTime();
}

// Start time when game page is clicked
function startTimer() {
	// reset Time
	tiemPlayed = 0;
	penaltyTime = 0;
	finalTime = 0;
	timer = setInterval(addTime, 100);
	gamePage.removeEventListener("click", startTimer);
}

// Store user selection
function select(guessedTrue) {
	// scroll 80 pixcel at a time
	valueY += 80;
	itemContainer.scroll(0, valueY);
	// add player guess to array
	return guessedTrue
		? playerGuessArray.push("true")
		: playerGuessArray.push("false");
}

// Display our game page
function showGamePage() {
	gamePage.hidden = false;
	countdownPage.hidden = true;
}

// Get random No
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
	// Randomly choose how many correct equations there should be
	const correctEquations = getRandomInt(questionAmount);
	console.log("correct equation: ", correctEquations);
	// Set amount of wrong equations
	const wrongEquations = questionAmount - correctEquations;
	console.log("wrong equation: ", wrongEquations);

	// Loop through, multiply random numbers up to 9, push to array
	for (let i = 0; i < correctEquations; i++) {
		firstNumber = getRandomInt(9);
		secondNumber = getRandomInt(9);
		const equationValue = firstNumber * secondNumber;
		const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
		equationObject = { value: equation, evaluated: "true" };
		equationsArray.push(equationObject);
	}
	// // Loop through, mess with the equation results, push to array
	for (let i = 0; i < wrongEquations; i++) {
		firstNumber = getRandomInt(9);
		secondNumber = getRandomInt(9);
		const equationValue = firstNumber * secondNumber;
		wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
		wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
		wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
		const formatChoice = getRandomInt(3);
		const equation = wrongFormat[formatChoice];
		equationObject = { value: equation, evaluated: "false" };
		equationsArray.push(equationObject);
	}
	shuffle(equationsArray);
	// equationToDOM();
}

function equationToDOM() {
	equationsArray.forEach((eq) => {
		// Item
		const item = document.createElement("div");
		item.classList.add("item");
		// Eq text
		const equationText = document.createElement("h1");
		equationText.textContent = eq.value;
		// append
		item.appendChild(equationText);
		itemContainer.appendChild(item);
	});
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
	// Reset DOM, Set Blank Space Above
	itemContainer.textContent = "";
	// Spacer
	const topSpacer = document.createElement("div");
	topSpacer.classList.add("height-240");
	// Selected Item
	const selectedItem = document.createElement("div");
	selectedItem.classList.add("selected-item");
	// Append
	itemContainer.append(topSpacer, selectedItem);

	// Create Equations, Build Elements in DOM
	createEquations();
	equationToDOM();
	// Set Blank Space Below
	const bottomSpacer = document.createElement("div");
	bottomSpacer.classList.add("height-500");
	itemContainer.appendChild(bottomSpacer);
}

function countDownStart() {
	countdown.textContent = "3";

	setTimeout(() => {
		countdown.textContent = "2";
	}, 1000);
	setTimeout(() => {
		countdown.textContent = "1";
	}, 2000);
	setTimeout(() => {
		countdown.textContent = "GO!";
	}, 3000);
}

// Navigate from splash page to countdown page
function showCountdown() {
	countdownPage.hidden = false;
	splashPage.hidden = true;
	countDownStart();
	// createEquations();
	populateGamePage();
	setTimeout(showGamePage, 4000);
}

// Get the value from selected radio button
function getRadioValue() {
	let radioValue;
	radioInputs.forEach((radioInput) => {
		if (radioInput.checked) radioValue = radioInput.value;
	});
	return radioValue;
}

// Form that decide the amount of question
function selectQuestionAmount(e) {
	e.preventDefault();
	questionAmount = getRadioValue();
	console.log("question amount: ", questionAmount);

	if (questionAmount) showCountdown();
}

startForm.addEventListener("click", () => {
	radioContainers.forEach((radioEl) => {
		// Remove selected a label styling
		radioEl.classList.remove("selected-label");

		// add it back if radio input is checked
		if (radioEl.children[1].checked) radioEl.classList.add("selected-label");
	});
});

// EventListener
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);

// window.addEventListener("load", getSavedBestScore);
getSavedBestScore();

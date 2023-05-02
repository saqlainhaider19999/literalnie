let GAMESTATUS = 'START';

let randomWord = words[Math.floor(Math.random() * words.length)];

const pickedWord = randomWord.toUpperCase();
// console.log(pickedWord);

let boardEl = document.querySelector('.board');

for (let i = 0; i < 6; i++) {
	for (let j = 0; j < pickedWord.length; j++) {
		let el = document.createElement('div');
		el.classList.add('square');
		el.setAttribute('level', `${i}`);
		boardEl.appendChild(el);
	}
}

const startGame = () => {
	document.querySelector('#tutorial').style.display = 'none';
	GAMESTATUS = 'GAME';
};

let currentWord = '';
let currentLevel = 0;

let currentSquares = document.querySelectorAll(".square[level='0']");

let keysEl = document.querySelectorAll('.key');
let keyboardEl = document.querySelector('.keyboard');

const pushLetter = (letter) => {
	if (currentWord.length < pickedWord.length) {
		let lg = currentWord.length;
		currentSquares[lg].innerHTML = letter;

		currentWord += letter;
	}
};

const popLetter = () => {
	if (currentWord.length > 0) {
		let lg = currentWord.length;
		currentSquares[lg - 1].innerHTML = '';

		currentWord = currentWord.slice(0, -1);
	}
};

const confirmWord = async () => {
	if (currentWord.length < pickedWord.length) return;

	let goodLetters = [];
	let nearlyLetters = [];
	let badLetters = [];

	let currentWordLetters = [];
	let goodLettersCount = 0;

	for (let i = 0; i < currentWord.length; i++) {
		if (currentWord[i] == pickedWord[i]) {
			goodLetters.push(currentWord[i]);
			currentWordLetters.push('good');
			goodLettersCount++;
		} else if (pickedWord.includes(currentWord[i])) {
			nearlyLetters.push(currentWord[i]);
			currentWordLetters.push('nearly');
		} else {
			badLetters.push(currentWord[i]);
			currentWordLetters.push('bad');
		}
	}

	currentSquares.forEach((square, index) => {
		square.classList.add(currentWordLetters[index]);
	});

	keysEl.forEach((key) => {
		if (goodLetters.includes(key.innerHTML)) {
			key.classList.add('good');
		} else if (nearlyLetters.includes(key.innerHTML)) {
			key.classList.add('nearly');
		} else if (badLetters.includes(key.innerHTML)) {
			key.classList.add('bad');
		}
	});

	if (goodLettersCount == pickedWord.length) {
		GAMESTATUS = 'END';
		endGame(1);
	} else {
		if (currentLevel + 1 > 5) {
			GAMESTATUS = 'END';
			endGame(0);
		} else {
			currentWord = '';
			currentLevel++;
			currentSquares = document.querySelectorAll(`.square[level='${currentLevel}']`);
		}
	}
};

const endGame = (status) => {
	const statusEl = document.querySelector('#end-status');
	const passwordEl = document.querySelector('#password');

	passwordEl.innerHTML = 'HASŁO TO: ' + pickedWord;

	if (status == 1) {
		statusEl.innerHTML = 'ZWYCIĘSTWO';
		statusEl.classList.add('green');
	} else {
		statusEl.innerHTML = 'PORAŻKA';
		statusEl.classList.add('red');
	}

	document.querySelector('#end').style.display = 'flex';
};

const restartGame = () => {
	window.location.reload();
};

document.querySelector('#restart-game').addEventListener('click', restartGame);

document.querySelector('#start-game').addEventListener('click', startGame);

keyboardEl.addEventListener('click', (e) => {
	if (e.target.classList.contains('key')) {
		if (GAMESTATUS == 'GAME') {
			if (e.target.innerHTML == 'ENTER') {
				confirmWord();
			} else if (e.target.innerHTML == 'COFNIJ') {
				popLetter();
			} else {
				pushLetter(e.target.innerHTML);
			}
		}
	}
});

document.addEventListener('keydown', async (e) => {
	if (GAMESTATUS == 'GAME') {
		if (e.key == 'Backspace') {
			popLetter();
		} else if (e.key == 'Enter') {
			confirmWord();
		} else if (e.key.length == 1) {
			let key = e.key.toUpperCase();

			if (key.match(/[QWERTYUIOPASDFGHJKLZXCVBNMĄĆĘŁÓŚŃŻŹ]/i)) {
				pushLetter(key);
			}
		}
	} else if (GAMESTATUS == 'START') {
		if (e.key == 'Enter') {
			startGame();
		}
	} else if (GAMESTATUS == 'END') {
		if (e.key == 'Enter') {
			restartGame();
		}
	}
});

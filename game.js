let GAMESTATUS = "START";

let randomWord = words[Math.floor(Math.random()*words.length)];

const pickedWord = randomWord.toUpperCase();
console.log(pickedWord);

let boardEl = document.querySelector(".board");
boardEl.style.gridTemplateColumns = `repeat(${pickedWord.length}, 70px)`;

for (let i = 0; i < 6; i++){
    for (let j = 0; j < pickedWord.length; j++){
        let el = document.createElement("div");
        el.classList.add("square");
        el.setAttribute("level", `${i}`);
        boardEl.appendChild(el);
    }
}

document.querySelector("#start-game").addEventListener("click", () => {
    document.querySelector("#tutorial").style.display = "none";
    GAMESTATUS = "GAME";
})

let currentWord = "";
let currentLevel = 0;

let currentSquares = document.querySelectorAll(".square[level='0']");

let keysEl = document.querySelectorAll(".key");
let keyboardEl = document.querySelector(".keyboard");

let pushLetter = (letter) => {
    if(currentWord.length < pickedWord.length){
        let lg = currentWord.length;
        currentSquares[lg].innerHTML = letter;

        currentWord += letter;
    }
}

let popLetter = () => {
    if(currentWord.length > 0){
        let lg = currentWord.length;
        currentSquares[lg-1].innerHTML = "";

        currentWord = currentWord.slice(0, -1);
    }
}

let confirmWord = () => {

    if (currentWord.length < pickedWord.length) return;

    let goodLetters = [];
    let nearlyLetters = [];
    let badLetters = [];

    let currentWordLetters = [];
    let goodLettersCount = 0;

    for (let i = 0; i < currentWord.length; i++){
        if (currentWord[i] == pickedWord[i]){
            goodLetters.push(currentWord[i]);
            currentWordLetters.push("good");
            goodLettersCount++;
        } else if (pickedWord.includes(currentWord[i])){
            nearlyLetters.push(currentWord[i]);
            currentWordLetters.push("nearly");
        } else {
            badLetters.push(currentWord[i]);
            currentWordLetters.push("bad");
        }
    }

    currentSquares.forEach((square, index) => {
        square.classList.add(currentWordLetters[index]);
    })

    keysEl.forEach(key => {
        if (goodLetters.includes(key.innerHTML)){
            key.classList.add("good");
        } else if (nearlyLetters.includes(key.innerHTML)){
            key.classList.add("nearly");
        } else if (badLetters.includes(key.innerHTML)){
            key.classList.add("bad");
        }
    })

    if (goodLettersCount == pickedWord.length){
        GAMESTATUS = "END";
        endGame(1);
    } else {
        if (currentLevel + 1 > 5){
            GAMESTATUS = "END";
            endGame(0);
        } else {
            currentWord = "";
            currentLevel++;
            currentSquares = document.querySelectorAll(`.square[level='${currentLevel}']`);
        }
    }

}

let endGame = (status) => {

    let statusEl = document.querySelector("#end-status");
    let passwordEl = document.querySelector("#password");

    passwordEl.innerHTML = "HASŁO TO: " + pickedWord;

    if (status == 1){
        statusEl.innerHTML = "ZWYCIĘSTWO";
        statusEl.classList.add("green");
    } else {
        statusEl.innerHTML = "PORAŻKA";
        statusEl.classList.add("red");
    }

    document.querySelector("#end").style.display = "flex";
    document.querySelector("#restart-game").addEventListener("click", () => {  
        window.location.reload();
    })
}

keyboardEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("key")){
        if (e.target.innerHTML == "ENTER"){
            if (GAMESTATUS == "GAME"){
                confirmWord();
            }
        } else if (e.target.innerHTML == "BACKSPACE"){
            if (GAMESTATUS == "GAME"){
                popLetter();
            }
        } else {
            if (GAMESTATUS == "GAME"){
                pushLetter(e.target.innerHTML);
            }
        }
    }
})
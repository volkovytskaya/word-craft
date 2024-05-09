import { words } from './words-array.js';
import { playAgainButton, showReplayIcon, hideReplayIcon, closeModal, showModal, gameOverContent, playAgainContent } from './modals.js';
import { showNotEnoughLettersMessage, showNotInWordsListMessage, hideMessage } from './messages.js';
class Board {
    constructor() {
        this.maxWordLength = 5;
        this.maxWordsNum = 6;
        this.allBoxes = document.querySelectorAll('.box');
        this.emptyBoxes = document.querySelectorAll('.box');
        this.counterOfEnteredLetters = 0;
        this.counterofEnteredWords = 0;
        this.currentBoardState = [];
    }
    fillEmptyBoxesWithLetters(keyName) {
        const regExp = /^[A-za-z]$/;
        for (let i = 0; i < this.maxWordLength; i++) {
            if (this.emptyBoxes[i].innerHTML === '' &&
                regExp.test(keyName) &&
                game.wordIsNotGuessed) {
                this.emptyBoxes[i].innerHTML = keyName.toUpperCase();
                this.counterOfEnteredLetters++;
                break;
            }
        }
    }
    removeLetterFromBox() {
        for (let i = this.maxWordLength - 1; i >= 0; i--) {
            if (this.emptyBoxes[i].innerHTML !== '' &&
                game.wordIsNotGuessed) {
                this.emptyBoxes[i].innerHTML = '';
                this.counterOfEnteredLetters--;
                break;
            }
        }
    }
    updateBoardStateInLocalStorage() {
        if (this.currentBoardState.length === 0) {
            localStorage.removeItem('boardState');
        }
        else {
            localStorage.setItem('boardState', this.currentBoardState.toString());
        }
    }
    updateBoardStateOnUI() {
        let enteredWords = [];
        let boardStateInLocalStorage = localStorage.getItem('boardState');
        if (boardStateInLocalStorage !== null) {
            enteredWords = boardStateInLocalStorage.split(',');
        }
        for (let i = 0; i < enteredWords.length; i++) {
            for (let j = 0; j < enteredWords[i].length; j++) {
                this.fillEmptyBoxesWithLetters(enteredWords[i][j]);
            }
            game.checkIfGuessed(wordToGuess, board.returnEnteredWord());
        }
    }
    addColorToLetters(wordToGuess, enteredWord) {
        for (let i = 0; i < this.maxWordLength; i++) {
            for (let j = 0; j < this.maxWordLength; j++) {
                if (enteredWord[i] === wordToGuess[j]) {
                    this.emptyBoxes[i].classList.add('orange');
                    this.emptyBoxes[i].classList.add('colored');
                }
            }
        }
        for (let i = 0; i < this.maxWordLength; i++) {
            if (enteredWord[i] === wordToGuess[i]) {
                this.emptyBoxes[i].classList.add('green');
                this.emptyBoxes[i].classList.add('colored');
            }
        }
        for (let i = 0; i < this.maxWordLength; i++) {
            if (!this.emptyBoxes[i].classList.contains('colored')) {
                this.emptyBoxes[i].classList.add('grey');
            }
        }
    }
    removeColorFromLetters() {
        for (let i = 0; i < this.allBoxes.length; i++) {
            this.allBoxes[i].classList.remove('colored');
            this.allBoxes[i].classList.remove('orange');
            this.allBoxes[i].classList.remove('green');
            this.allBoxes[i].classList.remove('grey');
        }
    }
    returnEnteredWord() {
        let enteredWord = '';
        for (let i = 0; i < this.maxWordLength; i++) {
            enteredWord += this.emptyBoxes[i].innerHTML;
            enteredWord = enteredWord.slice(0, 5);
        }
        return enteredWord;
    }
    checkNumOfEnteredWords() {
        let boardStateInLocalStorage = localStorage.getItem('boardState');
        if (boardStateInLocalStorage === null) {
            this.counterofEnteredWords = 0;
        }
        else {
            this.counterofEnteredWords = boardStateInLocalStorage.split(',').length;
        }
    }
    clearBoard() {
        for (let i = 0; i < this.allBoxes.length; i++) {
            this.allBoxes[i].innerHTML = '';
        }
        this.counterOfEnteredLetters = 0;
        this.emptyBoxes = document.querySelectorAll('.box');
    }
}
class Game {
    constructor() {
        this.wordIsNotGuessed = true;
        this.wordsSorted = words.sort();
    }
    selectWordForGuessing() {
        let indexOfWordToGuess = Math.floor(Math.random() * (words.length - 1));
        wordToGuess = words[indexOfWordToGuess].toUpperCase();
        localStorage.setItem('wordForGuessingIsSelected', 'true');
        localStorage.setItem('id', indexOfWordToGuess.toString());
        return wordToGuess;
    }
    checkIfGuessed(wordToGuess, enteredWord) {
        if (wordToGuess === enteredWord) {
            board.addColorToLetters(wordToGuess, enteredWord);
            this.wordIsNotGuessed = false;
            localStorage.setItem('wordIsNotGuessed', 'false');
            localStorage.setItem('wordForGuessingIsSelected', 'false');
            showModal(playAgainContent, playAgainButton);
            showReplayIcon();
        }
        else {
            board.addColorToLetters(wordToGuess, enteredWord);
            this.wordIsNotGuessed = true;
            localStorage.setItem('wordIsNotGuessed', 'true');
            board.emptyBoxes = [].slice.call(board.emptyBoxes, 5);
            board.checkNumOfEnteredWords();
            if (checkIfAttemptsEnded()) {
                showModal(gameOverContent, playAgainButton);
                showReplayIcon();
            }
        }
        board.counterOfEnteredLetters = 0;
    }
    checkIfWordInWordsList(enteredWord) {
        let low = 0;
        let high = words.length - 1;
        let mid = Math.floor((low + high) / 2);
        let inWordsList = false;
        let midWordFromWordsList = this.wordsSorted[mid].toUpperCase();
        while (low <= high) {
            if (enteredWord === midWordFromWordsList) {
                inWordsList = true;
                break;
            }
            else if (enteredWord < midWordFromWordsList) {
                high = mid - 1;
                mid = Math.floor((low + high) / 2);
                midWordFromWordsList = this.wordsSorted[mid].toUpperCase();
            }
            else {
                low = mid + 1;
                mid = Math.floor((low + high) / 2);
                midWordFromWordsList = this.wordsSorted[mid].toUpperCase();
            }
        }
        return inWordsList;
    }
    startNewGame() {
        board.currentBoardState = [];
        board.updateBoardStateInLocalStorage();
        board.updateBoardStateOnUI();
        wordToGuess = this.selectWordForGuessing();
        closeModal();
        hideReplayIcon();
        board.clearBoard();
        board.removeColorFromLetters();
        this.wordIsNotGuessed = true;
        localStorage.setItem('wordIsNotGuessed', 'true');
    }
}
const keys = document.querySelectorAll('.key');
let board = new Board();
let game = new Game();
let boardStateInLocalStorage = localStorage.getItem('boardState');
if (boardStateInLocalStorage !== null) {
    board.currentBoardState = boardStateInLocalStorage.split(',');
}
else {
    board.currentBoardState = [];
}
let wordToGuess = '';
if (localStorage.getItem('wordForGuessingIsSelected') === null) {
    wordToGuess = game.selectWordForGuessing();
}
else {
    wordToGuess = words[Number(localStorage.getItem('id'))].toUpperCase();
}
board.checkNumOfEnteredWords();
board.updateBoardStateOnUI();
if (localStorage.getItem('wordForGuessingIsSelected') === 'false' &&
    board.counterofEnteredWords > 0) {
    board.updateBoardStateOnUI();
}
if (playAgainButton) {
    playAgainButton.addEventListener('click', () => {
        game.startNewGame();
    });
}
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (!event.metaKey) { // checks if command is pressed (command + R for page reloading)
        board.fillEmptyBoxesWithLetters(keyName);
    }
});
document.addEventListener('keydown', handleKeyDown);
function handleKeyDown(event) {
    if (isEnterPressed(event) && isWordComplete()) {
        handleEnterPressedWhenWordComplete();
    }
    else if (isEnterPressed(event) && !isWordComplete()) {
        showNotEnoughLettersMessage();
        hideMessage();
    }
    else if (isDeletePressed(event) || isBackspace(event)) {
        board.removeLetterFromBox();
    }
}
function isEnterPressed(event) {
    return event.key === 'Enter';
}
function isDeletePressed(event) {
    return event.key === 'Delete';
}
function isBackspace(event) {
    return event.key === 'Backspace';
}
function isWordComplete() {
    return board.counterOfEnteredLetters === 5;
}
function handleEnterPressedWhenWordComplete(key) {
    if (game.checkIfWordInWordsList(board.returnEnteredWord())) {
        board.currentBoardState.push(board.returnEnteredWord());
        board.updateBoardStateInLocalStorage();
        game.checkIfGuessed(wordToGuess, board.returnEnteredWord());
    }
    else {
        showNotInWordsListMessage();
        hideMessage();
    }
    if (key) {
        key.blur(); // removes keyboard focus onclick
    }
}
keys.forEach((key) => {
    key.addEventListener('click', handleKeyClick);
});
function handleKeyClick(event) {
    const key = event.target;
    let keyContent = '';
    if (key !== null) {
        keyContent = key.innerHTML;
    }
    if (keyContent !== 'Enter' && keyContent !== 'Delete') {
        handleLetterKey(key, keyContent);
    }
    else if (keyContent === 'Enter' && isWordComplete()) {
        handleEnterPressedWhenWordComplete(key);
    }
    else if (keyContent === 'Enter' && !isWordComplete()) {
        showNotEnoughLettersMessage();
        hideMessage();
    }
    else if (keyContent === 'Delete') {
        board.removeLetterFromBox();
        key.blur();
    }
}
function handleLetterKey(key, keyContent) {
    board.fillEmptyBoxesWithLetters(keyContent);
    key.blur();
}
function checkIfAttemptsEnded() {
    if (board.counterofEnteredWords === board.maxWordsNum) {
        return true;
    }
    return false;
}
console.log(wordToGuess);
console.log('current board state: ', board.currentBoardState);
console.log('board in Local Storage: ', localStorage.getItem('boardState'));

import { words } from './words-array.js';
import { playAgainButton, showReplayIcon, hideReplayIcon, closeModal, showModal, gameOverContent, playAgainContent } from './modals.js';
import { showNotEnoughLettersMessage, showNotInWordsListMessage, hideMessage } from './messages.js';
class Board {
    constructor() {
        this.maxWordLength = 5;
        this.maxWordsNum = 6;
        this.allBoxes = document.querySelectorAll('.box');
        this.emptyBoxes = Array.from(this.allBoxes);
        this.counterOfEnteredLetters = 0;
        this.counterOfEnteredWords = 0;
        this.currentBoardState = [];
        this.boardStateInLocalStorage = this.getBoardStateFromLocalStorage();
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
    getBoardStateFromLocalStorage() {
        let boardStateInLocalStorage = localStorage.getItem('boardState');
        if (boardStateInLocalStorage !== null) {
            return boardStateInLocalStorage.split(',');
        }
        return [];
    }
    updateBoardStateInLocalStorage() {
        if (this.currentBoardState.length === 0) {
            localStorage.removeItem('boardState');
        }
        else {
            localStorage.setItem('boardState', this.currentBoardState.toString());
        }
    }
    updateBoardStateBasedOnLocalStorage(boardStateInLocalStorage) {
        if (boardStateInLocalStorage !== null) {
            board.currentBoardState = boardStateInLocalStorage;
        }
    }
    updateBoardStateOnUI(enteredWords) {
        for (let i = 0; i < enteredWords.length; i++) {
            for (let j = 0; j < enteredWords[i].length; j++) {
                this.fillEmptyBoxesWithLetters(enteredWords[i][j]);
            }
            game.checkIfGuessed(game.wordToGuess, board.returnEnteredWord());
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
    returnEnteredWords() {
        if (board.boardStateInLocalStorage !== null) {
            return board.boardStateInLocalStorage;
        }
        else {
            return [];
        }
    }
    updateCounterOfEnteredWords() {
        if (this.boardStateInLocalStorage === null) {
            this.counterOfEnteredWords = 0;
        }
        else {
            this.counterOfEnteredWords = this.boardStateInLocalStorage.length;
        }
        return this.counterOfEnteredWords;
    }
    clearBoard() {
        for (let i = 0; i < this.allBoxes.length; i++) {
            this.allBoxes[i].innerHTML = '';
        }
        this.counterOfEnteredLetters = 0;
        this.emptyBoxes = Array.from(this.allBoxes);
    }
}
class Game {
    constructor() {
        this.wordIsNotGuessed = true;
        this.wordsSorted = words.sort();
        this.wordToGuess = '';
    }
    selectWordForGuessing() {
        let indexOfWordToGuess = Math.floor(Math.random() * (words.length - 1));
        this.wordToGuess = words[indexOfWordToGuess].toUpperCase();
        localStorage.setItem('wordForGuessingIsSelected', 'true');
        localStorage.setItem('id', indexOfWordToGuess.toString());
        return this.wordToGuess;
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
            board.boardStateInLocalStorage = board.getBoardStateFromLocalStorage();
            board.updateCounterOfEnteredWords();
            if (this.checkIfAttemptsEnded()) {
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
    isWordComplete() {
        return board.counterOfEnteredLetters === 5;
    }
    checkIfAttemptsEnded() {
        if (board.counterOfEnteredWords === board.maxWordsNum) {
            return true;
        }
        return false;
    }
    startNewGame() {
        board.currentBoardState = [];
        board.updateBoardStateInLocalStorage();
        this.wordToGuess = this.selectWordForGuessing();
        closeModal();
        hideReplayIcon();
        board.clearBoard();
        board.removeColorFromLetters();
        this.wordIsNotGuessed = true;
        localStorage.setItem('wordIsNotGuessed', 'true');
    }
}
class Keyboard {
    constructor() {
        this.keys = document.querySelectorAll('.key');
    }
    handleKeyDown(event) {
        if (this.isEnterPressed(event) && game.isWordComplete()) {
            this.handleEnterPressedWhenWordComplete();
        }
        else if (this.isEnterPressed(event) && !game.isWordComplete()) {
            showNotEnoughLettersMessage();
            hideMessage();
        }
        else if (this.isDeletePressed(event) || this.isBackspace(event)) {
            board.removeLetterFromBox();
        }
    }
    isEnterPressed(event) {
        return event.key === 'Enter';
    }
    isDeletePressed(event) {
        return event.key === 'Delete';
    }
    isBackspace(event) {
        return event.key === 'Backspace';
    }
    handleEnterPressedWhenWordComplete(key) {
        if (game.checkIfWordInWordsList(board.returnEnteredWord())) {
            board.currentBoardState.push(board.returnEnteredWord());
            board.updateBoardStateInLocalStorage();
            game.checkIfGuessed(game.wordToGuess, board.returnEnteredWord());
        }
        else {
            showNotInWordsListMessage();
            hideMessage();
        }
        if (key) {
            key.blur();
        }
    }
    handleKeyClick(event) {
        const key = event.target;
        let keyContent = '';
        if (key !== null) {
            keyContent = key.innerHTML;
        }
        if (keyContent !== 'Enter' && keyContent !== 'Delete') {
            this.handleLetterKey(key, keyContent);
        }
        else if (keyContent === 'Enter' && game.isWordComplete()) {
            this.handleEnterPressedWhenWordComplete(key);
        }
        else if (keyContent === 'Enter' && !game.isWordComplete()) {
            showNotEnoughLettersMessage();
            hideMessage();
        }
        else if (keyContent === 'Delete') {
            board.removeLetterFromBox();
            key.blur();
        }
    }
    handleLetterKey(key, keyContent) {
        board.fillEmptyBoxesWithLetters(keyContent);
        key.blur();
    }
}
let board = new Board();
let game = new Game();
let keyboard = new Keyboard();
board.updateBoardStateBasedOnLocalStorage(board.getBoardStateFromLocalStorage());
if (localStorage.getItem('wordForGuessingIsSelected') === null) {
    game.wordToGuess = game.selectWordForGuessing();
}
else {
    game.wordToGuess = words[Number(localStorage.getItem('id'))].toUpperCase();
}
board.updateCounterOfEnteredWords();
board.updateBoardStateOnUI(board.returnEnteredWords());
if (playAgainButton) {
    playAgainButton.addEventListener('click', () => {
        game.startNewGame();
    });
}
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (!event.metaKey) {
        board.fillEmptyBoxesWithLetters(keyName);
    }
});
document.addEventListener('keydown', (event) => {
    keyboard.handleKeyDown(event);
});
keyboard.keys.forEach((key) => {
    key.addEventListener('click', (event) => {
        keyboard.handleKeyClick(event);
    });
});
console.log(game.wordToGuess);

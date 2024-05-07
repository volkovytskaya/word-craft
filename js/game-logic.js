import { words } from '/js/words-array.js';
import { 
    playAgainButton, 
    showReplayIcon, 
    closePlayAgainModal, 
    hideReplayIcon, 
    openPlayAgainModal 
} from '/js/modals.js';
import { 
    showNotEnoughLettersMessage,
    hideMessage,
    showNotInWordsListMessage
} from '/js/messages.js';

class Board {
    constructor(currentBoardState) {
        this.maxWordLength = 5;
        this.allBoxes = document.querySelectorAll('.box');
        this.emptyBoxes = document.querySelectorAll('.box');
        this.currentBoardState = currentBoardState;
        this.counterOfEnteredLetters = 0;
    }
    fillBoxesWithLetters(keyName) {
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
    removeLetter() {
        for (let i = this.maxWordLength; i >= 0; i--) {
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
        } else {
            localStorage.setItem('boardState', this.currentBoardState);
            let enteredWords = localStorage.getItem('boardState').split(',');
            if (enteredWords[0] === '') enteredWords = [];
        }
    }
    updateBoardStateOnUI() {
        let enteredWords = [];
        if (localStorage.getItem('boardState') !== null) {
            enteredWords = localStorage.getItem('boardState').split(',');
        }
        for (let i = 0; i < enteredWords.length; i++) {
            for (let j = 0; j < enteredWords[i].length; j++) {
                this.fillBoxesWithLetters(enteredWords[i][j]);
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
    clearBoard() {
        for (let i = 0; i < this.allBoxes.length; i++) {
            this.allBoxes[i].innerHTML = '';
        }
        this.counterOfEnteredLetters = 0;
        this.emptyBoxes = document.querySelectorAll('.box');
    }
}

class Game {
    constructor(wordToGuess) {
        this.wordIsNotGuessed = true;
        this.wordToGuess = wordToGuess;
        this.wordsSorted = words.sort();
    }
    selectWordForGuessing() {
        let indexOfWordToGuess = Math.floor(Math.random() * (words.length - 1));
        this.wordToGuess = words[indexOfWordToGuess].toUpperCase();
        localStorage.setItem('wordForGuessingIsSelected', true);
        localStorage.setItem('id', indexOfWordToGuess);
        return this.wordToGuess;
    }
    checkIfGuessed(wordToGuess, enteredWord) {
        if (this.wordToGuess === enteredWord) {
            board.addColorToLetters(this.wordToGuess, enteredWord);
            this.wordIsNotGuessed = false;
            localStorage.setItem('wordIsNotGuessed', this.wordIsNotGuessed);
            localStorage.setItem('wordForGuessingIsSelected', false);
            openPlayAgainModal();
            showReplayIcon();
        } else {
            board.addColorToLetters(this.wordToGuess, enteredWord);
            this.wordIsNotGuessed = true;
            localStorage.setItem('wordIsNotGuessed', this.wordIsNotGuessed);
            board.emptyBoxes = [].slice.call(board.emptyBoxes, 5);
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
            } else if (enteredWord < midWordFromWordsList) {
                high = mid - 1;
                mid = Math.floor((low + high) / 2);
                midWordFromWordsList = this.wordsSorted[mid].toUpperCase();
            } else {
                low = mid + 1;
                mid = Math.floor((low + high) / 2);
                midWordFromWordsList = this.wordsSorted[mid].toUpperCase();
            }
        }
        return inWordsList;
    }
    startNewGame() {
        board.currentBoardState = [];
        board.updateBoardStateInLocalStorage(board.currentBoardState);
        board.updateBoardStateOnUI();
        this.wordToGuess = game.selectWordForGuessing();
        closePlayAgainModal();
        hideReplayIcon();
        board.clearBoard();
        board.removeColorFromLetters();
        this.wordIsNotGuessed = true;
        localStorage.setItem('wordIsNotGuessed', this.wordIsNotGuessed);
    }
}

const keys = document.querySelectorAll('.key');

let numOfEnteredWords;
if (localStorage.getItem('boardState') === null) {
    numOfEnteredWords = 0;
} else {
    numOfEnteredWords = localStorage.getItem('boardState').split(',').length;
}

let currentBoardState = [];
if (localStorage.getItem('boardState') !== null) {
    currentBoardState = localStorage.getItem('boardState').split(',');
} else {
    currentBoardState = [];
}

let wordToGuess = '';
if (localStorage.getItem('wordForGuessingIsSelected') === null) {
    wordToGuess = game.selectWordForGuessing();
} else {
    wordToGuess = words[Number(localStorage.getItem('id'))].toUpperCase();
}

let board = new Board(currentBoardState);
let game = new Game(wordToGuess);

board.updateBoardStateOnUI();
if (localStorage.getItem('wordForGuessingIsSelected') === 'false' && 
    numOfEnteredWords > 0) {
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
        board.fillBoxesWithLetters(keyName);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && 
        board.counterOfEnteredLetters === 5 && 
        game.checkIfWordInWordsList(board.returnEnteredWord())) {
            board.currentBoardState.push(board.returnEnteredWord());
            board.updateBoardStateInLocalStorage(board.currentBoardState);
            game.checkIfGuessed(game.wordToGuess, board.returnEnteredWord());
    } else if (event.key === 'Enter' && 
        board.counterOfEnteredLetters === 5 && 
        !game.checkIfWordInWordsList(board.returnEnteredWord())) {
            showNotInWordsListMessage();
            hideMessage();
    } else if (event.key === 'Enter' && board.counterOfEnteredLetters < 5) {
        showNotEnoughLettersMessage();
        hideMessage();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
        board.removeLetter();
    }
});

keys.forEach((key) => {
    key.addEventListener('click', () => {
        if (key.innerHTML !== 'Enter' && 
            key.innerHTML !== 'Delete') {
                board.fillBoxesWithLetters(key.innerHTML);
                key.blur(); // removes keyboard focus onclick
        } else if (key.innerHTML === 'Enter' && 
        board.counterOfEnteredLetters === 5 && 
        game.checkIfWordInWordsList(board.returnEnteredWord())) {
            game.checkIfGuessed(game.wordToGuess, board.returnEnteredWord());
            key.blur();
        } else if (key.innerHTML === 'Enter' && 
        board.counterOfEnteredLetters === 5 && 
        !game.checkIfWordInWordsList(board.returnEnteredWord())) {
            showNotInWordsListMessage();
            hideMessage();
        } else if (key.innerHTML === 'Enter' && board.counterOfEnteredLetters < 5) {
            showNotEnoughLettersMessage();
            hideMessage();
        } else if (key.innerHTML === 'Delete') {
            board.removeLetter();
            key.blur();
        }
    });
});
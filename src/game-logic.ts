import { 
    words 
} from './words-array.js';
import { 
    playAgainButton, 
    showReplayIcon, 
    hideReplayIcon, 
    closeModal,
    showModal,
    gameOverContent,
    playAgainContent
} from './modals.js';
import { 
    showNotEnoughLettersMessage,
    showNotInWordsListMessage,
    hideMessage
} from './messages.js';

class Board {
    readonly maxWordLength: number;
    readonly maxWordsNum: number;
    readonly allBoxes: NodeListOf<HTMLElement>;
    emptyBoxes: Array<HTMLElement>;
    counterOfEnteredLetters: number;
    counterOfEnteredWords: number;
    currentBoardState: string[];
    boardStateInLocalStorage: string[];

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

    fillEmptyBoxesWithLetters(keyName: string): void {
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
    removeLetterFromBox(): void {
        for (let i = this.maxWordLength - 1; i >= 0; i--) {
            if (this.emptyBoxes[i].innerHTML !== '' && 
                game.wordIsNotGuessed) {
                this.emptyBoxes[i].innerHTML = '';
                this.counterOfEnteredLetters--;
                break;
            }
        }
    }
    getBoardStateFromLocalStorage(): string[] {
        let boardStateInLocalStorage = localStorage.getItem('boardState');
        if (boardStateInLocalStorage !== null) {
            return boardStateInLocalStorage.split(',');
        }
        return [];
    }
    updateBoardStateInLocalStorage(): void {
        if (this.currentBoardState.length === 0) {
            localStorage.removeItem('boardState');
        } else {
            localStorage.setItem('boardState', this.currentBoardState.toString());
        }
    }
    updateBoardStateBasedOnLocalStorage(boardStateInLocalStorage: string[]): void {
        if (boardStateInLocalStorage !== null) {
            board.currentBoardState = boardStateInLocalStorage;
        } 
    }
    updateBoardStateOnUI(enteredWords: string[]): void {
        for (let i = 0; i < enteredWords.length; i++) {
            for (let j = 0; j < enteredWords[i].length; j++) {
                this.fillEmptyBoxesWithLetters(enteredWords[i][j]);
            }
            game.checkIfGuessed(game.wordToGuess, board.returnEnteredWord());
        }
    }
    addColorToLetters(wordToGuess: string, enteredWord: string): void {
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
    removeColorFromLetters(): void {
        for (let i = 0; i < this.allBoxes.length; i++) {
            this.allBoxes[i].classList.remove('colored');
            this.allBoxes[i].classList.remove('orange');
            this.allBoxes[i].classList.remove('green');
            this.allBoxes[i].classList.remove('grey');
        }
    }
    returnEnteredWord(): string {
        let enteredWord = '';
        for (let i = 0; i < this.maxWordLength; i++) {
            enteredWord += this.emptyBoxes[i].innerHTML;
            enteredWord = enteredWord.slice(0, 5);
        }
        return enteredWord;
    }
    returnEnteredWords(): string[] {
        if (board.boardStateInLocalStorage !== null) {
            return board.boardStateInLocalStorage;
        } else {
            return [];
        }
    }
    updateCounterOfEnteredWords(): number {
        if (this.boardStateInLocalStorage === null) {
            this.counterOfEnteredWords = 0;
        } else {
            this.counterOfEnteredWords = this.boardStateInLocalStorage.length;
        }
        return this.counterOfEnteredWords;
    }
    clearBoard(): void {
        for (let i = 0; i < this.allBoxes.length; i++) {
            this.allBoxes[i].innerHTML = '';
        }
        this.counterOfEnteredLetters = 0;
        this.emptyBoxes = Array.from(this.allBoxes);
    }
}

class Game {
    wordIsNotGuessed: boolean;
    wordsSorted: string[];
    wordToGuess: string;

    constructor() {
        this.wordIsNotGuessed = true;
        this.wordsSorted = words.sort();
        this.wordToGuess = '';
    }

    selectWordForGuessing(): string {
        let indexOfWordToGuess = Math.floor(Math.random() * (words.length - 1));
        this.wordToGuess = words[indexOfWordToGuess].toUpperCase();
        localStorage.setItem('wordForGuessingIsSelected', 'true');
        localStorage.setItem('id', indexOfWordToGuess.toString());
        return this.wordToGuess;
    }
    updateWordToGuess(): void {
        if (localStorage.getItem('wordForGuessingIsSelected') === null) {
            this.wordToGuess = this.selectWordForGuessing();
        } else {
            this.wordToGuess = words[Number(localStorage.getItem('id'))].toUpperCase();
        }
    }
    checkIfGuessed(wordToGuess: string, enteredWord: string): void {
        if (wordToGuess === enteredWord) {
            board.addColorToLetters(wordToGuess, enteredWord);
            this.wordIsNotGuessed = false;
            localStorage.setItem('wordIsNotGuessed', 'false');
            localStorage.setItem('wordForGuessingIsSelected', 'false');
            showModal(playAgainContent, playAgainButton);
            showReplayIcon();
        } else {
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
    checkIfWordInWordsList(enteredWord: string): boolean {
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
    isWordComplete(): boolean {
        return board.counterOfEnteredLetters === 5;
    }
    checkIfAttemptsEnded(): boolean {
        if (board.counterOfEnteredWords === board.maxWordsNum) {
            return true;
        }
        return false;
    }
    startNewGame(): void {
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
    keys: NodeListOf<HTMLElement>;

    constructor() {
        this.keys = document.querySelectorAll('.key')
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (this.isEnterPressed(event) && game.isWordComplete()) {
            this.handleEnterPressedWhenWordComplete();
        } else if (this.isEnterPressed(event) && !game.isWordComplete()) {
            showNotEnoughLettersMessage();
            hideMessage();
        } else if (this.isDeletePressed(event) || this.isBackspace(event)) {
            board.removeLetterFromBox();
        }
    }
    isEnterPressed(event: KeyboardEvent): boolean {
        return event.key === 'Enter';
    }
    isDeletePressed(event: KeyboardEvent): boolean {
        return event.key === 'Delete';
    }
    isBackspace(event: KeyboardEvent): boolean {
        return event.key === 'Backspace';
    }
    handleEnterPressedWhenWordComplete(key?: HTMLElement): void {
        if (game.checkIfWordInWordsList(board.returnEnteredWord())) {
            board.currentBoardState.push(board.returnEnteredWord());
            board.updateBoardStateInLocalStorage();
            game.checkIfGuessed(game.wordToGuess, board.returnEnteredWord());
        } else {
            showNotInWordsListMessage();
            hideMessage();
        }
        if (key) {
            key.blur();
        }
    }
    handleKeyClick(event: Event): void {
        const key = event.target as HTMLElement;
        let keyContent = '';
        if (key !== null) {
            keyContent = key.innerHTML;
        }
        if (keyContent !== 'Enter' && keyContent !== 'Delete') {
            this.handleLetterKey(key, keyContent);
        } else if (keyContent === 'Enter' && game.isWordComplete()) {
            this.handleEnterPressedWhenWordComplete(key);
        } else if (keyContent === 'Enter' && !game.isWordComplete()) {
            showNotEnoughLettersMessage();
            hideMessage();
        } else if (keyContent === 'Delete') {
            board.removeLetterFromBox();
            key.blur();
        }
    }
    handleLetterKey(key: HTMLElement, keyContent: string): void {
        board.fillEmptyBoxesWithLetters(keyContent);
        key.blur();
    }
}

let board = new Board();
let game = new Game();
let keyboard = new Keyboard();

board.updateBoardStateBasedOnLocalStorage(board.getBoardStateFromLocalStorage());
game.updateWordToGuess();
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
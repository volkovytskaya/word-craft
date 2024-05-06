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

const maxWordLength = 5;
const keys = document.querySelectorAll('.key');
const allBoxes = document.querySelectorAll('.box');
let emptyBoxes = document.querySelectorAll('.box');
let wordIsNotGuessed = true;
let currentBoardState = [];
let counterOfEnteredLetters = 0;
let wordToGuess;
let wordsSorted = words.sort();

const selectWordForGuessing = (words) => {
    let index = Math.floor(Math.random() * (words.length - 1));
    wordToGuess = words[index].toUpperCase();
    localStorage.setItem('wordForGuessingIsSelected', true);
    localStorage.setItem('id', index);
    return wordToGuess;
}

if (localStorage.getItem('wordForGuessingIsSelected') === null) {
    wordToGuess = selectWordForGuessing(words);
} else {
    wordToGuess = words[Number(localStorage.getItem('id'))].toUpperCase();
}

const fillBoxesWithLetters = (keyName) => {
    const regExp = /^[A-za-z]$/;
    for (let i = 0; i < maxWordLength; i++) {
        if (emptyBoxes[i].innerHTML === '' && 
            regExp.test(keyName) && 
            wordIsNotGuessed) {
                emptyBoxes[i].innerHTML = keyName.toUpperCase();
                counterOfEnteredLetters++;
                break;
        }
    }
};

const removeLetter = () => {
    for (let i = maxWordLength; i >= 0; i--) {
        if (emptyBoxes[i].innerHTML !== '' && 
            wordIsNotGuessed) {
            emptyBoxes[i].innerHTML = '';
            counterOfEnteredLetters--;
            break;
        }
    }
};

const checkIfGuessed = (wordToGuess, enteredWord) => {
    if (wordToGuess === enteredWord) {
        addColorToLetters(wordToGuess, enteredWord);
        wordIsNotGuessed = false;
        localStorage.setItem('wordIsNotGuessed', wordIsNotGuessed);
        currentBoardState.push(enteredWord);
        localStorage.setItem('wordForGuessingIsSelected', false);
        openPlayAgainModal();
        showReplayIcon();
    } else {
        addColorToLetters(wordToGuess, enteredWord);
        wordIsNotGuessed = true;
        localStorage.setItem('wordIsNotGuessed', wordIsNotGuessed);
        currentBoardState.push(enteredWord);
        emptyBoxes = [].slice.call(emptyBoxes, 5);
    }
    updateBoardStateInLocalStorage(currentBoardState);
    counterOfEnteredLetters = 0;
};

const checkIfWordInWordsList = (enteredWord) => {
    let low = 0;
    let high = words.length - 1;
    let mid = Math.floor((low + high) / 2);
    let inWordsList = false;
    let midWordFromWordsList = wordsSorted[mid].toUpperCase();
    while (low <= high) {
        if (enteredWord === midWordFromWordsList) {
            inWordsList = true;
            break;
        } else if (enteredWord < midWordFromWordsList) {
            high = mid - 1;
            mid = Math.floor((low + high) / 2);
            midWordFromWordsList = words[mid].toUpperCase();
        } else {
            low = mid + 1;
            mid = Math.floor((low + high) / 2);
            midWordFromWordsList = words[mid].toUpperCase();
        }
    }
    return inWordsList;
}

const startNewGame = () => {
    currentBoardState = [];
    updateBoardStateInLocalStorage(currentBoardState);
    updateBoardStateOnUI();
    wordToGuess = selectWordForGuessing(words);
    closePlayAgainModal();
    hideReplayIcon();
    clearBoard();
    removeColorFromLetters();
    wordIsNotGuessed = true;
    localStorage.setItem('wordIsNotGuessed', true);
};

if (playAgainButton) {
    playAgainButton.addEventListener('click', startNewGame);
}

const addColorToLetters = (wordToGuess, enteredWord) => {
    for (let i = 0; i < maxWordLength; i++) {
        for (let j = 0; j < maxWordLength; j++) {
            if (enteredWord[i] === wordToGuess[j]) {
                emptyBoxes[i].classList.add('orange');
                emptyBoxes[i].classList.add('colored');
            }
        }
    }
    for (let i = 0; i < maxWordLength; i++) {
        if (enteredWord[i] === wordToGuess[i]) {
            emptyBoxes[i].classList.add('green');
            emptyBoxes[i].classList.add('colored');
        }
    }
    for (let i = 0; i < maxWordLength; i++) {
        if (!emptyBoxes[i].classList.contains('colored')) {
            emptyBoxes[i].classList.add('grey');
        }
    }
};

const removeColorFromLetters  = () => {
    for (let i = 0; i < allBoxes.length; i++) {
        allBoxes[i].classList.remove('colored');
        allBoxes[i].classList.remove('orange');
        allBoxes[i].classList.remove('green');
        allBoxes[i].classList.remove('grey');
    }
}

const returnEnteredWord = () => {
    let enteredWord = '';
    for (let i = 0; i < maxWordLength; i++) {
        enteredWord += emptyBoxes[i].innerHTML;
        enteredWord = enteredWord.slice(0, 5);
    }
    return enteredWord;
};

const updateBoardStateInLocalStorage = (currentBoardState) => {
    if (currentBoardState.length === 0) {
        localStorage.removeItem('boardState');
    } else {
        localStorage.setItem('boardState', currentBoardState);
        let enteredWords = localStorage.getItem('boardState').split(',');
        if (enteredWords[0] === '') enteredWords = [];
    }
};

const updateBoardStateOnUI = () => {
    let enteredWords = [];
    if (localStorage.getItem('boardState') !== null) {
        enteredWords = localStorage.getItem('boardState').split(',');
    }
    for (let i = 0; i < enteredWords.length; i++) {
        for (let j = 0; j < enteredWords[i].length; j++) {
            fillBoxesWithLetters(enteredWords[i][j]);
        }
        checkIfGuessed(wordToGuess, returnEnteredWord());
    }
};

const clearBoard = () => {
    for (let i = 0; i < allBoxes.length; i++) {
        allBoxes[i].innerHTML = '';
    }
    counterOfEnteredLetters = 0;
    emptyBoxes = document.querySelectorAll('.box');
};

let numOfEnteredWords;
if (localStorage.getItem('boardState') === null) {
    numOfEnteredWords = 0;
} else {
    numOfEnteredWords = localStorage.getItem('boardState').split(',').length;
    updateBoardStateOnUI();
}
if (localStorage.getItem('wordForGuessingIsSelected') === 'false' && 
    numOfEnteredWords > 0) {
    updateBoardStateOnUI();
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;  
    if (!event.metaKey) { // checks if command is pressed (command + R for page reloading)
        fillBoxesWithLetters(keyName);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && 
        counterOfEnteredLetters === 5 && 
        checkIfWordInWordsList(returnEnteredWord())) {
            checkIfGuessed(wordToGuess, returnEnteredWord());
    } else if (event.key === 'Enter' && 
        counterOfEnteredLetters === 5 && 
        !checkIfWordInWordsList(returnEnteredWord())) {
            showNotInWordsListMessage();
            hideMessage();
    } else if (event.key === 'Enter' && counterOfEnteredLetters < 5) {
        showNotEnoughLettersMessage();
        hideMessage();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
        removeLetter();
    }
});

keys.forEach((key) => {
    key.addEventListener('click', () => {
        if (key.innerHTML !== 'Enter' && 
            key.innerHTML !== 'Delete') {
                fillBoxesWithLetters(key.innerHTML);
                key.blur(); // removes keyboard focus onclick
        } else if (key.innerHTML === 'Enter' && 
        counterOfEnteredLetters === 5 && 
        checkIfWordInWordsList(returnEnteredWord())) {
            checkIfGuessed(wordToGuess, returnEnteredWord());
            key.blur();
        } else if (key.innerHTML === 'Enter' && 
        counterOfEnteredLetters === 5 && 
        !checkIfWordInWordsList(returnEnteredWord())) {
            showNotInWordsListMessage();
            hideMessage();
        } else if (key.innerHTML === 'Enter' && counterOfEnteredLetters < 5) {
            showNotEnoughLettersMessage();
            hideMessage();
        } else if (key.innerHTML === 'Delete') {
            removeLetter();
            key.blur();
        }
    });
});

console.log(wordToGuess);
const message = document.querySelector('.message');
const showNotEnoughLettersMessage = () => {
    message.innerHTML = 'Not enough letters';
    message.classList.remove('hidden');
};
const hideMessage = () => {
    setTimeout(() => {
        message.classList.add('hidden');
    }, 1500);
};
const showNotInWordsListMessage = () => {
    message.innerHTML = 'Not in words list';
    message.classList.remove('hidden');
};
const showInvalidCharacterEnteredMessage = () => {
    message.innerHTML = 'Invalid character entered.<br> Please make sure to enter english letters';
    message.classList.remove('hidden');
};
export { showNotEnoughLettersMessage, showNotInWordsListMessage, showInvalidCharacterEnteredMessage, hideMessage };

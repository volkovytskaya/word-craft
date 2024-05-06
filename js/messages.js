const message = document.querySelector('.message');

export const showNotEnoughLettersMessage = () => {
    message.innerHTML = 'Not enough letters';
    message.classList.remove('hidden');
};

export const hideMessage = () => {
    setTimeout(() => {
        message.classList.add('hidden');
    }, 1500);
};

export const showNotInWordsListMessage = () => {
    message.innerHTML = 'Not in words list';
    message.classList.remove('hidden');
};


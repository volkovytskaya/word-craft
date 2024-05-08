const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalOpenBtn = document.querySelector('.modal-open-button');
const modalCloseBtn = document.querySelector('.modal-close-button');
const questionMark = document.querySelector('.question-mark');
const playAgainContent = document.querySelector('.play-again');
const howToPlayContent = document.querySelector('.how-to-play');
const gameOverContent = document.querySelector('.game-over');
const replayIcon = document.querySelector('.replay-icon');
const playAgainButton = document.querySelector('.play-again-button');

const openModal = (typeOfModal) => {
    switch(typeOfModal) {
        case 'how-to-play':
            openHowToPlayModal();
            break;
        case 'play-again':
            openPlayAgainModal();
            break;
        case 'game-over':
            openGameOverModal();
            break;
    }
}

const openHowToPlayModal = () => {
    howToPlayContent.classList.remove('hidden');
    playAgainContent.classList.add('hidden');
    gameOverContent.classList.add('hidden');
    playAgainButton.classList.add('hidden');
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const openPlayAgainModal = () => {
    playAgainContent.classList.remove('hidden');
    playAgainButton.classList.remove('hidden');
    howToPlayContent.classList.add('hidden');
    gameOverContent.classList.add('hidden');
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const openGameOverModal = () => {
    gameOverContent.classList.remove('hidden');
    playAgainButton.classList.remove('hidden');
    howToPlayContent.classList.add('hidden');
    playAgainContent.classList.add('hidden');
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

const showReplayIcon = () => {
    replayIcon.classList.remove('hidden');
};

const hideReplayIcon = () => {
    replayIcon.classList.add('hidden');
};

if (modalOpenBtn) modalOpenBtn.addEventListener('click', () => {
    openModal('how-to-play');
});
if (questionMark) questionMark.addEventListener('click', () => {
    openModal('how-to-play');
});
if (replayIcon) replayIcon.addEventListener('click', () => {
    if (localStorage.getItem('wordIsNotGuessed') === 'true') {
        openModal('game-over');
    } else {
        openModal('play-again');
    }
});
modalCloseBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && 
        !modal.classList.contains('hidden')) {
        closeModal();
    }
});

export { 
    playAgainButton, 
    showReplayIcon, 
    hideReplayIcon, 
    modal, 
    closeModal,
    openModal
};

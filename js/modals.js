const howToPlayModal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalOpenBtn = document.querySelector('.modal-open-button');
const modalCloseBtn = document.querySelector('.modal-close-button');
const questionMark = document.querySelector('.question-mark');
const playAgainContent = document.querySelector('.play-again');
const howToPlayContent = document.querySelector('.how-to-play');
const replayIcon = document.querySelector('.replay-icon');
const playAgainButton = document.querySelector('.play-again-button');

const openHowToPlayModal = () => {
    if (playAgainContent) playAgainContent.classList.add('hidden');
    howToPlayContent.classList.remove('hidden');
    howToPlayModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeHowToPlayModal = () => {
    howToPlayModal.classList.add('hidden');
    overlay.classList.add('hidden');
};

const openPlayAgainModal = () => {
    howToPlayContent.classList.add('hidden');
    playAgainContent.classList.remove('hidden');
    howToPlayModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const showReplayIcon = () => {
    replayIcon.classList.remove('hidden');
}

const hideReplayIcon = () => {
    replayIcon.classList.add('hidden');
}

const closePlayAgainModal = () => {
    howToPlayModal.classList.add('hidden');
    overlay.classList.add('hidden');
}

if (modalOpenBtn) modalOpenBtn.addEventListener('click', openHowToPlayModal);
if (questionMark) questionMark.addEventListener('click', openHowToPlayModal);
if (replayIcon) replayIcon.addEventListener('click', openPlayAgainModal);
modalCloseBtn.addEventListener('click', closeHowToPlayModal);
overlay.addEventListener('click', closeHowToPlayModal);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && 
        !howToPlayModal.classList.contains('hidden')) {
        closeHowToPlayModal();
    }
});

export { 
    playAgainButton, 
    showReplayIcon, 
    closePlayAgainModal, 
    hideReplayIcon, 
    howToPlayModal, 
    openPlayAgainModal, 
    openHowToPlayModal, 
    closeHowToPlayModal 
};

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
const showModal = (contentToShow, buttonToShow) => {
    const contentTypes = [playAgainContent, howToPlayContent, gameOverContent];
    contentTypes.forEach((content) => {
        if (content === contentToShow) {
            content.classList.remove('hidden');
        }
        else if (content !== null) {
            content.classList.add('hidden');
        }
    });
    if (buttonToShow !== undefined) {
        playAgainButton.classList.remove('hidden');
    }
    else if (playAgainButton) {
        playAgainButton.classList.add('hidden');
    }
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
if (modalOpenBtn)
    modalOpenBtn.addEventListener('click', () => {
        showModal(howToPlayContent);
    });
if (questionMark)
    questionMark.addEventListener('click', () => {
        showModal(howToPlayContent);
    });
if (replayIcon)
    replayIcon.addEventListener('click', () => {
        if (localStorage.getItem('wordIsNotGuessed') === 'true') {
            showModal(gameOverContent, playAgainButton);
        }
        else {
            showModal(playAgainContent, playAgainButton);
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
export { playAgainButton, showReplayIcon, hideReplayIcon, modal, closeModal, showModal, playAgainContent, gameOverContent };

const emojis = [
    '🍓',
    '🌈',
    '⭐',
    '🎈',
    '🐶',
    '🍕',
    '🦄',
    '🎮'
];

let cards = [];
let selectedCards = [];
let matchedPairs = 0;
let score = 0;
let moves = 0;
let timer = 60;
let gameInterval;

// DOM Elements
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');

const startBtn = document.getElementById('startbtn');
const restartBtn = document.getElementById('restartbtn');

const popup = document.getElementById('win-popup');
const finalScore = document.getElementById('final-score');
const finalMoves = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

// Load best score
let bestScore = localStorage.getItem('bestScore') || 0;
bestScoreElement.textContent = bestScore;

// Shuffle Function
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Generate Cards
function generateCards() {
    gameContainer.innerHTML = '';

    cards.forEach((emoji) => {
        const card = document.createElement('div');

        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.innerHTML = '?';

        gameContainer.appendChild(card);
    });
}

// Start Game
function startGame() {
    clearInterval(gameInterval);

    // Reset state
    selectedCards = [];
    matchedPairs = 0;
    score = 0;
    moves = 0;
    timer = 60;

    updateUI();

    popup.classList.add('hidden');

    // Duplicate emojis and shuffle
    cards = shuffle([...emojis, ...emojis]);

    generateCards();

    startTimer();
}

// Update UI
function updateUI() {
    scoreElement.textContent = score;
    movesElement.textContent = moves;
    timerElement.textContent = timer;

    progressBar.style.width = `${(timer / 60) * 100}%`;
}

// Timer
function startTimer() {
    gameInterval = setInterval(() => {
        timer--;

        updateUI();

        if (timer <= 0) {
            clearInterval(gameInterval);

            setTimeout(() => {
                alert('⏰ Time Up! Try Again!');
            }, 200);
        }
    }, 1000);
}

// Card Click
function handleCardClick(e) {
    const clickedCard = e.target;

    if (
        !clickedCard.classList.contains('card') ||
        clickedCard.classList.contains('matched') ||
        clickedCard.classList.contains('flipped') ||
        selectedCards.length === 2
    ) {
        return;
    }

    // Flip card
    clickedCard.classList.add('flipped');
    clickedCard.innerHTML = clickedCard.dataset.emoji;

    selectedCards.push(clickedCard);

    if (selectedCards.length === 2) {
        moves++;
        updateUI();

        setTimeout(checkMatch, 600);
    }
}

// Match Logic
function checkMatch() {
    const [card1, card2] = selectedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');

        matchedPairs++;
        score += 10;

        // Win check
        if (matchedPairs === emojis.length) {
            clearInterval(gameInterval);

            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
                bestScoreElement.textContent = bestScore;
            }

            showWinPopup();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');

        card1.innerHTML = '?';
        card2.innerHTML = '?';
    }

    selectedCards = [];
    updateUI();
}

// Win Popup
function showWinPopup() {
    finalScore.textContent = score;
    finalMoves.textContent = moves;

    popup.classList.remove('hidden');
}

// Restart Game
restartBtn.addEventListener('click', startGame);

// Start Button
startBtn.addEventListener('click', startGame);

// Play Again Button
playAgainBtn.addEventListener('click', startGame);

// Card Click Listener
gameContainer.addEventListener('click', handleCardClick);

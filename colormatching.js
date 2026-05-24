const emojis = [
    '🍓', '🌈', '⭐', '🎈',
    '🐶', '🍕', '🦄', '🎮'
];

let cards = [];
let selectedCards = [];
let matchedPairs = 0;
let score = 0;
let moves = 0;
let timer = 60;
let gameInterval = null;
let canClick = true;

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

// Load Best Score
let bestScore = localStorage.getItem('bestScore') || 0;
bestScoreElement.textContent = bestScore;

// Fisher-Yates Shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [
            array[j],
            array[i]
        ];
    }

    return array;
}

// Generate Cards
function generateCards() {
    gameContainer.innerHTML = '';

    cards.forEach((emoji) => {
        const card = document.createElement('div');

        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.textContent = '?';

        gameContainer.appendChild(card);
    });
}

// Update UI
function updateUI() {
    scoreElement.textContent = score;
    movesElement.textContent = moves;
    timerElement.textContent = timer;

    progressBar.style.width =
        `${(timer / 60) * 100}%`;
}

// Start Game
function startGame() {
    clearInterval(gameInterval);

    selectedCards = [];
    matchedPairs = 0;
    score = 0;
    moves = 0;
    timer = 60;
    canClick = true;

    popup.classList.add('hidden');

    startBtn.disabled = true;

    updateUI();

    cards = shuffle([
        ...emojis,
        ...emojis
    ]);

    generateCards();
    startTimer();
}

// Timer
function startTimer() {
    gameInterval = setInterval(() => {
        timer--;

        updateUI();

        if (timer <= 0) {
            clearInterval(gameInterval);

            canClick = false;
            startBtn.disabled = false;

            setTimeout(() => {
                alert(
                    `⏰ Time Up!\nFinal Score: ${score}`
                );
            }, 200);
        }
    }, 1000);
}

// Handle Card Click
function handleCardClick(e) {
    const card = e.target;

    if (
        !canClick ||
        !card.classList.contains('card') ||
        card.classList.contains('matched') ||
        card.classList.contains('flipped') ||
        selectedCards.length >= 2
    ) {
        return;
    }

    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;

    selectedCards.push(card);

    if (selectedCards.length === 2) {
        canClick = false;

        moves++;
        updateUI();

        setTimeout(checkMatch, 700);
    }
}

// Check Match
function checkMatch() {
    const [card1, card2] = selectedCards;

    if (
        card1.dataset.emoji ===
        card2.dataset.emoji
    ) {
        card1.classList.add('matched');
        card2.classList.add('matched');

        matchedPairs++;

        score += 10;
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');

        card1.textContent = '?';
        card2.textContent = '?';
    }

    selectedCards = [];
    canClick = true;

    updateUI();

    // Win condition
    if (matchedPairs === emojis.length) {
        clearInterval(gameInterval);

        startBtn.disabled = false;

        if (score > bestScore) {
            bestScore = score;

            localStorage.setItem(
                'bestScore',
                bestScore
            );

            bestScoreElement.textContent =
                bestScore;
        }

        showWinPopup();
    }
}

// Win Popup
function showWinPopup() {
    finalScore.textContent = score;
    finalMoves.textContent = moves;

    popup.classList.remove('hidden');
}

// Event Listeners
startBtn.addEventListener(
    'click',
    startGame
);

restartBtn.addEventListener(
    'click',
    startGame
);

playAgainBtn.addEventListener(
    'click',
    startGame
);

gameContainer.addEventListener(
    'click',
    handleCardClick
);

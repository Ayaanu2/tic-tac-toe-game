const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const symbolOptions = document.querySelectorAll('.symbol');
const turnIndicator = document.getElementById('turnIndicator');

let playerXName = document.getElementById('playerXName');
let playerOName = document.getElementById('playerOName');

let currentPlayer = 'X';
let playerXSymbol = '';
let playerOSymbol = '';
let playerXClass = '';
let playerOClass = '';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Symbol selection logic
symbolOptions.forEach(option => {
    option.addEventListener('click', function() {
        if (!playerXSymbol || !playerOSymbol) {
            if (!playerXSymbol) {
                playerXSymbol = this.getAttribute('data-symbol');
                playerXClass = this.getAttribute('data-symbol-class');
                this.classList.add('selected');
            } else if (!playerOSymbol) {
                playerOSymbol = this.getAttribute('data-symbol');
                playerOClass = this.getAttribute('data-symbol-class');
                this.classList.add('selected');
                startGame();
            }
        }
    });
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleReset);

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (boardState[cellIndex] !== '' || !gameActive) {
        return;
    }

    boardState[cellIndex] = currentPlayer;
    cell.innerText = currentPlayer === 'X' ? playerXSymbol : playerOSymbol;

    cell.classList.add(currentPlayer === 'X' ? playerXClass : playerOClass);
    cell.classList.add('pop');

    checkResult();
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            document.querySelector(`[data-index="${a}"]`).classList.add('winning-cell');
            document.querySelector(`[data-index="${b}"]`).classList.add('winning-cell');
            document.querySelector(`[data-index="${c}"]`).classList.add('winning-cell');
            break;
        }
    }

    if (roundWon) {
        const winner = currentPlayer === 'X' ? playerXName.value || 'X' : playerOName.value || 'O';
        message.innerText = `${winner} wins! 🎉`;
        turnIndicator.innerText = '';
        gameActive = false;
        return;
    }

    if (!boardState.includes('')) {
        message.innerText = "It's a tie!";
        turnIndicator.innerText = '';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
}

function handleReset() {
    currentPlayer = 'X';
    playerXSymbol = '';
    playerOSymbol = '';
    playerXClass = '';
    playerOClass = '';
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('symbol-x', 'symbol-o', 'symbol-flame', 'symbol-water', 'symbol-star', 'symbol-luck', 'pop', 'winning-cell');
    });
    symbolOptions.forEach(option => option.classList.remove('selected'));
    message.innerText = '';
    turnIndicator.innerText = 'Waiting for players to choose symbols...';
    gameActive = false;
}

function startGame() {
    gameActive = true;
    updateTurnIndicator();
}

function updateTurnIndicator() {
    const currentPlayerName = currentPlayer === 'X' ? playerXName.value || 'X' : playerOName.value || 'O';
    turnIndicator.innerText = `${currentPlayerName}'s turn (${currentPlayer === 'X' ? playerXSymbol : playerOSymbol})`;
}

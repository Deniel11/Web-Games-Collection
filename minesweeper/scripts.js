let rows = 8;
let cols = 8;
let bombsCount = 10;
const game = document.getElementById('game');
const levelSelect = document.getElementById('level');

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', init);

const mineCount = document.getElementById('mine-count');
const timerDiv = document.getElementById('timer');
let timer = 0;
let timerInterval = null;

let firstClick = true;

const difficulties = {
    easy:     { rows: 12, cols: 12, bombsCount: 20 },
    medium:   { rows: 16, cols: 16, bombsCount: 40 },
    hard:     { rows: 16, cols: 30, bombsCount: 99 },
    expert:   { rows: 20, cols: 35, bombsCount: 180 },
    insane:   { rows: 20, cols: 44, bombsCount: 300 }
};

levelSelect.addEventListener('change', init);

let board = [];
let gameOver = false;

function getNeighbors(row, col) {
    const neighbors = [];
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue;
            const nr = row + r;
            const nc = col + c;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                neighbors.push([nr, nc]);
            }
        }
    }
    return neighbors;
}

function init() {
    localStorage.removeItem('gameState');
    const level = levelSelect.value;
    localStorage.setItem('difficulty', level);
    ({ rows, cols, bombsCount } = difficulties[level]);
    updateDigitDisplay(mineCount, bombsCount);

    updateResetButton("img/ok.png");
    
    board = [];
    game.innerHTML = '';
    game.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
    gameOver = false;

    // Létrehozzuk a mezőket
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleClick);
            cell.addEventListener('contextmenu', handleRightClick);
            game.appendChild(cell);
            board[r][c] = { bomb: false, revealed: false, element: cell, number: 0 };
        }
    }

    firstClick = true;
    resetTimer();
}

function generateBombsAndNumbers(safeRow, safeCol) {
    const safeZone = new Set();

    safeZone.add(`${safeRow},${safeCol}`);
    for (const [nr, nc] of getNeighbors(safeRow, safeCol)) {
        safeZone.add(`${nr},${nc}`);
    }

    let placed = 0;
    while (placed < bombsCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].bomb && !safeZone.has(`${r},${c}`)) {
            board[r][c].bomb = true;
            placed++;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!board[r][c].bomb) {
                let count = 0;
                for (const [nr, nc] of getNeighbors(r, c)) {
                    if (board[nr][nc].bomb) count++;
                }
                board[r][c].number = count;
            }
        }
    }

    saveGameState();
}

// Mezők felfedése
async function reveal(row, col) {
    const cell = board[row][col];

    if (cell.element.innerHTML === '<img src="img/flag.png" alt="Flag" style="width:auto;">') {
        return;
    }

    if (cell.revealed || gameOver) return;
    cell.revealed = true;
    cell.element.classList.add('revealed');
    if (cell.bomb) {
        cell.element.innerHTML = '<img src="img/mine.png" alt="Mine" style="width:auto;">';
        cell.element.classList.add('bomb');
        gameOver = true;
        updateResetButton("img/dead.png");
        stopTimer();
        revealAll();
        localStorage.removeItem('gameState');
        return;
    }

    if (cell.number > 0) {
        cell.element.textContent = cell.number;
        cell.element.innerHTML = '<img src="img/num_of_neighbors/open' + cell.number + '.png" alt="Number" style="width:auto;">';
        updateResetButton("img/wow.png");
        await wait(400);
        updateResetButton("img/ok.png");
    } else {
        for (const [nr, nc] of getNeighbors(row, col)) {
            reveal(nr, nc);
        }
    }

    checkWin();
}

function revealAll() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = board[r][c];
            if (!cell.revealed) {
                reveal(r, c);
            }
        }
    }
}

function handleClick(e) {
    let targetDiv;
    if (e.target.tagName === 'IMG') {
        targetDiv = e.target.parentElement;
    } else {
        targetDiv = e.target;
    }

    const row = parseInt(targetDiv.dataset.row);
    const col = parseInt(targetDiv.dataset.col);

    if(firstClick) {
        firstClick = false;
        startTimer();
        generateBombsAndNumbers(row, col);
    }
    reveal(row, col);
}

function checkWin() {
    let revealedCount = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].revealed) revealedCount++;
        }
    }

    if (revealedCount === rows * cols - bombsCount) {
        gameOver = true;
        stopTimer();
        revealAll();
    } else {
        saveGameState();
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateDigitDisplay(timerDiv, timer);
    }, 1000);
}

function resetTimer() {
    stopTimer();
    timer = 0;
    updateDigitDisplay(timerDiv, timer);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateDigitDisplay(targetElement, numberVariable) {
    const digits = String(numberVariable).padStart(3, '0').split('');

    const imgs = targetElement.querySelectorAll('img');
    
    digits.forEach((digit, i) => {
        const img = imgs[i];
        const newSrc = `img/digits/digit${digit}.png`;
        if (img.src !== newSrc) {
            img.src = newSrc;
        }
    });
}

function updateResetButton(newSrc) {
    if (resetButton.src !== newSrc) {
        resetButton.src = newSrc;
    }
}

function handleRightClick(e) {
    e.preventDefault();

    let targetDiv;
    if (e.target.tagName === 'IMG') {
        targetDiv = e.target.parentElement;
    } else {
        targetDiv = e.target;
    }

    const row = parseInt(targetDiv.dataset.row);
    const col = parseInt(targetDiv.dataset.col);

    toggleFlag(row, col);
}

function toggleFlag(row, col) {
    const cell = board[row][col];
    if (cell.revealed || gameOver) return;

    if (cell.element.innerHTML === '<img src="img/flag.png" alt="Flag" style="width:auto;">') {
        cell.element.innerHTML = '';
        bombsCount++;
        updateDigitDisplay(mineCount, bombsCount);
    } else {
        if(bombsCount == 0) {
            return;
        }
        
        cell.element.innerHTML = '<img src="img/flag.png" alt="Flag" style="width:auto;">';
        bombsCount--;
        updateDigitDisplay(mineCount, bombsCount);
    }

    saveGameState();
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function saveGameState() {
    const state = {
        difficulty: levelSelect.value,
        board: board.map(row => row.map(cell => ({
            bomb: cell.bomb,
            number: cell.number,
            revealed: cell.revealed,
            flagged: cell.element.innerHTML.includes('flag.png')
        }))),
        timer,
        mineCount: bombsCount,
        firstClick
    };
    localStorage.setItem('gameState', JSON.stringify(state));
}

function loadGameState() {
    const saved = localStorage.getItem('gameState');
    if (!saved) return;

    const state = JSON.parse(saved);
    levelSelect.value = state.difficulty;
    ({ rows, cols, bombsCount } = difficulties[state.difficulty]);

    board = [];
    game.innerHTML = '';
    game.style.gridTemplateColumns = `repeat(${cols}, 20px)`;

    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
            const cellData = state.board[r][c];
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            if (cellData.revealed) {
                cell.classList.add('revealed');
                if (cellData.bomb) {
                    cell.innerHTML = '<img src="img/mine.png" alt="Mine" style="width:auto;">';
                    cell.classList.add('bomb');
                } else if (cellData.number > 0) {
                    cell.innerHTML = `<img src="img/num_of_neighbors/open${cellData.number}.png" alt="Number" style="width:auto;">`;
                }
            } else if (cellData.flagged) {
                cell.innerHTML = '<img src="img/flag.png" alt="Flag" style="width:auto;">';
            }

            cell.addEventListener('click', handleClick);
            cell.addEventListener('contextmenu', handleRightClick);
            game.appendChild(cell);

            board[r][c] = {
                bomb: cellData.bomb,
                number: cellData.number,
                revealed: cellData.revealed,
                element: cell
            };
        }
    }

    timer = state.timer;
    updateDigitDisplay(timerDiv, timer);
    updateDigitDisplay(mineCount, state.mineCount);
    firstClick = state.firstClick;
    if (!firstClick) startTimer();
}

window.addEventListener('DOMContentLoaded', () => {
    const savedDifficulty = localStorage.getItem('difficulty');
    if (savedDifficulty && difficulties[savedDifficulty]) {
        levelSelect.value = savedDifficulty;
    }
    
    const savedGame = localStorage.getItem('gameState');
    if (savedGame) {
        loadGameState();
    } else {
        init();
    }
});
let grid = document.getElementById('sudoku-grid');
let size = 9;
let solution = [];
let puzzle = [];
let selectedCell = null;

const difficulties = [
    { value: 1, label: 'Very Easy' },
    { value: 2, label: 'Easy' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'Hard', default: true },
    { value: 5, label: 'Very Hard' }
];

document.addEventListener('DOMContentLoaded', () => {

    if(localStorage.getItem('sudoku-game')) {
        document.getElementById('continue-btn').style.display = 'block';
    }

    fillDificultySelector(document.getElementById('start-difficulty'));
    fillDificultySelector(document.getElementById('modal-difficulty'));

    document.getElementById('start-btn').addEventListener('click', () => {
        localStorage.removeItem('sudoku-game');

        document.getElementById('start-screen').style.display = 'none';

        document.getElementById('game-screen').style.display = 'block';

        createSudokuInterface();
        grid = document.getElementById('sudoku-grid');

        const difficulty = getDificultyFromSelector(document.getElementById('start-difficulty'));
        startNewGame(difficulty);

        saveGameState();

        getDificultyFromSelector(document.getElementById('start-difficulty'));
    });

    document.getElementById('continue-btn').addEventListener('click', () => {
        const saved = localStorage.getItem('sudoku-game');
        if (saved) {
            document.getElementById('start-screen').style.display = 'none';

            document.getElementById('game-screen').style.display = 'block';

            createSudokuInterface();
            grid = document.getElementById('sudoku-grid');

            const gameState = JSON.parse(saved);
            currentGrid = gameState.currentGrid;
            puzzle = gameState.puzzle;
            solution = gameState.solution;
            createGrid(puzzle);
            fillPlayerGridAnswers(currentGrid);
        }    
    });

    document.getElementById('restart-btn').addEventListener('click', () => {

        localStorage.removeItem('sudoku-game');

        const newHoles = parseInt(document.getElementById('modal-difficulty').value, 10);
        startNewGame(newHoles);

        document.getElementById('win-modal').style.display = 'none';

        document.getElementById('confetti-container').innerHTML = '';
    });

    document.querySelectorAll('.grid-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.grid-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            size = parseInt(btn.textContent);
        });
    });

    const winModal = document.getElementById('win-modal');

    winModal.addEventListener('click', (event) => {
        if (event.target === winModal) {
            winModal.style.display = 'none';
        }
    });
});

function getDificultyFromSelector(difficultySelect) {
    const selected = difficultySelect.value;
    if (size === 16) {
        const values = [150, 170, 190, 210, 230];
        return values[selected - 1];
    } else if (size === 9) {
        const values = [30, 40, 50, 55, 60];
        return values[selected - 1];
    } else if (size === 4) {
        const values = [4, 6, 9, 12, 14];
        return values[selected - 1];
    }
}

function fillDificultySelector(difficultySelect) {
    difficulties.forEach(difficulty => {
    const option = document.createElement('option');
    option.value = difficulty.value;
    option.textContent = difficulty.label;
    
    if (difficulty.default) {
        option.selected = true;
    }

    difficultySelect.appendChild(option);
});
}

function createEmptyGrid() {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

function isValid(grid, row, col, num) {
    for (let i = 0; i < size; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
    }

    const blockSize = Math.sqrt(size);
    const startRow = row - (row % blockSize);
    const startCol = col - (col % blockSize);

    for (let i = 0; i < blockSize; i++) {
        for (let j = 0; j < blockSize; j++) {
            if (grid[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function solveSudoku(grid) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (grid[row][col] === 0) {
                const numbers = Array.from({ length: size }, (_, i) => i + 1);
                const nums = shuffle(numbers);
                for (let num of nums) {                    
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solveSudoku(grid)) return true;
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function generatePuzzle(solution, holes = 40) {
    const puzzle = JSON.parse(JSON.stringify(solution));
    let attempts = holes;
    while (attempts > 0) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            attempts--;
        }
    }
    return puzzle;
}

function createGrid(puzzle) {
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    grid.setAttribute('data-size', size);

    puzzle.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('sudoku-cell');
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;

            if (num !== 0) {
                cell.textContent = num;
                cell.classList.add('fixed');
            } else {
                cell.classList.add('editable');
                cell.addEventListener('click', () => {
                    if (selectedCell) selectedCell.classList.remove('selected');
                    selectedCell = cell;
                    cell.classList.add('selected');
                    document.getElementById('number-pad').hidden = false;
                });
            }

            const blockSize = Math.sqrt(size);
            if ((colIndex + 1) % blockSize === 0 && colIndex !== size - 1) {
                cell.classList.add('thick-right');
            }
            if ((rowIndex + 1) % blockSize === 0 && rowIndex !== size - 1) {
                cell.classList.add('thick-bottom');
            }

            grid.appendChild(cell);
        });
    });
}

function getCellAt(row, col) {
    return document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"]`);
}

function fillPlayerGridAnswers(playerGrid) {
    playerGrid.forEach((row, rowIndex) => {
        row.forEach((num, colIndex) => {
            const cell = getCellAt(rowIndex, colIndex);
            if (!cell.classList.contains('fixed') && num !== 0) {
                cell.textContent = num;
            }
        });
    });
}

function checkSolution() {
    const cells = document.querySelectorAll('.sudoku-cell');
    let isCorrect = true;
    const markedCells = [];

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const val = parseInt(cell.textContent);

        if (!cell.classList.contains('fixed')) {
            const correct = solution[row][col];
            if (val !== correct) {
                cell.style.backgroundColor = 'salmon';
                isCorrect = false;
                markedCells.push(cell);
            } else {
                cell.style.backgroundColor = 'lightgreen';
                markedCells.push(cell);
            }
        }
    });

    if(!isCorrect) {
        setTimeout(() => {
            markedCells.forEach(cell => {
                cell.style.backgroundColor = '';
            });
        }, 5000);
    }

    return isCorrect;
}

function startNewGame(difficulty) {
    const holes = difficulty;
    const emptyGrid = createEmptyGrid();
    solveSudoku(emptyGrid);
    solution = JSON.parse(JSON.stringify(emptyGrid));
    puzzle = generatePuzzle(solution, holes);
    createGrid(puzzle);
}

function createSudokuInterface() {
    const container = document.getElementById('game-screen');
    container.innerHTML = '';

    const newGrid = document.createElement('div');
    newGrid.id = 'sudoku-grid';
    container.appendChild(newGrid);

    const numberPad = document.createElement('div');
    numberPad.id = 'number-pad';
    numberPad.hidden = true;

    for (let i = 1; i <= size; i++) {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = i.toString();
        numberPad.appendChild(btn);
    }

    const clearBtn = document.createElement('button');
    clearBtn.className = 'number-btn';
    clearBtn.textContent = '✖';
    clearBtn.setAttribute('data-clear', '');
    numberPad.appendChild(clearBtn);

    container.appendChild(numberPad);

    const solveBtn = document.createElement('button');
    solveBtn.id = 'solve-btn';
    solveBtn.textContent = 'Solution';
    container.appendChild(solveBtn);

    const backBtn = document.createElement('button');
    backBtn.id = 'back-btn';
    backBtn.textContent = 'Back';
    container.appendChild(backBtn);

    solveBtn.addEventListener('click', () => {
        if (checkSolution()) {
            showConfetti();
            showWinModal();
            solveBtn.disabled = true;
        }
    });

    backBtn.addEventListener('click', () => {
        container.innerHTML = '';
        document.getElementById('start-screen').style.display = 'block';

        if(localStorage.getItem('sudoku-game')) {
            document.getElementById('continue-btn').style.display = 'block';
        }

        document.getElementById('game-screen').style.display = 'none';

        const confettiContainer = document.getElementById('confetti-container');
        if(confettiContainer.innerHTML !== '') {
            confettiContainer.innerHTML = '';
        }
    });

    document.querySelectorAll('.sudoku-cell.editable').forEach(cell => {
        cell.addEventListener('click', () => {
            if (selectedCell) selectedCell.classList.remove('selected');

            selectedCell = cell;
            cell.classList.add('selected');
            document.getElementById('number-pad').hidden = false;
        });
    });

    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!selectedCell) return;

            if (btn.hasAttribute('data-clear')) {
                selectedCell.textContent = '';
            } else {
                selectedCell.textContent = btn.textContent;
            }

            selectedCell.classList.remove('selected');
            selectedCell = null;
            document.getElementById('number-pad').hidden = true;
            saveGameState();
        });
    });
}

function showWinModal() {
    document.getElementById('win-modal').style.display = 'block';
}

function showConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';

    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        confetti.style.width = (6 + Math.random() * 6) + 'px';
        confetti.style.height = confetti.style.width;
        container.appendChild(confetti);
    }
}

function saveGameState() {
    const current = Array.from({ length: size }, () => Array(size).fill(0));

    document.querySelectorAll('.sudoku-cell').forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const val = parseInt(cell.textContent);
        if (!cell.classList.contains('fixed') && !isNaN(val)) {
            current[row][col] = val;
        }
    });
    
    const gameState = {
        currentGrid: current,
        solution,
        puzzle,
    };

    localStorage.setItem('sudoku-game', JSON.stringify(gameState));
}
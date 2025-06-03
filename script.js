// script.js
const boardElement = document.getElementById('board');
const message = document.getElementById('message');
const timerDisplay = document.getElementById('timer');
const stats = document.getElementById('stats');
let board = [];
let timer = 0, interval;
let puzzlesSolved = localStorage.getItem("puzzlesSolved") || 0;
let bestTime = localStorage.getItem("bestTime") || "--";

const examplePuzzle = [
  5,3,0,0,7,0,0,0,0,
  6,0,0,1,9,5,0,0,0,
  0,9,8,0,0,0,0,6,0,
  8,0,0,0,6,0,0,0,3,
  4,0,0,8,0,3,0,0,1,
  7,0,0,0,2,0,0,0,6,
  0,6,0,0,0,0,2,8,0,
  0,0,0,4,1,9,0,0,5,
  0,0,0,0,8,0,0,7,9
];

const exampleSolution = [
  5,3,4,6,7,8,9,1,2,
  6,7,2,1,9,5,3,4,8,
  1,9,8,3,4,2,5,6,7,
  8,5,9,7,6,1,4,2,3,
  4,2,6,8,5,3,7,9,1,
  7,1,3,9,2,4,8,5,6,
  9,6,1,5,3,7,2,8,4,
  2,8,7,4,1,9,6,3,5,
  3,4,5,2,8,6,1,7,9
];

function createBoard() {
  boardElement.innerHTML = "";
  for (let i = 0; i < 81; i++) {
    const cell = document.createElement('input');
    cell.type = 'text';
    cell.maxLength = 1;
    cell.className = 'cell';
    boardElement.appendChild(cell);
  }
}

function fillPuzzle(puzzle) {
  const cells = boardElement.querySelectorAll('input');
  cells.forEach((cell, i) => {
    cell.classList.remove("invalid");
    if (puzzle[i] !== 0) {
      cell.value = puzzle[i];
      cell.classList.add('prefilled');
      cell.disabled = true;
    } else {
      cell.value = '';
      cell.classList.remove('prefilled');
      cell.disabled = false;
      cell.style.backgroundColor = 'white';
    }
  });
}

function newGame() {
  clearInterval(interval);
  timer = 0;
  startTimer();
  board = examplePuzzle;
  fillPuzzle(board);
  message.textContent = "";
  updateStats();
}

function resetGame() {
  if (confirm("Are you sure you want to reset the board?")) {
    const cells = boardElement.querySelectorAll('input');
    board.forEach((val, i) => {
      if (val === 0) {
        cells[i].value = '';
        cells[i].classList.remove("invalid");
        cells[i].style.backgroundColor = 'white';
      }
    });
    message.textContent = "";
  }
}

function checkSolution() {
  const cells = boardElement.querySelectorAll('input');
  let grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  let hasError = false;

  cells.forEach(cell => cell.classList.remove("invalid"));

  for (let i = 0; i < 81; i++) {
    const val = parseInt(cells[i].value);
    const row = Math.floor(i / 9);
    const col = i % 9;
    if (isNaN(val) || val < 1 || val > 9) {
      cells[i].classList.add("invalid");
      hasError = true;
    } else {
      grid[row][col] = val;
    }
  }

  for (let row = 0; row < 9; row++) {
    const seen = {};
    for (let col = 0; col < 9; col++) {
      const val = grid[row][col];
      const index = row * 9 + col;
      if (val === 0) continue;
      if (seen[val]) {
        cells[index].classList.add("invalid");
        cells[seen[val]].classList.add("invalid");
        hasError = true;
      } else {
        seen[val] = index;
      }
    }
  }

  for (let col = 0; col < 9; col++) {
    const seen = {};
    for (let row = 0; row < 9; row++) {
      const val = grid[row][col];
      const index = row * 9 + col;
      if (val === 0) continue;
      if (seen[val]) {
        cells[index].classList.add("invalid");
        cells[seen[val]].classList.add("invalid");
        hasError = true;
      } else {
        seen[val] = index;
      }
    }
  }

  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = {};
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const row = boxRow * 3 + i;
          const col = boxCol * 3 + j;
          const val = grid[row][col];
          const index = row * 9 + col;
          if (val === 0) continue;
          if (seen[val]) {
            cells[index].classList.add("invalid");
            cells[seen[val]].classList.add("invalid");
            hasError = true;
          } else {
            seen[val] = index;
          }
        }
      }
    }
  }

  if (hasError) {
    message.textContent = "❌ There are duplicate or invalid entries!";
    message.style.color = "red";
  } else {
    message.textContent = "🎉 Sudoku Solved Successfully!";
    message.style.color = "green";
    clearInterval(interval);
    puzzlesSolved++;
    localStorage.setItem("puzzlesSolved", puzzlesSolved);
    if (bestTime === "--" || timer < bestTime) {
      bestTime = timer;
      localStorage.setItem("bestTime", bestTime);
    }
    updateStats();
  }
}

function getHint() {
  const cells = document.querySelectorAll('input');
  for (let i = 0; i < 81; i++) {
    if (!cells[i].value || cells[i].value.trim() === '') {
      cells[i].value = exampleSolution[i];
      cells[i].style.backgroundColor = "#d9ffd9";
      cells[i].style.transition = "background-color 0.5s ease";
      break;
    }
  }
}

function updateStats() {
  stats.textContent = `Puzzles Solved: ${puzzlesSolved} | Fastest: ${bestTime}s`;
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

window.onload = () => {
  createBoard();
  newGame();
};

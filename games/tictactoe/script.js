const board = document.getElementById('board');
const status = document.getElementById('status');
const modeSelect = document.getElementById('mode');

let cells = Array(9).fill('');
let gameOver = false;

function createBoard() {
  board.innerHTML = '';
  cells.forEach((_, i) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handlePlayerMove);
    board.appendChild(cell);
  });
}

function handlePlayerMove(e) {
  const index = parseInt(e.target.dataset.index);
  if (cells[index] !== '' || gameOver) return;

  makeMove(index, 'X');

  if (checkWin('X')) {
    status.textContent = 'You Win! 🎉';
    gameOver = true;
    return;
  }

  if (isDraw()) {
    status.textContent = "It's a Draw!";
    gameOver = true;
    return;
  }

  status.textContent = "Bot's Turn...";
  setTimeout(botMove, 400);
}

function botMove() {
  if (gameOver) return;

  let botIndex;

  if (modeSelect.value === 'easy') {
    // Easy: random move
    const empty = cells.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    botIndex = empty[Math.floor(Math.random() * empty.length)];
  } else {
    // Hard: use Minimax
    botIndex = minimax(cells, 'O').index;
  }

  makeMove(botIndex, 'O');

  if (checkWin('O')) {
    status.textContent = 'Bot Wins! 🤖';
    gameOver = true;
  } else if (isDraw()) {
    status.textContent = "It's a Draw!";
    gameOver = true;
  } else {
    status.textContent = "Your Turn!";
  }
}

function makeMove(index, player) {
  cells[index] = player;
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = player;
}

function checkWin(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(pattern => pattern.every(i => cells[i] === player));
}

function isDraw() {
  return cells.every(cell => cell !== '');
}

function restartGame() {
  cells = Array(9).fill('');
  gameOver = false;
  status.textContent = "Your Turn!";
  createBoard();
}

// Minimax Algorithm (Hard Bot)
function minimax(newBoard, player) {
  const availSpots = newBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);

  if (checkWinner(newBoard, 'X')) return { score: -10 };
  if (checkWinner(newBoard, 'O')) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const index = availSpots[i];
    const move = { index: index };
    newBoard[index] = player;

    const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
    move.score = result.score;

    newBoard[index] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    moves.forEach(m => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach(m => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    });
  }

  return bestMove;
}

function checkWinner(board, player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => pattern.every(i => board[i] === player));
}

// Init
createBoard();

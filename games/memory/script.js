const board = document.getElementById("board");
const levelEl = document.getElementById("level");
const correctEl = document.getElementById("correct");
const wrongEl = document.getElementById("wrong");

const fruitEmojis = ['🍎','🍌','🍇','🍓','🍍','🥝','🍉','🍒','🍊','🥥'];

let level = 1;
let correct = 0;
let wrong = 0;
let firstTile = null;
let lockBoard = false;
let totalPairs = 4;

function startGame() {
  board.innerHTML = "";
  correct = 0;
  wrong = 0;
  updateStatus();

  let gridSize = level === 1 ? 3 : 4;
  totalPairs = level === 1 ? 4 : 8;
  let emojis = fruitEmojis.slice(0, totalPairs);
  let tiles = [...emojis, ...emojis];

  if (level === 1 && tiles.length < 9) {
    tiles.push('❓'); // dummy tile if 3x3
  }

  shuffle(tiles);

  board.className = "board";
  board.classList.add(`grid-${gridSize}x${gridSize}`);

  tiles.forEach(emoji => {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.emoji = emoji;
    tile.textContent = '';
    tile.addEventListener("click", handleClick);
    board.appendChild(tile);
  });
}

function handleClick(e) {
  const tile = e.currentTarget;
  if (lockBoard || tile.classList.contains("revealed")) return;

  tile.textContent = tile.dataset.emoji;
  tile.classList.add("revealed");

  if (!firstTile) {
    firstTile = tile;
  } else {
    lockBoard = true;
    const secondTile = tile;

    if (firstTile.dataset.emoji === secondTile.dataset.emoji) {
      correct++;
      updateStatus();
      firstTile = null;
      lockBoard = false;

      if (level === 1 && correct >= 4) {
        setTimeout(() => {
          alert("Naik ke Level 2 (4x4)!");
          level = 2;
          restartGame();
        }, 400);
      }

      if (level === 2 && correct >= totalPairs) {
        setTimeout(() => {
          alert("Kamu menang semua level! 🎉");
          level = 1;
          restartGame();
        }, 400);
      }
    } else {
      wrong++;
      updateStatus();
      firstTile.classList.add("wrong");
      secondTile.classList.add("wrong");

      setTimeout(() => {
        firstTile.textContent = '';
        secondTile.textContent = '';
        firstTile.classList.remove("revealed", "wrong");
        secondTile.classList.remove("revealed", "wrong");
        firstTile = null;
        lockBoard = false;
      }, 1000);
    }
  }
}

function updateStatus() {
  levelEl.textContent = level;
  correctEl.textContent = correct;
  wrongEl.textContent = wrong;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function restartGame() {
  firstTile = null;
  lockBoard = false;
  startGame();
}

startGame();

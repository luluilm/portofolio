const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const box = 20;
const canvasSize = 400;
let snake;
let direction;
let food;
let score;
let gameInterval;
let highScore = localStorage.getItem('snakeHighScore') || 0;

function startGame() {
  snake = [{ x: 200, y: 200 }];
  direction = 'RIGHT';
  score = 0;
  generateFood();
  scoreDisplay.textContent = score;

  clearInterval(gameInterval);
  gameInterval = setInterval(draw, 360);
  
  document.getElementById('high-score').textContent = highScore;
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
}

function draw() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#19815f' : '#66c2a4';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = '#da832d';
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let head = { ...snake[0] };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  // Game over conditions
  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert('Game Over! Your score: ' + score);
    return;
  }

  // Makan
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    score += 1;
scoreDisplay.textContent = score;

if (score > highScore) {
  highScore = score;
  localStorage.setItem('snakeHighScore', highScore);
  document.getElementById('high-score').textContent = highScore;
}
    generateFood();
  } else {
    snake.pop();
    snake.unshift(head);
  }
}

// Controls
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

// Touch controls (basic swipe)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', e => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener('touchmove', e => {
  if (!touchStartX || !touchStartY) return;

  const touch = e.touches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== 'LEFT') direction = 'RIGHT';
    else if (dx < 0 && direction !== 'RIGHT') direction = 'LEFT';
  } else {
    if (dy > 0 && direction !== 'UP') direction = 'DOWN';
    else if (dy < 0 && direction !== 'DOWN') direction = 'UP';
  }

  touchStartX = 0;
  touchStartY = 0;
});

function restartGame() {
  startGame();
}


// Start on load
startGame();

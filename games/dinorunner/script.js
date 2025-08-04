const dino = document.getElementById("dino");
const tree = document.getElementById("tree");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const restartBtn = document.getElementById("restart");

let isJumping = false;
let gravity = 0.9;
let position = 0;
let score = 0;
let highScore = localStorage.getItem("dinoHighScore") || 0;
let gameInterval;
let treeInterval;

highScoreEl.textContent = highScore;

function jump() {
  if (isJumping) return;
  isJumping = true;

  let upInterval = setInterval(() => {
    if (position >= 100) {
      clearInterval(upInterval);

      // turun
      let downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          position -= 5;
          dino.style.bottom = position + "px";
        }
      }, 20);
    } else {
      position += 5;
      dino.style.bottom = position + "px";
    }
  }, 20);
}

function moveTree() {
  let treeLeft = 600;
  let baseSpeed = 5;

  tree.style.left = treeLeft + "px";

  treeInterval = setInterval(() => {
    // Kecepatan meningkat setiap 5 poin
    let speed = baseSpeed + Math.floor(score / 5);

    if (treeLeft < -40) {
      treeLeft = 600 + Math.random() * 200;
      score++;
      scoreEl.textContent = score;

      if (score > highScore) {
        highScore = score;
        localStorage.setItem("dinoHighScore", highScore);
        highScoreEl.textContent = highScore;
      }
    } else {
      treeLeft -= speed;
      tree.style.left = treeLeft + "px";
    }

    // deteksi tabrakan
    const dinoBottom = parseInt(window.getComputedStyle(dino).bottom);
    if (
      treeLeft > 50 && treeLeft < 90 &&
      dinoBottom < 50
    ) {
      clearInterval(treeInterval);
      clearInterval(gameInterval);
      alert("Game Over! Skor kamu: " + score);
    }
  }, 20);
}


function startGame() {
  score = 0;
  position = 0;
  isJumping = false;
  scoreEl.textContent = 0;
  highScoreEl.textContent = highScore;
  dino.style.bottom = "0px";
  moveTree();
}

restartBtn.addEventListener("click", () => {
  clearInterval(treeInterval);
  clearInterval(gameInterval);
  startGame();
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
document.addEventListener("touchstart", jump);

// mulai otomatis
startGame();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const gameOverScreen = document.getElementById("gameOverScreen");
const yourScoreText = document.getElementById("yourScore");
const highScoreText = document.getElementById("highScoreText");
const congratsMessage = document.getElementById("congratsMessage");
const playAgainButton = document.getElementById("playAgainButton");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const bgImage = new Image();
bgImage.src = "cloud.jpg";
let bgX = 0;


const birdImg = new Image();
birdImg.src = "bird.jpg";

let bird = {
  x: 80,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  gravity: 0.5,
  lift: -10,
  velocity: 0
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;
let gameOver = false;
let frameCount = 0;

function drawBackground() {
  bgX -= 1;
  if (bgX <= -canvas.width) {
    bgX = 0;
  }
  ctx.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, bgX + canvas.width, 0, canvas.width, canvas.height);
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  for (let p of pipes) {
    ctx.fillStyle = "#2f4f4f";
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillStyle = "#555";
    ctx.fillRect(p.x + 10, 0, p.width - 20, p.top - 10);

    ctx.fillStyle = "#2f4f4f";
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
    ctx.fillStyle = "#555";
    ctx.fillRect(p.x + 10, canvas.height - p.bottom + 10, p.width - 20, p.bottom - 10);
  }
}

function updatePipes() {
  if (frameCount % 90 === 0) {
    let top = Math.random() * (canvas.height / 2);
    let gap = 200;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      bottom: canvas.height - top - gap
    });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    let p = pipes[i];
    p.x -= 3;

    let withinPipeX = bird.x + bird.width > p.x && bird.x < p.x + p.width;
    let hitTopPipe = bird.y < p.top;
    let hitBottomPipe = bird.y + bird.height > canvas.height - p.bottom;

    if (withinPipeX && (hitTopPipe || hitBottomPipe)) {
      gameOver = true;
    }

    if (p.x + p.width < bird.x && !p.passed) {
      score++;
      p.passed = true;
    }

    if (p.x + p.width < 0) {
      pipes.splice(i, 1);
    }
  }
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

function drawScore() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);
}

function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frameCount = 0;
  gameOver = false;
}

function showGameOver() {
  canvas.style.display = "none";
  gameOverScreen.style.display = "block";

  yourScoreText.textContent = `Your Score: ${score}`;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("flappyHighScore", highScore);
    congratsMessage.textContent = "🎉 Congratulations! You got the High Score!";
  } else {
    congratsMessage.textContent = "";
  }
  highScoreText.textContent = `High Score: ${highScore}`;
}

function draw() {
  drawBackground();
  drawBird();
  drawPipes();
  drawScore();
}

function gameLoop() {
  if (!gameOver) {
    updateBird();
    updatePipes();
    draw();
    frameCount++;
    requestAnimationFrame(gameLoop);
  } else {
    showGameOver();
  }
}

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  canvas.style.display = "block";
  resetGame();
  gameLoop();
});

playAgainButton.addEventListener("click", () => {
  resetGame();
  gameOverScreen.style.display = "none";
  canvas.style.display = "block";
  gameLoop();
});

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (gameOver) {
      resetGame();
      gameOverScreen.style.display = "none";
      canvas.style.display = "block";
      gameLoop();
    } else {
      bird.velocity = bird.lift;
    }
  }
});
  

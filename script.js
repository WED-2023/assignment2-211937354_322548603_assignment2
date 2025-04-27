
let isFirstSetupDone = false;
let users = JSON.parse(localStorage.getItem("users")) || [];
const defaultUser = {
  username: "p",
  password: "testuser",
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  birthDate: "01-01-2000"
};

if (!users.some(user => user.username === defaultUser.username)) {
  users.push(defaultUser);
  localStorage.setItem("users", JSON.stringify(users));
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(div => {
    div.classList.remove('active');
    div.style.display = 'none';
  });

  const target = document.getElementById(id);
  target.classList.add('active');

  if (id === 'game-screen') {
    target.style.display = 'flex';
    if (!gameRunning) {
      console.log("Restarting game because user returned to Game Screen...");
      startGame(); // restart game if needed
    }
  } else {
    target.style.display = 'block';
  }

  // 🚀 NEW LOGIC
  if (gameRunning) {
    if (id === 'about') {
      if (!isPaused) {
        pauseGame();  
      }
    } else if (id !== 'game-screen') {
      stopGame(); 
    }
  }
}





// Populate birth date dropdowns
window.onload = () => {
  const daySelect = document.querySelector("select[name='day']");
  const monthSelect = document.querySelector("select[name='month']");
  const yearSelect = document.querySelector("select[name='year']");

  for (let i = 1; i <= 31; i++) {
    const opt = document.createElement('option');
    opt.value = opt.textContent = i;
    daySelect.appendChild(opt);
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  months.forEach((month, i) => {
    const opt = document.createElement('option');
    opt.value = i + 1;
    opt.textContent = month;
    monthSelect.appendChild(opt);
  });

  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 100; i++) {
    const year = currentYear - i;
    const opt = document.createElement('option');
    opt.value = opt.textContent = year;
    yearSelect.appendChild(opt);
  }

  showScreen("welcome"); 
}

function togglePassword(fieldId, button) {
  const field = document.getElementById(fieldId);
  const eyeOpen = button.querySelector(".eye-open");
  const eyeClosed = button.querySelector(".eye-closed");

  const isHidden = field.type === "password";
  field.type = isHidden ? "text" : "password";

  eyeOpen.style.display = isHidden ? "none" : "inline";
  eyeClosed.style.display = isHidden ? "inline" : "none";
}

// Register form
document.getElementById("form-register").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = this.querySelector("input[placeholder='Username']").value;
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-confirm-password").value;
  const firstName = this.querySelector("input[placeholder='First Name']").value;
  const lastName = this.querySelector("input[placeholder='Last Name']").value;
  const email = this.querySelector("input[placeholder='Email']").value;
  const day = this.querySelector("select[name='day']").value;
  const month = this.querySelector("select[name='month']").value;
  const year = this.querySelector("select[name='year']").value;

  // Check if username exists
  if (users.some(user => user.username === username)) {
    const confirmField = document.getElementById("reg-username");
    confirmField.setCustomValidity("This username is already taken.");
    confirmField.reportValidity();
    setTimeout(() => confirmField.setCustomValidity(""), 3000);
    return;
  }

  // ✅ Check password strength
  const isValidLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!isValidLength || !hasLetter || !hasNumber) {
    const confirmField = document.getElementById("reg-password");
    confirmField.setCustomValidity("Must be at least 8 characters long and contain both letters and numbers.");
    confirmField.reportValidity();
    setTimeout(() => confirmField.setCustomValidity(""), 3000);
    return;
  }

  if (password !== confirmPassword) {
    const confirmField = document.getElementById("reg-confirm-password");
    confirmField.setCustomValidity("Passwords do not match");
    confirmField.reportValidity();
    setTimeout(() => confirmField.setCustomValidity(""), 3000);
    return;
  }

  const newUser = {
    username,
    password,
    firstName,
    lastName,
    email,
    birthDate: `${day}-${month}-${year}`
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert(`User "${username}" registered successfully!`);
  this.reset();
  showScreen("login-form");
});

// Login form
document.getElementById("form-login").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = this.querySelector("input[placeholder='Username']").value;
  const password = this.querySelector("input[placeholder='Password']").value;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    alert(`Welcome back, ${user.firstName}!`);
    renderNavbar(true, user.firstName);
    showScreen("welcome-loged-in"); // 👈 show the logged-in welcome page
  } else {
    alert("Incorrect username or password.");
  }
});


function logout() {
  isFirstSetupDone = false;
  showScreen("welcome");
  renderNavbar(false); // <<✨ THIS LINE
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("config-screen").style.display = "none";
  document.getElementById("game-controls").style.display = "none";
  document.removeEventListener("keydown", handleKeyDown);
}



function renderNavbar(isLoggedIn, username = '') {
  const navbar = document.getElementById('navbar');
  navbar.innerHTML = '';

  if (isLoggedIn) {
    navbar.innerHTML = `
      <div class="left-nav">
        <button onclick="showScreen('welcome-loged-in')">Home</button>
        <button class="pixel-button" onclick="handleGameButton()">Game</button>
        <button onclick="showScreen('config-screen')">Settings</button>
        <button onclick="openAbout()">About</button>
      </div>
      <div class="right-nav">
        <button onclick="logout()">Logout</button>
        <span>👤 ${username}</span>
      </div>
    `;
  } else {
    navbar.innerHTML = `
      <div class="right-nav">
        <button onclick="showScreen('welcome')">Home</button>
        <button onclick="showScreen('login-form')">Login</button>
        <button onclick="showScreen('register-form')">Register</button>
        <button onclick="openAbout()">About</button>
      </div>
    `;
  }
}

function handleGameButton() {
  if (isFirstSetupDone) {
    showScreen('game-screen');
  } else {
    showScreen('config-screen');
  }
}


let ctx;
let GAME_WIDTH;
let GAME_HEIGHT;
let player;
let gameRunning = false;

const playerImage = new Image();
playerImage.src = 'photos/player.png';

const enemyImage = new Image();
enemyImage.src = 'photos/enemy.png';

const backgroundImage = new Image();
backgroundImage.src = 'photos/space_background.png';

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const ENEMY_ROWS = 4;
const ENEMY_COLS = 5;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;
const BULLET_SPEED = 6;

let pewSound, explosionSound;
try {
  pewSound = new Audio('sounds/pew.mp3');
  explosionSound = new Audio('sounds/explosion.mp3');
  pewSound.volume = 0.1;
  explosionSound.volume = 0.2;
} catch (e) {
  console.warn("Audio files not found.");
}


player = {
  x: Math.random() * (GAME_WIDTH - PLAYER_WIDTH),
  y: GAME_HEIGHT - PLAYER_HEIGHT - 10,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  color: "lime",
  dx: 0,
  dy: 0,
  lives: 3,
  bullets: [],
  speed: 6
};

let enemies = [], enemyDir = 1, enemySpeed = 1, enemyBullets = [], score = 0;
let accelerationCount = 0, lastEnemyFireTime = 0, fireKey = " ";
let isPaused = false, flareAnimations = [], victoryTriggered = false;
let explosions = [], gameEndTime = 0, speedupInterval;
let remainingTime = 0;
let lastTimestamp = 0;
let speedMultiplier = 1;  // start normal speed


function initEnemies() {
  enemies = [];
  for (let row = 0; row < ENEMY_ROWS; row++) {
    for (let col = 0; col < ENEMY_COLS; col++) {
      enemies.push({
        x: 150 + col * (ENEMY_WIDTH + 30),
        y: 50 + row * (ENEMY_HEIGHT + 30),
        width: ENEMY_WIDTH,
        height: ENEMY_HEIGHT,
        row: row
      });
    }
  }
}

function drawRect(obj, color = obj.color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function drawFlare(flare) {
  ctx.save();
  ctx.globalAlpha = flare.alpha; // Make it semi-transparent
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(flare.x, flare.y, flare.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}


function draw() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.drawImage(backgroundImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw player
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

  // Draw player bullets
  player.bullets.forEach(bullet => drawRect(bullet, "white"));

  // Draw enemies
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Draw enemy bullets
  enemyBullets.forEach(bullet => drawRect(bullet, "orange"));

  // Draw flares (shooting animation)
  flareAnimations.forEach(flare => drawFlare(flare));

  explosions.forEach(p => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1; // reset alpha

  // Draw UI
  
  // ctx.fillStyle = "white";
  // ctx.font = "25px Arial";
  
  // ctx.fillText("⭐ Score: " + score, 10, 30);
  // const hearts = "❤️".repeat(player.lives);
  // ctx.fillText(hearts, 10, 60);

  // // 🕰️ Countdown timer
  // const secondsLeft = Math.max(0, Math.ceil(remainingTime));
  // const minutes = Math.floor(secondsLeft / 60);
  // const seconds = secondsLeft % 60;
  // const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // ctx.fillText("🕰️ " + formattedTime, 10, 90);

  ctx.fillStyle = "white";
  ctx.font = "25px Arial";
  
  // 🕰️ Countdown timer
  const secondsLeft = Math.max(0, Math.ceil(remainingTime));
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const hearts = "❤️".repeat(player.lives);
  
  // 👉 One line only:
  ctx.fillText(`⭐ ${score}   ${hearts}   🕰️ ${formattedTime}`, 10, 30);
  

  if (isPaused && gameRunning) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center"; // center "Game Paused"
    ctx.fillText("Game Paused", GAME_WIDTH / 2, GAME_HEIGHT / 2);
  
    ctx.textAlign = "left"; // ⬅️ Reset after drawing the paused text
  }
}

function update() {
  const now = Date.now();
  const delta = (now - lastTimestamp) / 1000; // how many seconds passed

  remainingTime -= delta;
  lastTimestamp = now;

  if (remainingTime <= 0) {
    showEndGame("\u23F0 Time's up! Your score: " + score);
    gameRunning = false;
  }
  player.x += player.dx;
  player.y += player.dy;
  player.x = Math.max(0, Math.min(player.x, GAME_WIDTH - player.width));
  const maxY = GAME_HEIGHT * 0.6;
  player.y = Math.max(maxY, Math.min(player.y, GAME_HEIGHT - player.height));

  // Player bullets
  player.bullets = player.bullets.filter(b => b.y > 0);
  player.bullets.forEach(b => b.y -= BULLET_SPEED);

  // Enemy bullets
  enemyBullets.forEach(b => b.y += BULLET_SPEED * speedMultiplier);
  enemyBullets = enemyBullets.filter(b => b.y < GAME_HEIGHT);

  // Explosions update
  explosions.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    p.alpha -= 0.02;
  });
  explosions = explosions.filter(p => p.alpha > 0);

  // Bullet collision with enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    for (let j = player.bullets.length - 1; j >= 0; j--) {
      const b = player.bullets[j];
      if (b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
        switch (e.row) {
          case 0:
            score += 20;
            break;
          case 1:
            score += 15;
            break;
          case 2:
            score += 10;
            break;
          case 3:
            score += 5;
            break;
        }
        enemies.splice(i, 1);

        if(gameRunning){
          const explosionClone = explosionSound.cloneNode();
          explosionClone.volume = 0.6;
          explosionClone.play().catch(err => console.error("Explosion sound error:", err));
        } 

        // 💥 Create explosion
        for (let p = 0; p < 10; p++) {
          explosions.push({
            x: e.x + e.width / 2,
            y: e.y + e.height / 2,
            dx: (Math.random() - 0.5) * 5,
            dy: (Math.random() - 0.5) * 5,
            size: Math.random() * 4 + 2,
            alpha: 1
          });
        }

        player.bullets.splice(j, 1);
        break;
      }
    }

    // Flare animations (for shooting bullets)
    flareAnimations.forEach(f => {
      f.size -= 0.3; // shrink faster
      f.alpha -= 0.03; // fade out
    });

    flareAnimations = flareAnimations.filter(f => f.size > 0 && f.alpha > 0);

  }

  // Enemies move
  let edgeHit = false;
  enemies.forEach(e => {
    e.x += enemyDir * enemySpeed * speedMultiplier;
    if (e.x <= 0 || e.x + e.width >= GAME_WIDTH) edgeHit = true;
  });
  if (edgeHit) enemyDir *= -1;

  // Enemies shoot
  if (Date.now() - lastEnemyFireTime > 1000) {
    const eligibleEnemies = enemies.filter(e => !enemyBullets.length || enemyBullets[0].y > GAME_HEIGHT * 0.25);
    if (eligibleEnemies.length) {
      const shooter = eligibleEnemies[Math.floor(Math.random() * eligibleEnemies.length)];
      enemyBullets.push({
        x: shooter.x + shooter.width / 2 - 3,
        y: shooter.y + shooter.height,
        width: 6,
        height: 10
      });
      lastEnemyFireTime = Date.now();
    }
  }

  // Check if enemy bullet hits player
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    if (b.x < player.x + player.width && b.x + b.width > player.x && b.y < player.y + player.height && b.y + b.height > player.y) {
      player.lives--;
      player.x = Math.random() * (GAME_WIDTH - player.width);
      player.y = GAME_HEIGHT - PLAYER_HEIGHT - 10;
      enemyBullets.splice(i, 1);
      if (player.lives <= 0) {
        showEndGame("💀 Game Over! Your score: " + score);
      }
    }
  }
}


function gameLoop() {
  if (!isPaused && gameRunning) {
    update();
  }
  
  draw(); // <-- draw ALWAYS happens, even if paused!

  if (enemies.length === 0 && gameRunning) {
    showEndGame("🎉 Victory! You destroyed all enemy ships! 🎉");
    return;
  }

  if (player.lives <= 0 && gameRunning) {
    showEndGame(`💀 Game Over! Your score: ${score}`);
    return;
  }

  requestAnimationFrame(gameLoop);
}



document.addEventListener("keyup", e => {
  if (["ArrowLeft", "ArrowRight"].includes(e.key)) player.dx = 0;
  if (["ArrowUp", "ArrowDown"].includes(e.key)) player.dy = 0;
});

function handleKeyDown(e) {
  if (!gameRunning || isPaused) return;

  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === "ArrowUp") player.dy = -player.speed;
  if (e.key === "ArrowDown") player.dy = player.speed;

  if (e.key.toLowerCase() === fireKey.toLowerCase()) {
    player.bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10
    });
if(gameRunning)
{
    const pewClone = pewSound.cloneNode();
    pewClone.volume = 0.3;
    pewClone.play().catch(err => console.error("Pew sound error:", err));} 

    flareAnimations.push({
      x: player.x + player.width / 2,
      y: player.y,
      size: 10,
      alpha: 1
    });
  }
}

function startGame() {
  gameRunning = true;
  speedMultiplier = 1;

  const canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  const availableWidth = window.innerWidth;

  const headerHeight = document.querySelector('header').offsetHeight;
  const footerHeight = document.querySelector('footer').offsetHeight;
  const availableHeight = window.innerHeight - headerHeight - footerHeight - 100; // 100px buffer for buttons
  
  canvas.width = Math.max(Math.min(1200, window.innerWidth * 0.9), 1000);
  canvas.height = Math.min(600, availableHeight);
  
  
  GAME_WIDTH = canvas.width;
  GAME_HEIGHT = canvas.height;

  attachKeyListeners(); 

  player = {
    x: Math.random() * (GAME_WIDTH - PLAYER_WIDTH),
    y: GAME_HEIGHT - PLAYER_HEIGHT - 10,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    color: "lime",
    dx: 0,
    dy: 0,
    lives: 3,
    bullets: [],
    speed: 6
  };

  document.getElementById("config-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  document.getElementById("game-controls").style.display = "block";

  const pauseButton = document.querySelector("#game-controls button:first-child");
  if (pauseButton) {
    pauseButton.innerText = "Pause"; // Reset the text to "Pause" when starting the game
  }

  score = 0;
  accelerationCount = 0;
  enemyBullets = [];
  explosions = [];
  enemies = [];
  enemySpeed = 1;
  enemyDir = 1;
  isPaused = false;
  victoryTriggered = false;

  const durationMinutes = parseInt(document.getElementById("game-duration").value) || 2;
  const fireInput = document.getElementById("fire-key").value.trim().toLowerCase();
  if (fireInput === "space") {
    fireKey = " "; // Set it correctly to space character
  } else if (fireInput.length === 1) {
    fireKey = fireInput;
  } else {
    fireKey = " "; // default if invalid
  }

  remainingTime = durationMinutes * 60; // in seconds
  lastTimestamp = Date.now();
  
  initEnemies();
  requestAnimationFrame(gameLoop);

  if (speedupInterval) clearInterval(speedupInterval);

  speedupInterval = setInterval(() => {
    if (speedMultiplier < 4) {
      speedMultiplier += 0.5;
      if (speedMultiplier > 4) speedMultiplier = 4; // cap at 4.0
    } else {
      clearInterval(speedupInterval);
    }
  }, 5000);

  isFirstSetupDone = true;

}


isPaused = false;
speedupInterval;

function showEndGame(message) {
  const modal = document.getElementById("end-game-modal");
  const msg = document.getElementById("end-game-message");
  document.getElementById("game-controls").style.display = "none";
  msg.innerText = message;
  modal.style.display = "flex";
  gameRunning = false;
  document.removeEventListener("keydown", handleKeyDown);
}

function restartGame() {
  document.getElementById("end-game-modal").style.display = "none";
  startGame();
}


function attachKeyListeners() {
  document.removeEventListener("keydown", handleKeyDown); // always clean up first
  document.addEventListener("keydown", handleKeyDown);    // attach fresh
}

function pauseGame() {
  if (!gameRunning) return;

  isPaused = !isPaused;

  const pauseButton = document.querySelector("#game-controls button:first-child");
  if (isPaused) {
    pauseButton.innerText = "Resume";
  } else {
    pauseButton.innerText = "Pause";
    lastTimestamp = Date.now(); // reset timestamp so timer is correct after resume
  }
}


function resetGame() {
  if (!gameRunning) return; // Don't reset if game not running

  if (confirm("Are you sure you want to reset the game?")) {
    startGame(); // Just call startGame() again to reset everything
  }
}

function stopGame() {
  gameRunning = false;
  isPaused = false;
  document.removeEventListener("keydown", handleKeyDown);
  console.log("Game stopped.");
}


const aboutModal = document.getElementById('about-modal');
const closeAboutBtn = document.getElementById('close-about');

// Open About Modal
function openAbout() {
  aboutModal.showModal();
}

// Close About Modal
function closeAbout() {
  aboutModal.close();
}

// Close when clicking X button
closeAboutBtn.addEventListener('click', closeAbout);

// Close when clicking outside the modal
aboutModal.addEventListener('click', (e) => {
  const rect = aboutModal.getBoundingClientRect();
  if (
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  ) {
    closeAbout();
  }
});

// Close when pressing Escape
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape" && aboutModal.open) {
    closeAbout();
  }
});
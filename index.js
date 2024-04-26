// Setting up Canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// Player Class
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  // Draw a circle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
// Enemy Class
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  // Draw a circle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
// Projectile Class
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  // Draw a circle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

// Position the player in the middle of the screen
const x = canvas.width / 2;
const y = canvas.height / 2;

// Create a player
const player = new Player(x, y, 30, "blue");

// Draw the player on canvas
player.draw();

// Create projectiles
const projectiles = [];
// Create enemies
const enemies = [];

function spawnEnemies() {
  setInterval(() => {
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 : canvas.width;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 : canvas.height;
    }
    const radius = Math.random() * (30 - 4) + 4;
    const color = "green";
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
    // console.log(enemies);
  }, 1000);
}

// Animate how to bullets should move
function animate() {
  requestAnimationFrame(animate);
  //  Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   Draw the player
  player.draw();
  projectiles.forEach((projectile) => {
    projectile.update();
  });
  enemies.forEach((enemy) => {
    enemy.update();
  });
}
// Fire projectiles on click
addEventListener("click", (event) => {
  //Calculate angle between player and mouse click
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  // Calculate velocity for bullet
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  projectiles.push(new Projectile(x, y, 5, "red", velocity));
});
animate();
spawnEnemies();

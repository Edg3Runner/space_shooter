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
let animationId;
// Animate how to bullets should move
function animate() {
  // This returns whatever frame you are currently on.
  animationId = requestAnimationFrame(animate);
  // Adding BG color to the canvas and a fade effect with opacity
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //  Clear canvas
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   Draw the player
  player.draw();

  projectiles.forEach((projectile) => {
    projectile.update();
    // Check if the projectile has gone off the screen and remove it.

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        // Remove projectile from array
        projectiles.splice(projectiles.indexOf(projectile), 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    // Game Over
    if (dist - enemy.radius - player.radius < 1) {
      // Stops the animation when the game is over
      cancelAnimationFrame(animationId);
      // Ensure that the entire canvas is cleared before the game is over
      //   setTimeout(() => {
      //     ctx.clearRect(0, 0, canvas.width, canvas.height);
      //   }, 0);
    }

    projectiles.forEach((projectile, projectileIndex) => {
      // Check for collision -> Currently hitting the center of the enemy instead of the edge
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // If the distance is less than the radii, we have a collision
      if (dist - enemy.radius - projectile.radius < 1) {
        // setTimeout is used to remove the enemy and projectile until the next frame is rendered to prevent glitches like flashing enemies.
        setTimeout(() => {
          // Remove projectile and enemy from respective array
          enemies.splice(enemyIndex, 1);
          projectiles.splice(projectileIndex, 1);
        }, 0);
      }
    });
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

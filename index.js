// Setting up Canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#scoreEl");
const startGameBtn = document.querySelector("#startGameBtn");
const modalEl = document.querySelector("#modalEl");
const finalScoreEl = document.querySelector("#finalScoreEl");

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
// Slowing down the particles fade-out.
const friction = 0.99;
// Particle Class
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  // Draw a circle
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
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
const player = new Player(x, y, 10, "white");

// Draw the player on canvas
player.draw();

// Create projectiles
const projectiles = [];
// Create enemies
const enemies = [];
// Create particles
const particles = [];

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
    const color = "hsla(" + Math.random() * 360 + ", 50%, 50%, 1)";
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}
let animationId;
let score = 0;

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
  particles.forEach((particle) => {
    if (particle.alpha <= 0) {
      particles.splice(particles.indexOf(particle), 1);
    } else {
      particle.update();
    }
  });
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
      modalEl.style.display = "flex";
      finalScoreEl.textContent = score;
    }

    projectiles.forEach((projectile, projectileIndex) => {
      // Check for collision -> Currently hitting the center of the enemy instead of the edge
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      // If the distance is less than the radii, we have a collision
      // When projectiles touch the enemy
      if (dist - enemy.radius - projectile.radius < 1) {
        // create particles explosion
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }

        // If radius > 10, subtract 10
        if (enemy.radius - 10 > 5) {
          // Increase the score
          score += 100;
          scoreEl.textContent = score;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          // Increase the score
          score += 250;
          scoreEl.textContent = score;
          // setTimeout is used to remove the enemy and projectile until the next frame is rendered to prevent glitches like flashing enemies.
          setTimeout(() => {
            // Remove projectile and enemy from respective array
            enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
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
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };
  projectiles.push(new Projectile(x, y, 5, "white", velocity));
});

startGameBtn.addEventListener("click", () => {
  animate();
  spawnEnemies();
  modalEl.style.display = "none";
});

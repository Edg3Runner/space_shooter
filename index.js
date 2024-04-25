const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
// Player blueprint/class
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

// Place player in the middle of the screen
const x = canvas.width / 2;
const y = canvas.height / 2;
// Create Player
const player = new Player(x, y, 30, "blue");
// Draw player on canvas
player.draw();

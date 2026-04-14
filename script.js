const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
x: canvas.width / 2,
y: canvas.height - 120,
size: 40,
speed: 6,
};

let bullets = [];
let enemies = [];
let lastEnemyTime = 0;

let touchX = null;

canvas.addEventListener("touchmove", e => {
const touch = e.touches[0];
touchX = touch.clientX;
  });

setInterval(() => {
bullets.push({ x: player.x, y: player.y - 30, size: 8 });
}, 200);

function spawnEnemy() {
enemies.push({
x: Math.random() * canvas.width,
y: -40,
size: 40,
speed: 3
});
}

function update() {
if (touchX !== null) {
if (touchX > player.x) player.x += player.speed;
if (touchX < player.x) player.x -= player.speed;
}

bullets = bullets.filter(b => b.y > -20);
bullets.forEach(b => b.y -= 10);

enemies = enemies.filter(e => e.y < canvas.height + 40);
enemies.forEach(e => e.y += e.speed);

for (let e of enemies) {
for (let b of bullets) {
let dx = e.x - b.x;
let dy = e.y - b.y;
if (Math.hypot(dx, dy) < e.size) {
e.dead = true;
b.dead = true;
}
}
}
  enemies = enemies.filter(e => !e.dead);
bullets = bullets.filter(b => !b.dead);

if (Date.now() - lastEnemyTime > 700) {
spawnEnemy();
lastEnemyTime = Date.now();
}
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = "yellow";
bullets.forEach(b => {
ctx.beginPath();
ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
ctx.fill();
});

ctx.fillStyle = "red";
enemies.forEach(e => {
ctx.beginPath();
ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
ctx.fill();
});
}

function loop() {
update();
draw();
requestAnimationFrame(loop);
}

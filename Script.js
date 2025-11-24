import Input from "./Input.js";
import Button from "./Button.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const input = new Input(canvas);

const startButton = new Button(input, { text: "Start", x: 300, y: 250, width: 200, height: 80, fontSize: 30, fillColor: "#2ecc71", hoverFillColor: "#38e98c", borderColor: "#145f3a" });
const resumeButton = new Button(input, { text: "Resume", x: 300, y: 200, width: 200, height: 60, fontSize: 24, fillColor: "#3498db", hoverFillColor: "#5dade2", borderColor: "#1b4f72" });
const restartButton = new Button(input, { text: "Restart", x: 300, y: 300, width: 200, height: 60, fontSize: 24, fillColor: "#e74c3c", hoverFillColor: "#ec7063", borderColor: "#922b21" });

let currentScene = "menu";
let player = { x: 400, y: 540, size: 40 };
let balls = [];
let timer = 0;
let paused = false;
let dead = false;

function spawnBall() {
    balls.push({ x: Math.random() * canvas.width, y: -20, size: 20, speed: 3 + Math.random() * 2 + timer / 10 });
}
function resetGame() {
    balls = [];
    timer = 0;
    player.x = 400;
    paused = false;
    dead = false;
}
function updateMenu() {
    if (startButton.clicked()) {
        resetGame();
        currentScene = "game";
}
}
function updatePause() {
    if (resumeButton.clicked()) {
        paused = false;
        currentScene = "game";
}
    if (restartButton.clicked()) {
        resetGame();
        currentScene = "game";
}
}
function updateGameOver() {
    if (restartButton.clicked()) {
        resetGame();
        currentScene = "game";
}
}
function updateWin() {
    if (restartButton.clicked()) {
        resetGame();
        currentScene = "game";
}
}
function updateGame(deltaTime) {
    if (paused) {
        currentScene = "pause";
        return;
}
    if (input.getKey("A")) player.x -= 5;
    if (input.getKey("D")) player.x += 5;
    if (input.getKeyDown(' ')) paused = true;
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
    if (Math.random() < 0.02) spawnBall();
    for (let b of balls) {
        b.y += b.speed;
        if (b.x < player.x + player.size && b.x + b.size > player.x &&
            b.y < player.y + player.size && b.y + b.size > player.y) {
            dead = true;
            currentScene = "gameover";
}
}
    timer += deltaTime * 0.001;
    if (timer >= 20) currentScene = "win";
}
function update(deltaTime) {
    if (currentScene === "menu") updateMenu();
    else if (currentScene === "game") updateGame(deltaTime);
    else if (currentScene === "pause") updatePause();
    else if (currentScene === "gameover") updateGameOver();
    else if (currentScene === "win") updateWin();
}
function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startButton.draw(ctx);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Dodge", 350, 180);
}
function drawPause() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resumeButton.draw(ctx);
    restartButton.draw(ctx);
    ctx.fillStyle = "black";
    ctx.font = "26px Arial";
    ctx.fillText("Paused", 350, 150);
}
function drawGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    restartButton.draw(ctx);
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 320, 180);
}
function drawWin() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    restartButton.draw(ctx);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("You win!", 340, 250);
}
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 580, canvas.width, 20);
    ctx.fillStyle = "#001a66";
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.fillStyle = "red";
    for (let b of balls) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
}
}
function draw() {
    if (currentScene === "menu") drawMenu();
    else if (currentScene === "game") drawGame();
    else if (currentScene === "pause") drawPause();
    else if (currentScene === "gameover") drawGameOver();
    else if (currentScene === "win") drawWin();
}
let previousTime = performance.now();

function loop() {
    const currentTime = performance.now();
    const deltaTime = currentTime - previousTime;
    previousTime = currentTime;
    input.update();
    update(deltaTime);
    draw();
    requestAnimationFrame(loop);
}
loop();

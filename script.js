const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');

const tileCount = 20;
const tileSize = 20;

canvas.width = tileCount * tileSize;
canvas.height = tileCount * tileSize;

let snake = [{x: 10, y: 10}];
let food = getRandomFood();
let velocity = {x: 0, y: 0};
let score = 0;

document.addEventListener('keydown', changeDirection);

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}

function update() {
    const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        food = getRandomFood();
    } else {
        snake.pop();
    }

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || checkSnakeCollision(head)) {
        resetGame();
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake as circles
    for (let i = 0; i < snake.length; i++) {
        ctx.beginPath();
        ctx.arc(
            snake[i].x * tileSize + tileSize / 2,
            snake[i].y * tileSize + tileSize / 2,
            tileSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = i === 0 ? '#00ff7f' : 'lime'; // head is brighter
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff7f';
        ctx.fill();
        ctx.closePath();
    }

    // Draw food as circle
    ctx.beginPath();
    ctx.arc(
        food.x * tileSize + tileSize / 2,
        food.y * tileSize + tileSize / 2,
        tileSize / 2,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = 'red';
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'red';
    ctx.fill();
    ctx.closePath();

    // Reset shadow so background isn’t affected
    ctx.shadowBlur = 0;
}


function changeDirection(e) {
    switch (e.key) {
        case 'ArrowUp': if (velocity.y !== 1) velocity = {x: 0, y: -1}; break;
        case 'ArrowDown': if (velocity.y !== -1) velocity = {x: 0, y: 1}; break;
        case 'ArrowLeft': if (velocity.x !== 1) velocity = {x: -1, y: 0}; break;
        case 'ArrowRight': if (velocity.x !== -1) velocity = {x: 1, y: 0}; break;
    }
}

function getRandomFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function checkSnakeCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    velocity = {x: 0, y: 0};
    score = 0;
    document.getElementById('score').innerText = score;
    food = getRandomFood();
}

gameLoop();

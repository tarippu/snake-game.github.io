const CELL_SIZE = 20;
// canvas size
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const musicSound = new Audio("assets/audio/music.mp3");
musicSound.loop = true;
musicSound.play();
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
// kecepatan ular
const MOVE_INTERVAL = 120;
let currentMoveSpeed = MOVE_INTERVAL;
let countEatApple = 0;
let level = 1;
let nyawa = 3;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody(type) {
  console.log("type", type);
  if (type === "snake") {
    let head = initPosition();
    let body = [{
      x: head.x,
      y: head.y
    }];
    return {
      head: head,
      body: body,
    };
  } else {
    let head = initPosition();
    let body = [{
        x: head.x,
        y: head.y
      },
      {
        x: head.x,
        y: head.y + 1
      },
      {
        x: head.x,
        y: head.y + 2
      },
      {
        x: head.x,
        y: head.y + 3
      },
      {
        x: head.x,
        y: head.y + 4
      },
      {
        x: head.x,
        y: head.y + 5
      },
      {
        x: head.x,
        y: head.y + 6
      },
    ];

    return {
      head: head,
      body: body,
    };
  }
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color, type) {
  return {
    color: color,
    ...initHeadAndBody(type),
    direction: initDirection(),
    score: 0,
  };
}
let snake1 = initSnake("purple", "snake");
// ular
const head1 = new Image();
head1.src = "./assets/img/head1.png";
const body1 = new Image();
body1.src = "./assets/img/body1.png";

let snake2;
let snake3;

// apple
let apples = [{
    color: "red",
    position: initPosition(),
  },
  {
    color: "green",
    position: initPosition(),
  },
];

// apple
let heart = [{
    color: "red",
    position: initPosition(),
  },
  {
    color: "green",
    position: initPosition(),
  },
];

function drawCell(context, x, y, color, type) {
  if (type === "snake") {
    context.beginPath();
    context.fillStyle = color;

    context.arc(
      x * CELL_SIZE + 10,
      y * CELL_SIZE + 10,
      CELL_SIZE / 2,
      0,
      2 * Math.PI
    );
    context.fill();
  } else {
    context.fillStyle = color;
    context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
}

function drawSpeed() {
  let speedCanvas;
  speedCanvas = document.getElementById("speed");
  let speedCtx = speedCanvas.getContext("2d");
  speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  speedCtx.font = "20px Arial";
  speedCtx.fillStyle = "black";
  speedCtx.fillText(currentMoveSpeed, 10, speedCanvas.scrollHeight / 2);
}

function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById("score1Board");
  } else if (snake.color == snake2.color) {
    scoreCanvas = document.getElementById("score2Board");
  } else {
    scoreCanvas = document.getElementById("score3Board");
  }
  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "30px Arial";
  scoreCtx.fillStyle = "black";
  scoreCtx.fillText(`${snake.score}`, 10, scoreCanvas.scrollHeight / 2);
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.drawImage(
      head1,
      snake1.head.x * CELL_SIZE,
      snake1.head.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
    for (let i = 1; i < snake1.body.length; i++) {
      ctx.drawImage(
        body1,
        snake1.body[i].x * CELL_SIZE,
        snake1.body[i].y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];

      var img = document.getElementById("apple");
      ctx.drawImage(
        img,
        apple.position.x * CELL_SIZE,
        apple.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
    for (let i = 0; i < nyawa; i++) {
      var heart = document.getElementById("heart");
      ctx.drawImage(heart, 25 * i, 0, CELL_SIZE, CELL_SIZE);
    }
    ctx.font = "20px Arial";
    ctx.fillText(`(level ${level})`, 0, 595);
    if (level > 1) {
      let snakeCanvas = document.getElementById("snakeBoard");
      let ctx = snakeCanvas.getContext("2d");

      drawCell(ctx, snake2.head.x, snake2.head.y, snake2.color, "block");
      for (let i = 1; i < snake2.body.length; i++) {
        drawCell(
          ctx,
          snake2.body[i].x,
          snake2.body[i].y,
          snake2.color,
          "block"
        );
      }

      drawCell(ctx, snake3.head.x, snake3.head.y, snake3.color, "block");
      for (let i = 1; i < snake3.body.length; i++) {
        drawCell(
          ctx,
          snake3.body[i].x,
          snake3.body[i].y,
          snake3.color,
          "block"
        );
      }
    }
    drawScore(snake1);
    drawSpeed(snake1);
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

// apples array
function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      var audio = new Audio("./assets/audio/eat-appel.wav");
      audio.play();
      apple.position = initPosition();
      snake.score++;
      countEatApple++;
      snake.body.push({
        x: snake.head.x,
        y: snake.head.y
      });
      if (countEatApple === 5) {
        countEatApple = 0;
        level++;
        var audio = new Audio("./assets/audio/level-up.wav");
        audio.play();
        setTimeout(() => {
          alert(`Selamat kamu berhasil ke level ${level} !`);
        }, 300);
      }
      if (level === 5) {
        // final game
        level = 1;
        countEatApple = 0;
        var audio = new Audio("./assets/audio/final-game.wav");
        audio.play();
        setTimeout(() => {
          alert("Game selesai");
        }, 300);
        countEatApple = 0;
        level = 1;
        snake1 = initSnake("purple", "snake");
        snake2 = initSnake("black", "block");
        snake3 = initSnake("black", "block");
      }
      if (level > 1) {
        snake2 = initSnake("black", "block");
        snake3 = initSnake("black", "block");
      }
    }
  }
}

function eatHeart(snake, heartIcon) {
  if (
    snake.head.x == heartIcon.position.x &&
    snake.head.y == heartIcon.position.y
  ) {
    heartIcon.position = initPosition();
    snake.score++;
    nyawa++;
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
}

function checkCollision(snakes) {
  let isCollide = false;
  for (let i = 0; i < snakes ?.length; i++) {
    for (let j = 0; j < snakes ?.length; j++) {
      for (let k = 1; k < snakes[j] ?.body.length; k++) {
        if (
          snakes[i] ?.head.x == snakes[j] ?.body[k].x &&
          snakes[i] ?.head.y == snakes[j] ?.body[k].y
        ) {
          isCollide = true;
        }
      }
    }
  }
  if (isCollide) {
    nyawa--;
    // game over audio:
    if (nyawa === 0) {
      var audio = new Audio("./assets/audio/game-over.wav");
      audio.play();
      setTimeout(() => {
        alert("Game over");
      }, 300);
      nyawa = 3;
      level = 1;
    }
    countEatApple = 0;
    snake1 = initSnake("purple", "snake");
    snake2 = initSnake("black", "block");
    snake3 = initSnake("black", "block");
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  if (!checkCollision([snake1, snake2, snake3])) {
    setTimeout(function () {
      move(snake);
    }, MOVE_INTERVAL);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({
    x: snake.head.x,
    y: snake.head.y
  });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "ArrowRight") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "ArrowUp") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "ArrowDown") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
}
initGame();
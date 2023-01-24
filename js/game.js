'use strict';
const WALL = '🗄';
const FOOD = '.';
const EMPTY = ' ';
const POWER_FOOD = '🍬';
const CHERRY = '🍒';

var gCherryInterval;
var gGame;
var gBoard;

function onInit() {
  gGame = {
    score: 0,
    isOn: true,
    isVictory: false,
    foodCount: -1,
  };

  gBoard = buildBoard();
  createGhosts(gBoard);
  createPacman(gBoard);
  renderBoard(gBoard, '.board-container');

  gCherryInterval = setInterval(addCherry, 15000);
  closeModal();
}

function buildBoard() {
  const size = 10;
  const board = [];

  for (var i = 0; i < size; i++) {
    board.push([]);
    for (var j = 0; j < size; j++) {
      board[i][j] = FOOD;
      gGame.foodCount++;
      if (
        i === 0 ||
        i === size - 1 ||
        j === 0 ||
        j === size - 1 ||
        (j === 3 && i > 4 && i < size - 2)
      ) {
        board[i][j] = WALL;
        gGame.foodCount--;
      }
    }
  }
  addPowerFood(board);
  return board;
}

function addPowerFood(board) {
  board[1][1] = POWER_FOOD;
  board[1][board[0].length - 2] = POWER_FOOD;
  board[board.length - 2][1] = POWER_FOOD;
  board[board.length - 2][board[0].length - 2] = POWER_FOOD;
  gGame.foodCount -= 4;
}

function updateScore(diff) {
  // Model
  gGame.score += diff;
  // DOM
  document.querySelector('h2 span').innerText = gGame.score;
}

function addCherry() {
  var emptyLocation = getEmptyLocation(gBoard);
  if (!emptyLocation) return;
  // Update Model
  gBoard[emptyLocation.i][emptyLocation.j] = CHERRY;
  // Update DOM
  renderCell(emptyLocation, CHERRY);
}

function getEmptyLocation(board) {
  var emptyLocations = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j] === EMPTY) {
        emptyLocations.push({ i, j });
      }
    }
  }
  if (!emptyLocations.length) return null;
  var randIdx = getRandomIntInclusive(0, emptyLocations.length - 1);
  return emptyLocations[randIdx];
}

function gameOver() {
  console.log('Game Over');
  clearInterval(gGhostsInterval);
  clearInterval(gCherryInterval);
  gGame.isOn = false;
  renderCell(gPacman.location, EMPTY);
  var msg = gGame.isVictory ? 'You Won!!!' : 'Game Over';
  openModal(msg);
}

function checkVictory() {
  if (gGame.foodCount === 0) {
    gGame.isVictory = true;
    gameOver();
  }
}

function openModal(msg) {
  const elModal = document.querySelector('.modal');
  const elSpan = elModal.querySelector('.msg');
  elSpan.innerText = msg;
  elModal.style.display = 'block';
}

function closeModal() {
  const elModal = document.querySelector('.modal');
  elModal.style.display = 'none';
}

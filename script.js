// Simple Wordle-style game (beginner-friendly)

const words = ["apple", "grape", "pearl", "house", "table", "chair", "smile"];
const secretWord = words[Math.floor(Math.random() * words.length)];

let currentRow = 0;
let currentCol = 0;
let guesses = Array.from({ length: 6 }, () => Array(5).fill(""));

const board = document.getElementById("game-board");
const keyboard = document.getElementById("keyboard");

// Create the board (6 rows x 5 columns)
for (let i = 0; i < 6 * 5; i++) {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  board.appendChild(tile);
}

// Keyboard layout
const keys = [
  ..."QWERTYUIOP",
  ..."ASDFGHJKL",
  "ENTER",
  ..."ZXCVBNM",
  "DEL"
];

// Create on-screen keyboard
keys.forEach(key => {
  const keyBtn = document.createElement("div");
  keyBtn.textContent = key;
  keyBtn.classList.add("key");
  keyBtn.addEventListener("click", () => handleKey(key));
  keyboard.appendChild(keyBtn);
});

// Allow physical keyboard input too
document.addEventListener("keydown", (e) => {
  let key = e.key.toUpperCase();
  if (key === "BACKSPACE") key = "DEL";
  if (key === "ENTER") key = "ENTER";
  if (/^[A-Z]$/.test(key) || key === "ENTER" || key === "DEL") {
    handleKey(key);
  }
});

function handleKey(key) {
  if (currentRow >= 6) return;

  if (key === "DEL") {
    if (currentCol > 0) {
      currentCol--;
      guesses[currentRow][currentCol] = "";
      updateBoard();
    }
    return;
  }

  if (key === "ENTER") {
    if (currentCol === 5) {
      checkGuess();
    }
    return;
  }

  // Letter input
  if (currentCol < 5) {
    guesses[currentRow][currentCol] = key;
    currentCol++;
    updateBoard();
  }
}

function updateBoard() {
  const tiles = document.querySelectorAll(".tile");
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      tiles[r * 5 + c].textContent = guesses[r][c];
    }
  }
}

function checkGuess() {
  const guess = guesses[currentRow].join("").toLowerCase();

  if (guess.length < 5) return;

  const tiles = document.querySelectorAll(".tile");
  const secret = secretWord.split("");

  // Mark each tile as correct/present/absent
  for (let i = 0; i < 5; i++) {
    const tile = tiles[currentRow * 5 + i];
    tile.classList.remove("correct", "present", "absent");

    if (guess[i] === secretWord[i]) {
      tile.classList.add("correct");
    } else if (secret.includes(guess[i])) {
      tile.classList.add("present");
    } else {
      tile.classList.add("absent");
    }
  }

  if (guess === secretWord) {
    setTimeout(() => alert("🎉 You won! The word was " + secretWord.toUpperCase()), 100);
    currentRow = 6; // end game
    return;
  }

  currentRow++;
  currentCol = 0;

  if (currentRow === 6) {
    setTimeout(() => alert("Game over! The word was " + secretWord.toUpperCase()), 100);
  }
}

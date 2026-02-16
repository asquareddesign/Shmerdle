// Word list
const words = [
    "apple","grape","pearl","house","table","chair","smile",
    "bread","crane","stone","flame","dream","light","brave",
    "plant","spice","sweet","cloud","water","sound"
  ];
  
  // Pick random secret word
  const secretWord = words[Math.floor(Math.random() * words.length)];
  
  let currentRow = 0;
  let currentCol = 0;
  let guesses = Array.from({ length: 6 }, () => Array(5).fill(""));
  
  const board = document.getElementById("game-board");
  const keyboard = document.getElementById("keyboard");
  
  // Create board tiles
  for (let i = 0; i < 30; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    board.appendChild(tile);
  }
  
  // Keyboard layout
  const keys = [..."QWERTYUIOP","ASDFGHJKL","ENTER",..."ZXCVBNM","DEL"];
  
  keys.forEach(key => {
    const keyBtn = document.createElement("div");
    keyBtn.textContent = key;
    keyBtn.classList.add("key");
    keyBtn.addEventListener("click", () => handleKey(key));
    keyboard.appendChild(keyBtn);
  });
  
  // Allow physical keyboard input
  document.addEventListener("keydown", e => {
    let key = e.key.toUpperCase();
    if (key === "BACKSPACE") key = "DEL";
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
      if (currentCol === 5) checkGuess();
      return;
    }
  
    if (currentCol < 5) {
      guesses[currentRow][currentCol] = key;
      currentCol++;
      updateBoard();
    }
  }
  
  // Update board letters + typing pop animation
  function updateBoard() {
    const tiles = document.querySelectorAll(".tile");
  
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 5; c++) {
        const tile = tiles[r * 5 + c];
        const letter = guesses[r][c];
        tile.textContent = letter;
  
        if (letter !== "") {
          tile.classList.add("pop");
          setTimeout(() => tile.classList.remove("pop"), 150);
        }
      }
    }
  }
  
  // Reveal colors correctly and at right timing
  function checkGuess() {
    const guess = guesses[currentRow].join("").toLowerCase();
    if (guess.length !== 5) return;
  
    const tiles = document.querySelectorAll(".tile");
    const rowToReveal = currentRow; // freeze row
  
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const tile = tiles[rowToReveal * 5 + i];
  
        tile.classList.remove("correct","present","absent");
  
        if (guess[i] === secretWord[i]) {
          tile.classList.add("correct");
        } else if (secretWord.includes(guess[i])) {
          tile.classList.add("present");
        } else {
          tile.classList.add("absent");
        }
      }, i * 350);
    }
  
    // move to next row AFTER reveal
    setTimeout(() => {
      if (guess === secretWord) {
        alert("🎉 You won!");
        currentRow = 6;
        return;
      }
  
      currentRow++;
      currentCol = 0;
  
      if (currentRow === 6) {
        alert("Game over! The word was " + secretWord.toUpperCase());
      }
    }, 5 * 350 + 100);
  }
  
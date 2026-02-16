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
  
  // Keyboard layout - FIXED
  const keyboardRows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","DEL"]
  ];
  
  keyboardRows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    
    row.forEach(key => {
      const keyBtn = document.createElement("div");
      keyBtn.textContent = key;
      keyBtn.classList.add("key");
      keyBtn.dataset.key = key;
      keyBtn.addEventListener("click", () => handleKey(key));
      rowDiv.appendChild(keyBtn);
    });
    
    keyboard.appendChild(rowDiv);
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
  
        if (letter !== "" && r === currentRow && c === currentCol - 1) {
          tile.classList.add("pop");
          setTimeout(() => tile.classList.remove("pop"), 150);
        }
      }
    }
  }
  
  // Reveal colors correctly with proper letter counting
  function checkGuess() {
    const guess = guesses[currentRow].join("").toLowerCase();
    if (guess.length !== 5) return;
  
    const tiles = document.querySelectorAll(".tile");
    const rowToReveal = currentRow;
    
    // Count letters in secret word for proper yellow/green logic
    const letterCount = {};
    for (let char of secretWord) {
      letterCount[char] = (letterCount[char] || 0) + 1;
    }
    
    const result = Array(5).fill("");
    
    // First pass: mark correct (green)
    for (let i = 0; i < 5; i++) {
      if (guess[i] === secretWord[i]) {
        result[i] = "correct";
        letterCount[guess[i]]--;
      }
    }
    
    // Second pass: mark present (yellow)
    for (let i = 0; i < 5; i++) {
      if (result[i] === "") {
        if (letterCount[guess[i]] > 0) {
          result[i] = "present";
          letterCount[guess[i]]--;
        } else {
          result[i] = "absent";
        }
      }
    }
  
    // Animate tiles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const tile = tiles[rowToReveal * 5 + i];
        tile.classList.add("flip");
        
        setTimeout(() => {
          tile.classList.remove("correct","present","absent");
          tile.classList.add(result[i]);
          
          // Update keyboard colors
          updateKeyboard(guess[i].toUpperCase(), result[i]);
        }, 250);
      }, i * 350);
    }
  
    // Move to next row AFTER reveal
    setTimeout(() => {
      if (guess === secretWord) {
        setTimeout(() => alert("🎉 You won!"), 100);
        currentRow = 6;
        return;
      }
  
      currentRow++;
      currentCol = 0;
  
      if (currentRow === 6) {
        setTimeout(() => alert("Game over! The word was " + secretWord.toUpperCase()), 100);
      }
    }, 5 * 350 + 100);
  }
  
  function updateKeyboard(letter, status) {
    const key = document.querySelector(`[data-key="${letter}"]`);
    if (!key) return;
    
    // Don't downgrade correct to present or absent
    if (key.classList.contains("correct")) return;
    if (status === "present" && key.classList.contains("correct")) return;
    
    key.classList.remove("correct", "present", "absent");
    key.classList.add(status);
  }
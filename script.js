
const words = [
  { word: "shadow", hint: "A dark shape made when something blocks light." },
  { word: "castle", hint: "A fortified building often associated with kings." },
  { word: "forest", hint: "A large area filled with trees." },
  { word: "planet", hint: "A large object that orbits a star." },
  { word: "puzzle", hint: "Something you solve using logic." },
  { word: "dragon", hint: "A mythical creature that often breathes fire." },
  { word: "guitar", hint: "A musical instrument with strings." },
  { word: "island", hint: "Land completely surrounded by water." },
  { word: "thunder", hint: "The loud sound that follows lightning." },
  { word: "library", hint: "A place where you can borrow books." },
  { word: "mystery", hint: "Something difficult to explain or understand." },
  { word: "monster", hint: "A frightening imaginary creature." },
  { word: "lantern", hint: "A portable light inside a protective case." },
  { word: "vampire", hint: "A legendary creature that drinks blood." },
  { word: "skeleton", hint: "The framework of bones inside a body." },
  { word: "nightmare", hint: "A frightening dream." },
  { word: "corridor", hint: "A passage connecting rooms in a building." },
  { word: "footprint", hint: "A mark left by someone's foot." },
  { word: "whisper", hint: "To speak very quietly." },
  { word: "phantom", hint: "A ghostly or mysterious apparition." }
];

const wordElement = document.getElementById("word");
const hintElement = document.getElementById("hint");
const messageElement = document.getElementById("message");
const keyboardElement = document.getElementById("keyboard");
const mistakesElement = document.getElementById("mistakes");
const newGameButton = document.getElementById("new-game");
const bodyParts = document.querySelectorAll(".part");

let answer = "";
let hint = "";
let guessedLetters = [];
let mistakes = 0;
let gameOver = false;

function startGame() {
  // Choose a random word and hint.
  const choice = words[Math.floor(Math.random() * words.length)];

  answer = choice.word;
  hint = choice.hint;
  guessedLetters = [];
  mistakes = 0;
  gameOver = false;

  hintElement.textContent = hint;
  mistakesElement.textContent = mistakes;
  messageElement.textContent = "Choose a letter to begin.";
  messageElement.className = "message";

  // Hide every part of the hangman.
  bodyParts.forEach((part) => {
    part.classList.remove("visible");
  });

  // Draw the empty word and reset the buttons.
  renderWord();
  renderKeyboard();
}

function renderWord() {
  wordElement.replaceChildren();

  for (const letter of answer) {
    const slot = document.createElement("span");
    slot.className = "letter-slot";

    if (guessedLetters.includes(letter) || gameOver) {
      slot.textContent = letter;
    } else {
      slot.textContent = "";
    }

    wordElement.appendChild(slot);
  }
}

function renderKeyboard() {
  keyboardElement.replaceChildren();

  for (let code = 65; code <= 90; code++) {
    const letter = String.fromCharCode(code).toLowerCase();
    const button = document.createElement("button");

    button.type = "button";
    button.className = "letter-button";
    button.textContent = letter.toUpperCase();
    button.setAttribute("aria-label", letter);

    if (guessedLetters.includes(letter)) {
      button.disabled = true;
      button.classList.add(
        answer.includes(letter) ? "correct" : "wrong"
      );
    }

    if (gameOver) {
      button.disabled = true;
    }

    button.addEventListener("click", () => guessLetter(letter));
    keyboardElement.appendChild(button);
  }
}

function guessLetter(letter) {
  if (gameOver || guessedLetters.includes(letter)) {
    return;
  }

  guessedLetters.push(letter);

  if (answer.includes(letter)) {
    messageElement.textContent = "Good guess! That letter is in the word.";
  } else {
    mistakes++;
    mistakesElement.textContent = mistakes;

    const part = document.querySelector(
      `.part[data-part="${mistakes}"]`
    );

    if (part) {
      part.classList.add("visible");
    }

    messageElement.textContent = "Wrong letter! Try another.";
  }

  // Check whether the player has won or lost.
  if ([...answer].every((letter) => guessedLetters.includes(letter))) {
    finishGame(true);
  } else if (mistakes >= 6) {
    finishGame(false);
  }

  renderWord();
  renderKeyboard();
}

function finishGame(won) {
  gameOver = true;

  if (won) {
    messageElement.textContent = "You won! You guessed the word!";
    messageElement.className = "message win";
  } else {
    messageElement.textContent =
      `Game over! The word was "${answer.toUpperCase()}".`;
    messageElement.className = "message loss";
  }
}

// Allow players to use their physical keyboard too.
document.addEventListener("keydown", (event) => {
  if (/^[a-z]$/i.test(event.key)) {
    guessLetter(event.key.toLowerCase());
  }
});

// Start a fresh round when the button is clicked.
newGameButton.addEventListener("click", startGame);

// Start the first round immediately.
startGame();
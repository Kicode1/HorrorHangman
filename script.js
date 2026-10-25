
const words = [
    { word: "shadow", hint: "A dark shape made when something blocks light." },
    { word: "castle", hint: "A fortress where royalty once lived." },
    { word: "forest", hint: "A place where the trees hide the sunlight." },
    { word: "planet", hint: "A world orbiting a star." },
    { word: "puzzle", hint: "Something you must solve." },
    { word: "dragon", hint: "A mythical creature that breathes fire." },
    { word: "guitar", hint: "An instrument with strings." },
    { word: "island", hint: "Land surrounded entirely by water." },
    { word: "thunder", hint: "A sound that follows lightning." },
    { word: "library", hint: "A place filled with books." },
    { word: "mystery", hint: "Something that cannot easily be explained." },
    { word: "monster", hint: "A frightening imaginary creature." },
    { word: "lantern", hint: "A portable source of light." },
    { word: "vampire", hint: "A legendary creature that drinks blood." },
    { word: "skeleton", hint: "The bones that form a body's framework." },
    { word: "nightmare", hint: "A frightening dream." },
    { word: "corridor", hint: "A long passage connecting rooms." },
    { word: "footprint", hint: "A mark left by a foot." },
    { word: "whisper", hint: "Speaking in a very quiet voice." },
    { word: "phantom", hint: "A ghostly apparition." }
];

const wordElement = document.getElementById("word");
const hintElement = document.getElementById("hint");
const messageElement = document.getElementById("message");
const keyboardElement = document.getElementById("keyboard");
const mistakesElement = document.getElementById("mistakes");
const newGameButton = document.getElementById("new-game");
const bodyParts = document.querySelectorAll(".part");

let answer = "";
let guessedLetters = [];
let mistakes = 0;
let gameOver = false;
let previousWord = "";

function startGame() {
    let choice;

    // Avoid repeating the previous word when possible.
    do {
        choice = words[Math.floor(Math.random() * words.length)];
    } while (words.length > 1 && choice.word === previousWord);

    answer = choice.word;
    previousWord = answer;
    guessedLetters = [];
    mistakes = 0;
    gameOver = false;

    hintElement.textContent = choice.hint;
    mistakesElement.textContent = "0";
    messageElement.textContent =
        "The connection is open. Choose a letter.";
    messageElement.className = "message";

    document.body.classList.remove("danger", "shake");

    bodyParts.forEach((part) => {
        part.classList.remove("visible");
    });

    renderWord();
    renderKeyboard();
}

function renderWord() {
    wordElement.replaceChildren();

    for (const letter of answer) {
        const slot = document.createElement("span");
        slot.className = "letter-slot";

        if (guessedLetters.includes(letter) || gameOver) {
            slot.textContent = letter.toUpperCase();
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
        messageElement.textContent = "The signal responds. Correct letter.";
    } else {
        mistakes++;
        mistakesElement.textContent = mistakes;

        const part = document.querySelector(
            `.part[data-part="${mistakes}"]`
        );

        if (part) {
            part.classList.add("visible");
        }

        // Increase the horror as mistakes accumulate.
        if (mistakes >= 2) {
            document.body.classList.add("danger");
        }

        // Retrigger the shake animation on every wrong guess.
        document.body.classList.remove("shake");
        void document.body.offsetWidth;
        document.body.classList.add("shake");

        messageElement.textContent =
            mistakes >= 4
                ? "IT IS GETTING CLOSER. THINK CAREFULLY."
                : "Wrong letter. Something moves in the dark.";

        if (mistakes === 6) {
            document.body.classList.add("danger");
        }
    }

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
        messageElement.textContent =
            "YOU SURVIVED. But the signal has not disappeared.";
        messageElement.className = "message win";
    } else {
        messageElement.textContent =
            `SIGNAL LOST. The word was "${answer.toUpperCase()}".`;
        messageElement.className = "message loss";

        // Final visual effect when the player loses.
        document.body.classList.add("danger");
        document.body.classList.remove("shake");
        void document.body.offsetWidth;
        document.body.classList.add("shake");
    }
}

document.addEventListener("keydown", (event) => {
    if (/^[a-z]$/i.test(event.key)) {
        guessLetter(event.key.toLowerCase());
    }
});

newGameButton.addEventListener("click", startGame);

startGame();

let word = "";
let guessedLetters = [];
let mistakes = 0;
let words = [];

const categorySelect = document.getElementById("categorySelect");

for (const category in categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
}

function getWordsByType() {
    let result = [];
    if(categorySelect.value === "Mix") {
        for (const category in categories) {
            result.push(...categories[category]);
        };
    } else {
        result = categories[categorySelect.value];
    }
    words = result;
}

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("retryButton").addEventListener("click", () => {
    word = "";
    guessedLetters = [];
    mistakes = 0;
    document.getElementById("gameArea").style.display = "";
    document.getElementById("gameArea").classList.add("dnone");
    document.getElementById("wordInput").value = "";
    document.getElementById("startArea").classList.remove("dnone");
    updateTriedLetters()
});

document.getElementById("randomButton").addEventListener("click", () => {
    getWordsByType();
    word = generateRandomWord();
    startError.classList.add("dnone");
    document.getElementById("gameArea").classList.remove("dnone");
    document.getElementById("gameArea").style.display = "block";
    updateWordDisplay();
    document.getElementById("startArea").classList.add("dnone");
    mistakes = 0;
    guessedLetters = [];
    document.getElementById("message").textContent = "";
    updateHangman();
    updateTriedLetters();
});

function startGame() {
    word = document.getElementById("wordInput").value.toLowerCase();
    let startError = document.getElementById("startError");
    if (!word) {
        startError.innerText = "Please enter a word.";
        startError.classList.remove("dnone");
        return;
    }

    if(isValidText(word)) {
        startError.innerText = "Invalid characters!";
        startError.classList.remove("dnone");
        return;
    }

    startError.classList.add("dnone");
    document.getElementById("gameArea").classList.remove("dnone");
    document.getElementById("gameArea").style.display = "block";
    updateWordDisplay();
    document.getElementById("startArea").classList.add("dnone");
    mistakes = 0;
    guessedLetters = [];
    document.getElementById("message").textContent = "";
    updateHangman();
    updateTriedLetters();
}

function guessLetter(inputLetter) {
    if (mistakes === maxMistakes) {
        return;
    }

    const letter = inputLetter.toLowerCase();
    if (guessedLetters.includes(letter) || letter.length !== 1) {
        alert("You've already guessed this letter or it's invalid.");
        return;
    }
    guessedLetters.push(letter);
    updateTriedLetters();

    if (!word.includes(letter)) {
        mistakes++;
    }
    updateWordDisplay();
    updateHangman();
    checkGameStatus();
}

function updateWordDisplay() {
    const display = word.split("").map(letter => {
        if (letter === " ") return "\xa0";
        return guessedLetters.includes(letter) ? letter : "_";
    }).join(" ");
    
    document.getElementById("wordDisplay").textContent = display;
}

function updateHangman() {
    const canvas = document.getElementById("hangmanCanvas");
    const ctx = canvas.getContext("2d");


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mistakes > 0) {
        ctx.beginPath();
        ctx.moveTo(0, 180);
        ctx.lineTo(200, 180);
        ctx.stroke();
    }

    if (mistakes > 1) {
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(50, 180);
        ctx.stroke();
    }

    if (mistakes > 2) {
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(150, 50);
        ctx.stroke();
    }

    if (mistakes > 3) {
        ctx.beginPath();
        ctx.moveTo(50, 80);
        ctx.lineTo(80, 50);
        ctx.stroke();
    }

    if (mistakes > 4) {
        ctx.beginPath();
        ctx.moveTo(150, 50);
        ctx.lineTo(150, 70);
        ctx.stroke();
    }

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    if (mistakes > 5) {
        ctx.beginPath();
        ctx.arc(150, 90, 20, 0, Math.PI * 2, true);
        ctx.stroke();
    }
    if (mistakes > 6) {
        ctx.moveTo(150, 110);
        ctx.lineTo(150, 140);
        ctx.stroke();
    }
    if (mistakes > 7) {
        ctx.moveTo(150, 120);
        ctx.lineTo(120, 100);
        ctx.stroke();
    }
    if (mistakes > 8) {
        ctx.moveTo(150, 120);
        ctx.lineTo(180, 100);
        ctx.stroke();
    }
    if (mistakes > 9) {
        ctx.moveTo(150, 140);
        ctx.lineTo(130, 160);
        ctx.stroke();
    }
    if (mistakes > 10) {
        ctx.moveTo(150, 140);
        ctx.lineTo(170, 160);
        ctx.stroke();
    }
}


function checkGameStatus() {
    if (mistakes === maxMistakes) {
        document.getElementById("message").innerHTML = "<h3>You lost!<br>The correct word was:<br>" + word + "</h3>";
    } else if (!document.getElementById("wordDisplay").textContent.includes("_")) {
        document.getElementById("message").innerHTML = "<h3>Congratulations, you won!</h3>";
    }
}

function isValidText(input) {
    return !alphabetRegex.test(input);
}

function generateRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function updateTriedLetters() {
    const alphabetContainer = document.getElementById("alphabet");
    alphabetContainer.innerHTML = "";

    alphabet.forEach(letter => {
        const letterElement = document.createElement("span");
        letterElement.textContent = letter;
        letterElement.className = "letter";
        letterElement.onclick = () => guessLetter(letter);
        if(guessedLetters.includes(letter.toLowerCase())) {
            if (word.includes(letter.toLowerCase())) {
                letterElement.classList.add("correct");
            } else {
                letterElement.classList.add("incorrect");
            }
        }
        alphabetContainer.appendChild(letterElement);
    });
}
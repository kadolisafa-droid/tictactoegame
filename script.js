const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const popup = document.getElementById("popup");
const winnerMessage = document.getElementById("winner-message");
const newGameButton = document.getElementById("new-game");

let currentPlayer = "X";
let startingPlayer = "X";
let gameActive = true;

let board = ["", "", "", "", "", "", "", "", ""];

// Audio
let audioContext;

function getAudioContext() {
    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioContext) {
        audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}

// Pop sound for X and O clicks
function playPopSound() {

    const audio = getAudioContext();

    if (!audio) return;

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    const time = audio.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(300, time);
    oscillator.frequency.exponentialRampToValueAtTime(
        80, time + 0.12
    );

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(
        0.25, time + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
        0.001, time + 0.13
    );

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.start(time);
    oscillator.stop(time + 0.14);
}

// Happy winning sound
function playWinSound() {

    const audio = getAudioContext();

    if (!audio) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((frequency, index) => {

        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        const time = audio.currentTime + index * 0.15;

        oscillator.type = "triangle";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(
            0.15, time + 0.03
        );
        gain.gain.exponentialRampToValueAtTime(
            0.001, time + 0.3
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start(time);
        oscillator.stop(time + 0.35);

    });
}

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle cell clicks
cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index = Number(cell.dataset.index);

        if (board[index] !== "" || !gameActive) {
            return;
        }

        playPopSound();

        board[index] = currentPlayer;

        cell.textContent = currentPlayer;
        cell.disabled = true;

        checkWinner();

    });

});

// Check winner
function checkWinner() {

    const winningCombination =
        winningCombinations.find(combination => {

            const [a, b, c] = combination;

            return (
                board[a] !== "" &&
                board[a] === board[b] &&
                board[b] === board[c]
            );

        });

    if (winningCombination) {

        gameActive = false;

        // Winner starts the next game
        startingPlayer = currentPlayer;

        playWinSound();

        winnerMessage.textContent =
            "🎉 Player " + currentPlayer + " Wins!";

        winningCombination.forEach(index => {
            cells[index].classList.add("winner");
        });

        statusText.textContent = "Game Over!";

        popup.classList.remove("hidden");

    }

    else if (board.every(cell => cell !== "")) {

        gameActive = false;

        winnerMessage.textContent = "🤝 It's a Draw!";

        statusText.textContent = "Game Over!";

        popup.classList.remove("hidden");

    }

    else {

        currentPlayer =
            currentPlayer === "X" ? "O" : "X";

        statusText.textContent =
            "Player " + currentPlayer + "'s Turn";

    }

}

// Start next game
newGameButton.addEventListener("click", () => {

    // Start with the previous game's winner
    currentPlayer = startingPlayer;

    gameActive = true;

    board = ["", "", "", "", "", "", "", "", ""];

    statusText.textContent =
        "Player " + currentPlayer + "'s Turn";

    cells.forEach(cell => {

        cell.textContent = "";
        cell.disabled = false;
        cell.classList.remove("winner");

    });

    popup.classList.add("hidden");

});



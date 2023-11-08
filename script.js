function board() {
    const gameArray = [];
    const rows = 3;
    const cols = 3;

    let newGame = () => {
        let counter = 0;
        isGameOver = false;

        for (let i = 0; i < rows; i++) {
            gameArray[i] = [];
            for (let z = 0; z < cols; z++) {
                gameArray[i].push(counter);
                counter++;
            }
        }
    };

    let recordMove = (index, currentPlayerPiece) => {
        let row = Math.floor(index / 3);
        let col = index % 3;

        gameArray[row][col] = currentPlayerPiece;
    };

    let updateScreen = (dataArray) => {
        let counter = 0;

        for (let i = 0; i < 3; i++) {
            for (let z = 0; z < 3; z++) {
                if (isNaN(gameArray[i][z])) {
                    gameSetUp.items.forEach((element, index) => {
                        if (index === counter)
                            element.innerHTML = gameArray[i][z];
                    });
                }
                counter++;
            }
        }
    };

    let isGameOver = false;

    const gameResult = () => isGameOver;

    let gameStatus = (name) => {
        let nameDiv = document.querySelector('.name-bar');

        // Checks the rows
        for (let i = 0; i < gameArray.length; i++) {
            let rowItems = gameArray[i];
            if (
                rowItems.every((item) => item === rowItems[0]) &&
                isNaN(rowItems[0])
            ) {
                isGameOver = true;
                nameDiv.innerHTML = `${name} Wins`;
                return;
            }
        }

        // Checks the columns
        for (let i = 0; i < gameArray[0].length; i++) {
            let col = gameArray.map((item) => item[i]);
            if (col.every((item) => item === col[0]) && isNaN(col[0])) {
                nameDiv.innerHTML = `${name} Wins`;
                isGameOver = true;
                return;
            }
        }

        // Checks the diagonals
        let diagonal1 = [gameArray[0][0], gameArray[1][1], gameArray[2][2]];
        let diagonal2 = [gameArray[0][2], gameArray[1][1], gameArray[2][0]];
        if (
            (diagonal1.every((item) => item === diagonal1[0]) &&
                isNaN(diagonal1[0])) ||
            (diagonal2.every((item) => item === diagonal2[0]) &&
                isNaN(diagonal2[0]))
        ) {
            nameDiv.innerHTML = `${name} Wins`;
            isGameOver = true;
            return;
        }

        let isTie = gameArray.every((row) => {
            return row.every((item) => typeof item !== 'number');
        });

        if (isTie) {
            nameDiv.innerHTML = 'Tie Game';
            isGameOver = true;
            return;
        }
    };

    let getGameBoard = () => gameArray;

    newGame();
    return {
        newGame,
        recordMove,
        gameStatus,
        gameResult,
        getGameBoard,
        updateScreen,
    };
}

let playerManipulation = (() => {
    const gameBoard = board();

    function capitalFirstWord(value) {
        let words = value.split(' ');

        let newString = words.map((word) => {
            if (word.length === 0) {
                return;
            } else {
                return word[0].toUpperCase() + word.slice(1).toLowerCase();
            }
        });
        return newString.join(' ');
    }

    class Player {
        constructor(name, piece) {
            this._name = capitalFirstWord(name);
            this._piece = piece;
        }

        get name() {
            return this._name;
        }

        get piece() {
            return this._piece;
        }
    }

    class ComputerPlayer {
        constructor() {
            this._name = 'Computer';
            this._piece = 'O';
        }

        get name() {
            return this._name;
        }

        get piece() {
            return this._piece;
        }
    }

    let formEnterButton = document.getElementById('form-button');

    let players1;
    let players2;
    let Ai;
    let two_Player = false;

    formEnterButton.addEventListener('click', (e) => {
        if (two_Player) {
            let player1 = document.getElementById('X');
            let player2 = document.getElementById('O');

            let name1 = player1.value.trim();
            let name2 = player2.value.trim();

            players1 = new Player(name1, 'X');
            players2 = new Player(name2, 'O');

            activePlayer = players1;
        } else {
            let player1 = document.getElementById('X');
            let name1 = player1.value.trim();

            players1 = new Player(name1, 'X');

            activePlayer = players1;

            Ai = new ComputerPlayer();
        }
    });

    let activePlayer = players1;

    let getActivePlayer = () => activePlayer;
    let getIsTwoPlayer = () => two_Player;
    let newGamePosition = () => (activePlayer = players1);
    let getAi = () => Ai;

    const switchPlayerTurn = () => {
        if (gameBoard.gameResult()) {
            return;
        }

        if (two_Player) {
            activePlayer = activePlayer === players1 ? players2 : players1;
        } else {
            activePlayer = activePlayer === players1 ? Ai : players1;

            if (activePlayer.name === Ai.name) {
                setTimeout(() => {
                    gameControl().makeMove(gameBoard.getGameBoard());
                    gameBoard.gameStatus(Ai.name);
                    switchPlayerTurn();
                }, 500);
            }
        }
    };

    const switchPlayerCount = () => {
        two_Player = two_Player === false ? true : false;
    };

    return {
        getActivePlayer,
        switchPlayerCount,
        switchPlayerTurn,
        newGamePosition,
        getIsTwoPlayer,
        getAi,
        gameBoard,
    };
})();

function gameControl() {
    let activePlayer = playerManipulation.getActivePlayer;
    let gameBoard = playerManipulation.gameBoard;

    let playRound = (index) => {
        if (!isGameFinished()) {
            gameBoard.recordMove(index, activePlayer().piece);
            gameBoard.gameStatus(activePlayer().name);
            playerManipulation.switchPlayerTurn();
        }
    };

    let makeMove = (gameArray) => {
        let empty = [];
        let counter = 0;

        for (let i = 0; i < 3; i++) {
            for (let z = 0; z < 3; z++) {
                if (!isNaN(gameArray[i][z])) {
                    empty.push(counter);
                }
                counter++;
            }
        }

        if (empty.length > 0) {
            let randomIndex = Math.floor(Math.random() * empty.length);
            let move = empty[randomIndex];

            gameBoard.recordMove(move, playerManipulation.getAi().piece);
            gameBoard.updateScreen();
        } else {
            return -1;
        }
    };

    let resetGame = () => {
        playerManipulation.newGamePosition();
        gameBoard.newGame();
    };

    let isGameFinished = () => gameBoard.gameResult();

    function displayChoice(element) {
        element.innerHTML = playerManipulation.getActivePlayer().piece;
    }

    return {
        playRound,
        resetGame,
        isGameFinished,
        displayChoice,
        gameBoard,
        makeMove,
    };
}

const gameBoy = (() => {
    const game = gameControl();

    const gameBoard = document.querySelector('.game-board');
    let nameDiv = document.querySelector('.name-bar');

    const clickListener = () => {
        document.addEventListener('click', (e) => {
            if (gameSetUp.resetButton.contains(e.target)) {
                gameSetUp.resetButton.style.display = 'none';
                game.resetGame();
                gameSetUp.items.forEach((item) => (item.innerHTML = ''));
                nameDiv.innerHTML = '';
            }

            if (game.isGameFinished()) {
                return;
            } else {
                if (gameBoard && gameBoard.contains(e.target)) {
                    let gameItem = e.target.closest('div');
                    gameSetUp.resetButton.style.display = 'block';

                    gameSetUp.items.forEach((element, index) => {
                        if (element === gameItem) {
                            if (!element.innerHTML) {
                                game.displayChoice(element);
                                game.playRound(index);
                            }
                        }
                    });
                }
            }
        });
    };

    clickListener();
})();

let gameSetUp = (() => {
    let resetButton = document.querySelector('.reset-button');
    let playerButtons = document.querySelectorAll('.player-choice button');
    let playerButtonContainer = document.querySelector('.player-choice');
    let namesContainer = document.querySelector('.player-name-container');
    let floatGameName = document.querySelector('.game-name2');
    let greetingContainer = document.querySelector('.greeting-menu');
    let board = document.querySelector('.game-board');
    let leftArrow = document.querySelector('.svg-button');
    let inputElements = document.querySelectorAll('input');
    let items = document.querySelectorAll('.game-board div');

    let game = gameControl();

    playerButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (e.target.innerHTML === 'Two Player') {
                playerManipulation.switchPlayerCount();

                let player_2 = document.getElementById('O');
                player_2.setAttribute('required', 'required');

                playerButtonContainer.classList.remove('visible');
                playerButtonContainer.classList.add('hidden');

                namesContainer.classList.remove('hidden');
                namesContainer.classList.add('visible');

                leftArrow.classList.remove('hidden');
                leftArrow.classList.add('visible');

                setTimeout(() => {
                    playerButtonContainer.style.display = 'none';
                }, 680);
            } else if (e.target.innerHTML === 'Single Player') {
                let player2 = document.querySelector('.player-2');
                player2.style.display = 'none';
                let player_2 = document.getElementById('O');
                player_2.removeAttribute('required');

                playerButtonContainer.classList.remove('visible');
                playerButtonContainer.classList.add('hidden');

                namesContainer.classList.remove('hidden');
                namesContainer.classList.add('visible');

                leftArrow.classList.remove('hidden');
                leftArrow.classList.add('visible');

                setTimeout(() => {
                    playerButtonContainer.style.display = 'none';
                }, 680);
            }
        });
    });

    namesContainer.addEventListener('submit', (e) => {
        e.preventDefault();
        greetingContainer.style.left = '-150%';
        board.classList.add('right-screen');

        floatGameName.classList.add('float-top-left');
    });

    leftArrow.addEventListener('click', () => {
        let player2 = document.querySelector('.player-2');

        playerButtonContainer.classList.remove('hidden');
        playerButtonContainer.classList.add('visible');

        namesContainer.classList.remove('visible');
        namesContainer.classList.add('hidden');

        leftArrow.classList.remove('visible');
        leftArrow.classList.add('hidden');

        inputElements.forEach((input) => {
            input.value = '';
        });

        setTimeout(() => {
            playerButtonContainer.style.display = 'flex';
            player2.style.display = 'revert';
        }, 680);
    });

    return { items, resetButton };
})();

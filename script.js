function board() {
    const gameArray = [];
    const rows = 3;
    const cols = 3;

    let newGame = () =>{
        let counter = 0;
        isGameOver = false;

        for (let i=0; i<rows; i++) {
            gameArray[i] = []
            for (let z=0; z<cols; z++) {
                gameArray[i].push(counter);
                counter++
            }
        }
    }

    let recordMove = (index, currentPlayer) =>{
        let row = Math.floor(index / 3);
        let col = index % 3;

        gameArray[row][col] = currentPlayer
    }


    let isGameOver = false;

    const gameResult = () => isGameOver;

    let gameStatus = (name) => {

        let nameDiv = document.querySelector('.name-bar')
        
        
            // Checks the rows
            for (let i=0; i < gameArray.length; i++) {
                let rowItems = gameArray[i];
                if (rowItems.every(item => item === rowItems[0]) && isNaN(rowItems[0]) ) {
                    isGameOver = true
                    nameDiv.innerHTML = `${name} Wins`
                    return
                }
            }

            // Checks the columns
            for (let i=0; i < gameArray[0].length; i++) {
                let col = gameArray.map(item => item[i])
                if (col.every(item => item === col[0]) && isNaN(col[0])){
                    nameDiv.innerHTML = `${name} Wins`
                    isGameOver = true 
                    return
                }
            }

            // Checks the diagonals
            let diagonal1 = [gameArray[0][0], gameArray[1][1], gameArray[2][2]];
            let diagonal2 = [gameArray[0][2], gameArray[1][1], gameArray[2][0]];
            if (diagonal1.every(item => item === diagonal1[0]) && isNaN(diagonal1[0]) ||
                (diagonal2.every(item => item === diagonal2[0]) && isNaN(diagonal2[0]))) {
                    nameDiv.innerHTML = `${name} Wins`
                    isGameOver = true
                    return
                }

            let isTie = gameArray.every(row => {
                return row.every(item => typeof item !== 'number');
            });

            if (isTie) {
                nameDiv.innerHTML = 'Tie Game'
                isGameOver = true
                return
        }
            
            
    }

    newGame()
    return { newGame, recordMove, gameStatus, gameResult }
}

function gameControl(
    playerOneName = 'Player 1',
    playerTwoName = 'Player 2',
) {
    const gameArray = board()

    const players = [
        {
          name: playerOneName,
          piece: 'X'
        },
        {
          name: playerTwoName,
          piece: 'O'
        }
      ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;
    
    let playRound = (element) => {
        gameArray.recordMove(element, getActivePlayer().piece)
        gameArray.gameStatus(activePlayer.name)
        switchPlayerTurn()
    }

    let resetGame = () =>{
        activePlayer = players[0]
        gameArray.newGame()
    }

    let thisForm = () => gameArray.gameResult()

    return {playRound, getActivePlayer, resetGame, thisForm }
}

const gameBoy = (() => {

    const game = gameControl()
    const initialBoard = board()

    
    const gameBoard = document.querySelector('.game-board')
    let items = document.querySelectorAll('.game-board div')

    let displayChoice = (element) => {
        if (!element.innerHTML){
            element.innerHTML = game.getActivePlayer().piece
        } else {return}
    }


    let nameDiv = document.querySelector('.name-bar')

    const clickListener = () =>{

        let resetButton = document.querySelector('.reset-button')

        document.addEventListener('click', (e) =>{

            if (resetButton.contains(e.target)) {

                resetButton.style.display = 'none'
                game.resetGame()
                items.forEach(item => item.innerHTML='')
                nameDiv.innerHTML=''
            }

            if (game.thisForm()) {

                return

            } else if (gameBoard && gameBoard.contains(e.target)) {
                
                let gameItem = e.target.closest('div')

                resetButton.style.display = 'block'
        
                items.forEach((element, index)  => {
                    if (element === gameItem) {
                        
                        if (element.innerHTML) {
                            return
                        } else {
                            displayChoice(element)
                            game.playRound(index)
                        }
                    }
                })
        
            }
        })
    } 

    clickListener()
})()



let gameSetUp = (() =>{
    let playerButtons = document.querySelectorAll('.player-choice button')
    let playerButtonContainer = document.querySelector('.player-choice')
    let namesContainer = document.querySelector('.player-name-container')
    let floatGameName = document.querySelector('.game-name2')
    let greetingContainer = document.querySelector('.greeting-menu')
    let board = document.querySelector('.game-board')

    playerButtons.forEach((button) =>{
        button.addEventListener('click', (e) =>{
            if (e.target.innerHTML === 'Two Player'){
                playerButtonContainer.classList.remove('visible')
                playerButtonContainer.classList.add('hidden')

                
                namesContainer.classList.remove('hidden')
                namesContainer.classList.add('visible')

                setTimeout(()=>{
                    playerButtonContainer.style.display='none'
                }, 680);
                
            }
        })
    })

    namesContainer.addEventListener('submit', (e) => {
        e.preventDefault()
        greetingContainer.style.left = '-150%'
        board.classList.add('right-screen')
        
        floatGameName.classList.add('float-top-left')
    })

})()







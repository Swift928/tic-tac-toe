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

function gameControl() { 
    const gameArray = board()
    let formEnterButton = document.getElementById('form-button')

    function capitalFirstWord(value){
        let words = value.split(' ')
    
        let newString = words.map( word =>{
            if (word.length === 0){
                return
            } else {
                return word[0].toUpperCase() + word.slice(1).toLowerCase()
            }
        })
        return newString.join(' ')
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

    let players1;
    let players2;

    formEnterButton.addEventListener('click', (e) => {

        let player1 = document.getElementById('X')
        let player2 = document.getElementById('O')
    
        let name1 = player1.value.trim();
        let name2 = player2.value.trim();

        if (!name1 || !name2) {
            alert('Please enter a name for both players.')
        }

        players1 = new Player(name1, 'X');
        players2 = new Player(name2, 'O');

        activePlayer = players1;
    })

    let activePlayer = players1;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players1 ? players2 : players1;
    };
    
    let playRound = (element) => {
        gameArray.recordMove(element, activePlayer.piece)
        gameArray.gameStatus(activePlayer.name)
        switchPlayerTurn()
    }

    let resetGame = () =>{
        activePlayer = players1
        gameArray.newGame()
    }

    let thisForm = () => gameArray.gameResult()

    function displayChoice (element) {
        element.innerHTML = (activePlayer.piece)
    }

    return {playRound, resetGame, thisForm, displayChoice }
}

const gameBoy = (() => {

    const game = gameControl()
    const initialBoard = board()

    const gameBoard = document.querySelector('.game-board')
    let items = document.querySelectorAll('.game-board div')

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
                        
                        if (!element.innerHTML) {
                            game.displayChoice(element)
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
    let leftArrow = document.querySelector('.svg-button')
    let inputElements = document.querySelectorAll('input')
    
    let game = gameControl()

    playerButtons.forEach((button) =>{
        button.addEventListener('click', (e) =>{
            if (e.target.innerHTML === 'Two Player'){
                playerButtonContainer.classList.remove('visible')
                playerButtonContainer.classList.add('hidden')
                
                namesContainer.classList.remove('hidden')
                namesContainer.classList.add('visible')

                leftArrow.classList.remove('hidden')
                leftArrow.classList.add('visible')

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

    leftArrow.addEventListener('click', () =>{
        playerButtonContainer.classList.remove('hidden')
        playerButtonContainer.classList.add('visible')
        
        namesContainer.classList.remove('visible')
        namesContainer.classList.add('hidden')

        leftArrow.classList.remove('visible')
        leftArrow.classList.add('hidden')

        inputElements.forEach((input) => {
            input.value = ""
        })

        setTimeout(()=>{
            playerButtonContainer.style.display='flex'
        }, 680);
    })


})()


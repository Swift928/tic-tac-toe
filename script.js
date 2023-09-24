// let gameBoard = (() => {
//     gameBoard= [
//         [],
//         [],
//         []
//     ]
// })()

document.addEventListener('click', (e) =>{
    let gameBoard = document.querySelector('.game-board')


    if (gameBoard && gameBoard.contains(e.target)) {

        let items = document.querySelectorAll('.game-board div')
        let gameItem = e.target.closest('div')

        items.forEach((element, index)  => {
            if (element === gameItem) {
                console.log(index)
            }
        })

        // console.log(e.target)
        // console.log(gameItem)
    }
})
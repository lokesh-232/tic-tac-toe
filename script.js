const board = ['', '', '', '', '', '', '', '', ''];
const human = 'O';
const ai = 'X';
let currentPlayer = human;

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleClick);
});
document.getElementById('restart').addEventListener('click', restartGame);

function handleClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] === '') {
        board[index] = human;
        updateBoard();
        if (!checkWin(board, human) && !isTie()) {
            currentPlayer = ai;
            aiMove();
        }
    }
}

function aiMove() {
    const bestMove = minimax(board, 0, -Infinity, Infinity, true);
    board[bestMove.index] = ai;
    updateBoard();
    currentPlayer = human;
}

function minimax(newBoard, depth, alpha, beta, isMaximizing) {
    const winner = checkWin(newBoard, human) || checkWin(newBoard, ai);
    if (winner === human) return { score: -10 + depth };
    if (winner === ai) return { score: 10 - depth };
    if (isTie()) return { score: 0 };

    if (isMaximizing) {
        let bestScore = -Infinity;
        let bestMove = null;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = ai;
                const score = minimax(newBoard, depth + 1, alpha, beta, false).score;
                newBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { index: i, score: bestScore };
                }
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break;
            }
        }
        return bestMove;
    } else {
        let bestScore = Infinity;
        let bestMove = null;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = human;
                const score = minimax(newBoard, depth + 1, alpha, beta, true).score;
                newBoard[i] = '';
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = { index: i, score: bestScore };
                }
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break;
            }
        }
        return bestMove;
    }
}

function checkWin(board, player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        if (pattern.every(index => board[index] === player)) {
            return player;
        }
    }
    return null;
}

function isTie() {
    return board.every(cell => cell !== '') && !checkWin(board, human) && !checkWin(board, ai);
}

function updateBoard() {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = board[index];
    });
    if (checkWin(board, human)) {
        setTimeout(() => alert('Human wins!'), 100);
        restartGame();
    } else if (checkWin(board, ai)) {
        setTimeout(() => alert('AI wins!'), 100);
        restartGame();
    } else if (isTie()) {
        setTimeout(() => alert('It\'s a tie!'), 100);
        restartGame();
    }
}

function restartGame() {
    board.fill('');
    currentPlayer = human;
    updateBoard();
}

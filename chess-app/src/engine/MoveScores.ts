import { PieceColor } from "../Constants";
import { Piece, BoardMap, PieceMap } from "../models";
import { findKing, nextTurn } from "../rules";
import Rules from "../rules/Rules";
type MovesScore = [string[], number];

export function worstCase(boardMap: BoardMap, color: PieceColor): number {
    const POV: number = color === PieceColor.WHITE ? -1 : 1;
    let worstEval = 1000*POV;
    for (let [_board, evaluation] of boardMap.values()) {
        if (color === PieceColor.BLACK && evaluation < worstEval) {
            worstEval = evaluation;
        }
        else if (color === PieceColor.WHITE && evaluation > worstEval) {
            worstEval = evaluation;
        }
    }
    return worstEval;
}

function miniMax(movesEval: MovesScore[], color: PieceColor): number {
    const POV: number = color === PieceColor.WHITE ? -1 : 1;
    let worstEval = 1000*POV;
    movesEval.forEach(moveEval => {
        const evaluation = moveEval[1];
        if (color === PieceColor.BLACK && evaluation < worstEval) {
            worstEval = evaluation;
        }
        else if (color === PieceColor.WHITE && evaluation > worstEval) {
            worstEval = evaluation;
        }
    });
    return worstEval; 
} 

function boardsToScores(boardMap: BoardMap, color: PieceColor): MovesScore[] {
    const moveScore: MovesScore[] = new Array();
    for (const [move, [_board, evaluation]] of boardMap) {
        moveScore.push([[move], evaluation]);
    }
    return moveScore;
}

export function scoreMoves(
    lines: MovesScore[],
    boardMap: BoardMap, 
    depth: number,
    turn: PieceColor,
    kingKey: string,
    nextKey: string,
): MovesScore[]{
    //const rules = Rules;
    if (depth <= 0) {
        const score: number = worstCase(boardMap, turn);
        lines.forEach(moveScore => {
            moveScore = [moveScore[0], score] 
        });
        return lines;
    }
    for (let moveScore = lines.pop(); (moveScore); moveScore = lines.pop()) {
        const move = moveScore[0].pop();
    }
    return lines;
}

export function doubleMoves(boardMap: BoardMap, color: PieceColor): MovesScore[] {
    const rules = new Rules;
    const POV: number = color === PieceColor.WHITE ? 1 : -1;
    const nextColor = nextTurn(color);
    let totalMoveScores:MovesScore[] = new Array();
    for (let [move1, [board1, _evaluation1]] of boardMap) { //generate all attacks
        let move1Scores:MovesScore[] = new Array();         //the worst possible outcome of each enemy move given best play
        const kingKey = findKing(board1, "e1", nextColor);
        const king: Piece = board1.get(kingKey)!;
        const [_newPieceMap2, newBoards2] = rules.populateValidMoves(board1, nextColor, king);
        for (let [move2, [board2, _evaluation2]] of newBoards2) {
            let move2Scores:MovesScore[] = new Array();
            const kingKey = findKing(board2, "e1", color);
            const king: Piece = board2.get(kingKey)!;
            const [_newPieceMap3, newBoards3] = rules.populateValidMoves(board2, color, king);
            //miniMax
            let move3Scores: MovesScore[] = boardsToScores(newBoards3, color); //the first conversion
            const scoreThird: number = miniMax(move3Scores, nextColor); //maximum branches, find the worst result possible if move2
            //now the bottom branch has its worst value stored
            //move2Scores represents all the possible moves we could make defined by max danger
            for (let [move3, [_board3, _evaluation3]] of newBoards3) {
                move2Scores.push([[move2, move3], scoreThird]); //defining move by the max strength response for second move
            }
            const scoreSecond: number = miniMax(move2Scores, color); //find our best response by minimizing the enemy advatage
            move2Scores = move2Scores.map(moveScore => {
                return [[move1, ...moveScore[0]], scoreSecond]
            });
            move1Scores.push(...move2Scores);
        }
        const scoreFirst: number = miniMax(move1Scores, nextColor);
        move1Scores = move1Scores.map(moveScore => {
            return [moveScore[0], scoreFirst];
        });
        totalMoveScores.push(...move1Scores);
    }
    totalMoveScores.sort(function(a, b){
        return (a[1] - b[1])*POV;
    });
    return totalMoveScores;
}
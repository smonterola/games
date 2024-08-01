import { PieceColor } from "../Constants";
import { Piece, BoardMap, PieceMap } from "../models";
import { findKing, nextTurn } from "../rules";
import Rules from "../rules/Rules";
import { Deque } from "./Deque";

type MovesScore = [string[], number];
type Moves = string[];

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

export function createDeque(boardMap: BoardMap): Deque {
    let deque = new Deque;
    for (const [move, [_, evaluation]] of boardMap) {
        deque.pushBack([[move], 0, evaluation]);
    }
    return deque;
}

export function createArray(boardMap: BoardMap): Array<[string[], number, number]> {
    let array = new Array();
    for (const [move, [_, evaluation]] of boardMap) {
        array.push([[move], 0, evaluation]);
    }
    return array; 
}

export function scoreMoves(
    lines: Deque,
    boardMap: BoardMap, 
    depth: number,
    turn: PieceColor,
    kingKey: string,
    nextKey: string,
): Deque {
    const rules = new Rules;
    if (depth <= 0) return lines;
    while (1) {
        const line = lines.popFront();
        if (line === undefined) {
            break;
        }
        const [moves, iteration, _score] = line;
        if (iteration === depth) {
            lines.pushFront(line);
            break;
        }
        const move: string = moves[0];
        if (!boardMap.has(move)) {
            continue;
        }
        const board: PieceMap = boardMap.get(move)![0]; //making the next board
        kingKey = findKing(board, kingKey, nextTurn(turn));
        const king: Piece = board.get(kingKey)!;
        const [_newPieceMap, nextBoardMap] = rules.populateValidMoves(board, nextTurn(turn), king);
        const lines2: Deque = createDeque(nextBoardMap);
        while(1) {
            const line2 = lines2.popFront();
            if (line2 === undefined) {
                break;
            }
            const [moves2, iteration, score] = line2;
            if (iteration === depth) {
                lines2.pushFront(line2);
                break;
            }
            const move2: string = moves2[0];
            if (!nextBoardMap.has(move2)) {
                continue;
            }
            const nextBoard: PieceMap = nextBoardMap.get(move2)![0]; //making the next board
            kingKey = findKing(nextBoard, kingKey, turn);
            const king: Piece = nextBoard.get(kingKey)!;
            const [_newPieceMap, nextBoardMap3] = rules.populateValidMoves(nextBoard, turn, king);
            const lines3: Deque = createDeque(nextBoardMap3);
            while(1) {
                const line3 = lines3.popFront();
                //console.log(line3)
                if (line3 === undefined) {
                    break;
                }
                const [moves3, iteration, score] = line3;
                if (iteration === depth) {
                    lines3.pushFront(line3);
                    console.log("breaking at depth")
                    break;
                }
                const move3: string = moves3[0];
                if (!nextBoardMap3.has(move3)) {
                    continue;
                } 
                
                lines.pushBack([[...moves, move2, move3], iteration+2, score]);
                //console.log("push")
            }
        }
    }
    return lines;
    for (const [move, [board, evaluation]] of boardMap) {
        if (depth <= 0) {
            const depthScore = worstCase(boardMap, turn);
            //lines.pop
        } else {
            kingKey = findKing(board, kingKey, turn);
            const king: Piece = board.get(kingKey)!;
            const [_newPieceMap, nextBoardMap] = rules.populateValidMoves(board, turn, king);
        }
    }
    return lines;
}

/* 
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
}*/

export function doubleMoves(boardMap: BoardMap, color: PieceColor): MovesScore[] {
    const rules = new Rules;
    const POV: number = color === PieceColor.WHITE ? 1 : -1;
    const nextColor = nextTurn(color);
    let totalMoveScores:MovesScore[] = new Array();
    for (let [move1, [board1, _evaluation1]] of boardMap) { //generate all attacks
        let move1Scores:MovesScore[] = new Array();         //the worst possible outcome of each enemy move given best play
        const kingKey = findKing(board1, "e1", nextColor);
        const king: Piece = board1.get(kingKey)!;
        const [_newPieceMap2, newBoards2] = rules.populateValidMoves(board1, nextColor, king); //possible boards from the enemy
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
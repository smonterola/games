import { PieceColor } from "../Constants";
import { Piece, BoardMap, PieceMap, getPOV } from "../models";
import { findKingKey, nextTurn } from "../rules";
import Rules from "../rules/Rules";
import { Deque } from "./Deque";

/*
export function scoreMoves(
    lines: Deque,
    boardMap: BoardMap, 
    depth: number,
    turn: PieceColor,
    kingKey: string,
    nextKey: string,
): Deque {
    const rules = new Rules();
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
}

export function createDeque(boardMap: BoardMap): Deque {
    let deque = new Deque();
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
}*/
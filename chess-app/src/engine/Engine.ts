import { GameState, PieceColor } from "../Constants";
import { BoardMap, Piece, PieceMap, getPOV } from "../models";
import { findKing } from "../rules";
import Rules from "../rules/Rules";
import { evaluate } from "./EvaluateBoard";
import { deepClone } from "../rules/History/Clone";
import { nextTurn } from "../rules";

type MovesScore = [string[], number];

export function miniMaxAlphaBeta(
    pieceMap: PieceMap, 
    depth: number,
    futile: number,
    alpha: number,
    beta: number,
    color: PieceColor,
    path: string[],
    kingKey: string,
    nextKing: string,
): MovesScore {
    const staticEvaluation = evaluate(pieceMap);
    if (depth <= 0) {
        return [path, staticEvaluation];
    }
    kingKey = findKing(pieceMap, kingKey, (color));
    const king: Piece = pieceMap.get(kingKey)!;
    const rules = new Rules();
    const [newPieceMap, nextBoards] = rules.populateValidMoves(pieceMap, (color), king);
    const status = rules.getStatus(nextBoards, newPieceMap, king);
    switch(status) {
        case GameState.CHECKMATE:
            return [path, 1000 * getPOV(color)];
        case GameState.STALEMATE:
            return [path, 0];
    }
    const size = newPieceMap.size;
    const futility: boolean = (depth <= futile) ? true : false
    let stop: number = 1;
    let bestPath: string[] = path;
    if (color === PieceColor.WHITE) {
        let maxEval = -4096;
        for (const [move, [board, dynamicEval]] of nextBoards) {
            //check for mate by finding the new king and checking if mate
            //let evaluation;
            //let moves: string[] = [...path, move];
            let stop = 1;
            if (futility) {
                if (board.size === size) {
                    stop = 0;
                } else {
                    continue; //if theres a last min capture, then stop because we need to always let the opponent respond
                }
            }
            const [moves, evaluation] = miniMaxAlphaBeta(
                board,            (depth-1)*stop,   futile,
                alpha,            beta,
                PieceColor.BLACK, path,
                nextKing,         kingKey,
            );
            maxEval = Math.max(maxEval, evaluation);
            if (maxEval > alpha) {
                alpha = maxEval;
                bestPath = [move, ...moves];
            }
            if (beta <= alpha) {
                break;
            }
        }
        return [bestPath, maxEval];
    } else { /* color === PieceColor.BLACK */
        let minEval = 4096;
        for (const [move, [board, dynamicEval]] of nextBoards) {
            //check for mate by finding the new king and checking if mate
            let stop = 1;
            if (futility) {
                if (board.size === size) {
                    stop = 0;
                } else {
                    continue; //if theres a last min capture, then stop because we need to always let the opponent respond
                }
            }
            const [moves, evaluation] = miniMaxAlphaBeta(
                board,            (depth-1)*stop,   futile,
                alpha,            beta,
                PieceColor.WHITE, path,
                nextKing,         kingKey,
            );
            //}
            minEval = Math.min(minEval, evaluation);
            if (minEval < beta) {
                beta = minEval;
                bestPath = [move, ...moves];
            }
            if (beta <= alpha) {
                break;
            }
        }
        return [bestPath, minEval];
    }
}

function sortMoves(boardMap: BoardMap) {
    let moves

}
/*

find the best move at each depth
one it is found let the next iteration use that key to find the 




*/
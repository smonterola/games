import { PieceColor } from "../Constants";
import { Piece, PieceMap, getPOV } from "../models";
import { findKing } from "../rules";
import Rules from "../rules/Rules";
import { evaluate } from "./EvaluateBoard";
import { deepClone } from "../rules/History/Clone";
import { nextTurn } from "../rules";

type MovesScore = [string[], number];

export function miniMaxAlphaBeta(
    pieceMap: PieceMap, 
    depth: number,
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
    const [, nextBoards] = new Rules().populateValidMoves(pieceMap, (color), king);
    if (nextBoards.size === 0) {
        return [path, 1000 * getPOV(color)];
    }

    let bestPath: string[] = path;
    if (color === PieceColor.WHITE) {
        let maxEval = -4096;
        for (const [move, [board, _dynamicEval]] of nextBoards) {
            //check for mate by finding the new king and checking if mate
            const [moves, evaluation] = miniMaxAlphaBeta(
                deepClone(board), depth - 1, 
                alpha,            beta,
                PieceColor.BLACK, [...path, move],
                nextKing,         kingKey,
            );
            maxEval = Math.max(maxEval, evaluation);
            if (evaluation >= alpha) {
                alpha = evaluation;
                bestPath = moves;
            }
            if (beta <= alpha) {
                break;
            }
            //console.log(path)
        }
        return [bestPath, maxEval];
    } else { /* color === PieceColor.BLACK */
        let minEval = 4096;
        for (const [move, [board, _dynamicEval]] of nextBoards) {
            //check for mate by finding the new king and checking if mate
            const [moves, evaluation] = miniMaxAlphaBeta(
                deepClone(board), depth - 1, 
                alpha,            beta,
                PieceColor.WHITE, [...path, move],
                nextKing,         kingKey,
            );
            minEval = Math.min(minEval, evaluation);
            if (evaluation <= beta) {
                beta = evaluation;
                bestPath = moves;
            }
            if (beta <= alpha) {
                break;
            }
            //console.log(path)
        }
        return [bestPath, minEval];
    }
}
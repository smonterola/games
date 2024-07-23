import { log } from "console";
import { Piece, PieceColor, PieceType } from "../Constants";
import { endgame, middleGame, threshold, pairsMiddle, pairsEnd, pairsThres } from "./evalConstants";
import { colorToInitial, pieceToInitial } from "../rules/pieceLogic";


export function evaluate(pieceMap: Map<string, Piece>): number {
    let evalutation: number = 0;
    let logPieceMap = new Map<string, number>(logPieces(pieceMap));
    let [pieceValues, pairValues] = [threshold, pairsThres];

    if (logPieceMap.get(
        colorToInitial(PieceColor.WHITE)+pieceToInitial(PieceType.QUEN)) === 
        logPieceMap.get(colorToInitial(PieceColor.BLACK)+pieceToInitial(PieceType.QUEN))
    ) {
        [pieceValues, pairValues] = logPieceMap.has(colorToInitial(PieceColor.WHITE)+pieceToInitial(PieceType.QUEN)) ? 
            [middleGame, pairsThres] : [endgame, pairsEnd];
    }
    for (const pieceColor of Object.values(PieceColor)) {
        let pieceScore = 0;
        const POV = pieceColor === PieceColor.WHITE ? 1 : -1;
        const colorInitial = colorToInitial(pieceColor);
        for (const pieceType of Object.values(PieceType)) {
            const key = colorInitial + pieceToInitial(pieceType);
            const pieceCount = logPieceMap.has(key) ? logPieceMap.get(key)! : 0; 
            const pieceValue = pieceValues.has(pieceType) ? pieceValues.get(pieceType)! * pieceCount : 0;
            const pairValue = pairValues.has(pieceType) ? pairValues.get(pieceType)! * (pieceCount-1) : 0;
            pieceScore += pieceValue + pairValue
        }
        evalutation += pieceScore * POV;
    }
    return Math.round(evalutation * 100) / 100;
}

export function logPieces(pieceMap: Map<string, Piece>): Map<string, number> {
    let logPieces = new Map<string, number>();
    for (let piece of pieceMap.values()) {
        const key = colorToInitial(piece.color)+pieceToInitial(piece.type)
        const count = 
            logPieces.has(key) ?
            logPieces.get(key) :
            0; 
        logPieces.set(key, count! + 1)
    }
    return logPieces;
}
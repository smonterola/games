import { Piece, PieceMap } from "../models";
import { PieceColor, PieceType } from "../Constants";
import { endgame, middleGame, threshold, pairsMiddle, pairsEnd, pairsThres } from "./evalConstants";

export function evaluate(pieceMap: PieceMap): number {
    let evalutation: number = 0;
    const logPieceMap = new Map<string, number>(logPieces(pieceMap));
    let [pieceValues, pairValues] = [threshold, pairsThres];
    if (logPieceMap.get(PieceColor.WHITE + PieceType.QUEN) === 
        logPieceMap.get(PieceColor.BLACK + PieceType.QUEN)
    ) {
        [pieceValues, pairValues] = logPieceMap.has(PieceColor.WHITE + PieceType.QUEN) ? 
            [middleGame, pairsMiddle] : [endgame, pairsEnd];
    }
    for (const pieceColor of Object.values(PieceColor)) {
        let pieceScore = 0;
        const POV = pieceColor === PieceColor.WHITE ? 1 : -1;
        for (const pieceType of Object.values(PieceType)) {
            const key = pieceColor + pieceType;
            const pieceCount = logPieceMap.has(key) ? 
                logPieceMap.get(key)! : 0; 
            const pieceValue = pieceValues.has(pieceType) ? 
                pieceValues.get(pieceType)! * pieceCount : 0;
            const pairValue = (pairValues.has(pieceType) && pieceCount > 0) ? 
                pairValues.get(pieceType)! * (pieceCount-1) : 0;
            pieceScore += pieceValue + pairValue;
        }
        evalutation += pieceScore * POV;
    }
    return Math.round(evalutation * 100) / 100;
}

export function logPieces(pieceMap: PieceMap): Map<string, number> {
    let logPieces = new Map<string, number>();
    for (let piece of pieceMap.values()) {
        const key = piece.color + piece.type;
        const count = 
            logPieces.has(key) ?
            logPieces.get(key) :
            0; 
        logPieces.set(key, count! + 1);
    }
    return logPieces;
}
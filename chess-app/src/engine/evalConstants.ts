import { PieceType } from "../Constants";

//this system is based on "Larry Laufman's 2021 system"

export const middleGame = new Map<PieceType, number>([
    [PieceType.PAWN, 0.8],
    [PieceType.ROOK, 4.7],
    [PieceType.NGHT, 3.2],
    [PieceType.BSHP, 3.3],
    [PieceType.QUEN, 9.4],
    [PieceType.KING, 512],
]);

export const threshold = new Map<PieceType, number>([
    [PieceType.PAWN, 0.9],
    [PieceType.ROOK, 4.8],
    [PieceType.NGHT, 3.2],
    [PieceType.BSHP, 3.3],
    [PieceType.QUEN, 9.4],
    [PieceType.KING, 512],
]);

export const endgame = new Map<PieceType, number>([
    [PieceType.PAWN, 1.0],
    [PieceType.ROOK, 5.3],
    [PieceType.NGHT, 3.2],
    [PieceType.BSHP, 3.3],
    [PieceType.QUEN, 9.4],
    [PieceType.KING, 512],
]);

export const pairsMiddle = new Map<PieceType, number>([
    [PieceType.BSHP, 0.3],
    [PieceType.ROOK,-0.2],
    [PieceType.QUEN, 0.0],
]);

export const pairsThres = new Map<PieceType, number>([
    [PieceType.BSHP, 0.4],
    [PieceType.ROOK, 0.1],
    [PieceType.QUEN,-0.7],
]);

export const pairsEnd = new Map<PieceType, number>([
    [PieceType.BSHP, 0.5],
    [PieceType.ROOK,-0.2],
    [PieceType.QUEN, 0.0],
]);
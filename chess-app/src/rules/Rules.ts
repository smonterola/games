import { Piece, Position } from "../models";
import { PieceType, PieceColor } from "../Constants";
import {
    mapMoves, movePawn,
    rookDirections, bishopDirections, knightDirections, queenDirections
} from "./pieceLogic"

export default class Rules {
    canMovePiece(
        p0: Position, //old
        p1: Position, //new
        pieceMap: Map<string, Piece>,
    ): boolean {
        const p0String = p0.stringPosition()
        const validMove = pieceMap.has(p0String) ? 
            pieceMap.get(p0String)!.moveMap?.has(p1.stringPosition()) : false;
        return validMove ? true : false;
    }

    populateValidMoves(
        color: PieceColor,
        pieceMap: Map<string, Piece>,
    ): Map<string, Piece> {
        for (var piece of pieceMap.values()) {
            if (piece.color === color) {
                //pass;
            }
            else {
                continue;
            }
            switch (piece.type) {
                case PieceType.PAWN: 
                    [piece.moveMap, piece.enPassant] = movePawn(piece.position, color, pieceMap);
                    break;
                case PieceType.BSHP:
                    piece.moveMap = mapMoves(piece.position, color, pieceMap, bishopDirections, false);
                    break;
                case PieceType.NGHT:
                    piece.moveMap = mapMoves(piece.position, color, pieceMap, knightDirections, true);
                    break;
                case PieceType.ROOK:
                    piece.moveMap = mapMoves(piece.position, color, pieceMap, rookDirections, false);
                    break;
                case PieceType.QUEN:
                    piece.moveMap = mapMoves(piece.position, color, pieceMap, queenDirections, false);
                    break;
                case PieceType.KING:
                    piece.moveMap = mapMoves(piece.position, color, pieceMap, queenDirections, true);
                    break;
            }
        }
        //console.log(validMoves)
        return pieceMap;
    }
}
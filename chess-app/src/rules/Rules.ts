import { Piece, PieceMap, Position } from "../models";
import { PieceType, PieceColor } from "../Constants";
import { mapMoves, movePawn } from "."
import { castle } from "./pieces/King";

export default class Rules {
    canMovePiece(
        p0: Position, //old
        p1: Position, //new
        pieceMap: PieceMap,
    ): boolean {
        const validMove = pieceMap.has(p0.string) ? 
            pieceMap.get(p0.string)!.moveMap?.has(p1.string) : false;
        return validMove ? true : false;
    }

    populateValidMoves(
        color: PieceColor,
        pieceMap: PieceMap,
    ): Map<string, Piece> {
        for (let piece of pieceMap.values()) {
            if (piece.color !== color) {
                piece.moveMap?.clear();
                continue;
            }
            if (piece.type === PieceType.PAWN) { 
                [piece.moveMap, piece.enPassant] = movePawn(piece.position, color, pieceMap);
            } else if (piece.type === PieceType.KING) {
                piece.moveMap = mapMoves(pieceMap, piece);
                piece.moveMap = castle(pieceMap, piece, piece.moveMap);
            } else {
                piece.moveMap = mapMoves(pieceMap, piece);
            }
        }
        return pieceMap;
    }
}
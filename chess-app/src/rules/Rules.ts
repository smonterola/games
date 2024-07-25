import { Piece, Position } from "../models";
import { PieceType, PieceColor } from "../Constants";
import { mapMoves, movePawn } from "./pieceLogic"

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
            if (piece.color !== color) {
                piece.moveMap?.clear();
                continue;
            }
            if (piece.type === PieceType.PAWN) { 
                [piece.moveMap, piece.enPassant] = movePawn(piece.position, color, pieceMap);
            } else {
                piece.moveMap = mapMoves(pieceMap, piece);
            }
        }
        //console.log(validMoves)
        return pieceMap;
    }
}
import { Piece, Position } from "../models";
import { 
    PieceType, 
    PieceColor, 
} from "../Constants";
import {
    mapMoves,
    rookDirections, 
    bishopDirections, 
    knightDirections, 
    queenDirections,
    movePawn,
} from "./pieceLogic"

export default class Rules {
    isValidMove(
        p0: Position,
        p1: Position,
        color: PieceColor,
        pieceMap: Map<string, Piece>,
    ): boolean {
        //if (!p0.checkBounds() || !p1.checkBounds()) return false; //do not move out of bounds
        return this.movePiece(p0, p1, this.validMoves(color, pieceMap));
    }

    movePiece(
        p0: Position, //old
        p1: Position, //new
        validMoves: Map<string, Map<string, Position>>,
    ) {
        return validMoves.get(p0.stringPosition())?.has(p1.stringPosition()) ? true : false;
    }

    validMoves(
        color: PieceColor,
        pieceMap: Map<string, Piece>,
    ): Map<string, Map<string, Position>> {
        const validMoves = new Map<string, Map<string, Position>>();
        for (var piece of pieceMap.values()) {
            if (piece.color === color) {
                //pass;
            }
            else {
                continue;
            }
            const p = piece.position;
            const pString = p.stringPosition();
            switch (piece.type) {
                case PieceType.PAWN: 
                    validMoves.set(pString, movePawn(p, color, pieceMap));
                    break;
                case PieceType.BSHP:
                    validMoves.set(pString, mapMoves(p, color, pieceMap, bishopDirections, false));
                    break;
                case PieceType.NGHT:
                    validMoves.set(pString, mapMoves(p, color, pieceMap, knightDirections, true));
                    break;
                case PieceType.ROOK:
                    validMoves.set(pString, mapMoves(p, color, pieceMap, rookDirections, false));
                    break;
                case PieceType.QUEN:
                    validMoves.set(pString, mapMoves(p, color, pieceMap, queenDirections, false));
                    break;
                case PieceType.KING:
                    validMoves.set(pString, mapMoves(p, color, pieceMap, queenDirections, true));
                    break;
            }
        }
        console.log(validMoves)
        return validMoves;
    }
}
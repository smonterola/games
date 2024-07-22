import { 
    Piece, 
    Position, 
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
    samePosition,
    checkBounds,
    stringPosition
} from "./pieceLogic"

export default class Rules {
    isValidMove(
        p0: Position,
        p1: Position,
        color: PieceColor,
        pieceMap: Map<string, Piece>,
    ): boolean {
        if (!checkBounds(p0) || !checkBounds(p1)) return false; //do not move out of bounds
        return this.movePiece(p0, p1, this.validMoves(color, pieceMap));
    }

    movePiece(
        p0: Position, //old
        p1: Position, //new
        validMoves: Map<string, Map<string, Position>>,
    ) {
        return validMoves.get(stringPosition(p0))?.has(stringPosition(p1)) ? true : false;
    }

    validMoves(
        color: PieceColor,
        pieceMap: Map<string, Piece>,
    ): Map<string, Map<string, Position>> {
        let validMoves = new Map<string, Map<string, Position>>();
        for (var piece of pieceMap.values()) {
            if (piece.color === color) {
                //pass;
            }
            else {
                continue;
            }
            const p = piece.position;
            const pString = stringPosition(p);
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
                case PieceType.HIGHTLIGHT:
                    //??????
                    break;
                case PieceType.EMPTY:
                    //?????
                    break;
            }
        }
        //console.log(validMoves)
        return validMoves;
    }
}
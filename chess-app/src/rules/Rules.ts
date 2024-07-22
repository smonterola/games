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
        console.log("calling validMoves")
        let validMoves: Map<string, Position[]> = this.validMoves(color, pieceMap);
        return this.movePiece(p0, p1, validMoves);
    }
    movePiece(
        p0: Position, //old
        p1: Position, //new
        validMoves: Map<string, Position[]>,
    ) {
        const legalMoves = validMoves.get(stringPosition(p0));
        return (legalMoves?.find(p => (samePosition(p, p1)))) ? true : false;
    }
    validMoves(
        color: PieceColor,
        pieceMap: Map<string, Piece>,
    ): Map<string, Position[]> {
        let colorPieces: Piece[] = [];
        for (let piece of pieceMap.values()) {
            if (piece.color === color) {
                colorPieces.push(piece);
            }
        }
        console.log(colorPieces)
        //pieceMap.values().filter((boardState) => boardState.color === color);
        let validMoves = new Map<string, Position[]>([]);
        for (var piece of colorPieces) {
            const p = piece.position
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
        return validMoves;
    }
}
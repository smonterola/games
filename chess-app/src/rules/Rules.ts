import { 
    Piece, 
    Position, 
    PieceType, 
    PieceColor, 
    samePosition, 
    checkBounds, 
    stringPosition,
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
        type: PieceType, 
        color: PieceColor,
        boardState: Piece[],
    ): boolean {
        if (!checkBounds(p0)) return false; //do not move out of bounds
        let validMoves: Map<string, Position[]> = this.validMoves(color, boardState);
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
        boardState: Piece[],
    ): Map<string, Position[]> {
        const colorPieces: Piece[] = boardState.filter((boardState) => boardState.color === color);
        let validMoves = new Map<string, Position[]>([]);
        for (var piece of colorPieces) {
            const p = piece.position
            const pString = stringPosition(p);
            switch (piece.type) {
                case PieceType.PAWN: 
                    validMoves.set(pString, movePawn(p, color, boardState));
                    break;
                case PieceType.BSHP:
                    validMoves.set(pString, mapMoves(p, color, boardState, bishopDirections, false));
                    break;
                case PieceType.NGHT:
                    validMoves.set(pString, mapMoves(p, color, boardState, knightDirections, true));
                    break;
                case PieceType.ROOK:
                    validMoves.set(pString, mapMoves(p, color, boardState, rookDirections, false));
                    break;
                case PieceType.QUEN:
                    validMoves.set(pString, mapMoves(p, color, boardState, queenDirections, false));
                    break;
                case PieceType.KING:
                    validMoves.set(pString, mapMoves(p, color, boardState, queenDirections, true));
                    break;
            }
        }
        return validMoves;
    }
}
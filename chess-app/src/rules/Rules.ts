import { 
    Piece, 
    Position, 
    PieceType, 
    PieceColor, 
    samePosition, 
    checkBounds, 
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
        switch (type) {
            case PieceType.PAWN: 
                return movePawn(p0, p1, color, boardState);
            case PieceType.BSHP:
                return this.movePiece(p0, p1, color, boardState, bishopDirections, false);
            case PieceType.NGHT:
                return this.movePiece(p0, p1, color, boardState, knightDirections, true);
            case PieceType.ROOK:
                return this.movePiece(p0, p1, color, boardState, rookDirections, false);
            case PieceType.QUEN:
                return this.movePiece(p0, p1, color, boardState, queenDirections, false);
            case PieceType.KING:
                return this.movePiece(p0, p1, color, boardState, queenDirections, true);
        }
        return false;
    }
    movePiece(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
        directions: Position[],
        once: boolean,
    ) {
        const moves: Position[] = mapMoves(p0, color, boardState, directions, once);
        return (moves.find(p => samePosition(p, p1))) ? true : false;
    }
    validMoves(
        p0: Position,
        color: PieceColor,
        boardState: Piece[],
        movement: Position[],
    ) {
        const colorPieces: Piece[] = boardState.filter((boardState) => boardState.color <= color);
    }
}
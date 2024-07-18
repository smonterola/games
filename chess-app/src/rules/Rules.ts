import { 
    Piece, 
    Position, 
    PieceType, 
    PieceColor, 
    samePosition, 
    convertCoordinates, 
    rookDirections,
    bishopDirections,
    knightDirections,
    queenDirections
} from "../Constants";

import { isOccupied, canCapture } from "./pieceLogic/TileAttributes";
import { mapMoves } from "./pieceLogic/MapMoves";

export default class Rules {
    isValidMove(
        p0: Position,
        p1: Position,
        type: PieceType, 
        color: PieceColor,
        boardState: Piece[],
    ): boolean {
        if (p1.x < 0 || p1.x > 7 || p1.y < 0 || p1.y > 7) return false; //do not move out of bounds
        switch (type) {
            case PieceType.PAWN: 
                return this.movePawn(p0, p1, color, boardState);
            case PieceType.BSHP:
                return this.moveBishop(p0, p1, color, boardState);
            case PieceType.NGHT:
                return this.moveKnight(p0, p1, color, boardState);
            case PieceType.ROOK:
                return this.moveRook(p0, p1, color, boardState);
            case PieceType.QUEN:
                return this.moveQueen(p0, p1, color, boardState);
            case PieceType.KING:
                return this.moveKing(p0, p1, color, boardState);
        }
        return false;
    }
    movePawn(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const [x0, y0, x, y] = convertCoordinates(p0, p1);
        //pawns are not symmetrical
        const [POV, OG] = (color === PieceColor.WHITE) ? [1, 1] : [-1, 6];
        //pawn push
        if (x === x0) {
            switch((y - y0) * POV) {
                //@ts-ignore
                case 2:
                    if (
                        (y0 !== OG) ||
                        (isOccupied({x, y: y - POV}, boardState))
                    ) {
                        return false;
                    }
                case 1:
                    return !isOccupied(p1, boardState);
                default:
                    return false;
            }
        //pawn capture
        } else if (Math.abs(x - x0) * (y - y0) * POV === 1) {
            return canCapture(p1, boardState, color);
        //need to add en passant
        } else {
            return false;
        }
    }
    moveKnight(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const knightMoves: Position[] = mapMoves(p0, color, boardState, knightDirections, true);
        return (knightMoves.find(p => samePosition(p, p1))) ? true : false;
    }
    moveBishop(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const bishopMoves: Position[] = mapMoves(p0, color, boardState, bishopDirections, false);
        return (bishopMoves.find(p => samePosition(p, p1))) ? true : false;
    }
    moveRook(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const rookMoves: Position[] = mapMoves(p0, color, boardState, rookDirections, false);
        return (rookMoves.find(p => samePosition(p, p1))) ? true : false;
    }
    moveQueen(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const queenMoves: Position[] = mapMoves(p0, color, boardState, queenDirections, false);
        return (queenMoves.find(p => samePosition(p, p1))) ? true : false;
    }
    moveKing(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const kingMoves: Position[] = mapMoves(p0, color, boardState, queenDirections, true);
        return (kingMoves.find(p => samePosition(p, p1))) ? true : false;
    }
}
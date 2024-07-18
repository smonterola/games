import { 
    Piece, 
    Position, 
    PieceType, 
    PieceColor, 
    samePosition, 
    addPositions,
    convertCoordinates,
    checkBounds, 
} from "../Constants";

import {
    isOccupied,
    canCapture,
    mapMoves,
    rookDirections,
    bishopDirections,
    knightDirections,
    queenDirections
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
        const pawnMoves: Position[] = [];
        const [POV, OG, leftFile, rightFile, promotion] = 
            (color === PieceColor.WHITE) ? 
            [1, 1, 0, 7, 7] : 
            [-1, 6, 7, 0, 0];
        const pawnDirections: Position[] = [
            {x:-1*POV, y: 1*POV},
            {x: 1*POV, y: 1*POV},
            {x: 0    , y: 1*POV},
            {x: 0    , y: 2*POV},
        ]
        let i = 0;
        const [upperLeft, upperRight, upOne, upTwo] = [
            addPositions(p0, pawnDirections[i++]),
            addPositions(p0, pawnDirections[i++]),
            addPositions(p0, pawnDirections[i++]),
            addPositions(p0, pawnDirections[i++]),
        ];
        if (p0.x !== leftFile  && canCapture(upperLeft, boardState, color)) {
            pawnMoves.push(upperLeft);
        }
        if (p0.x !== rightFile && canCapture(upperRight, boardState, color)) {
            pawnMoves.push(upperRight);
        }
        if (p0.y + 1*POV !== promotion && !isOccupied(upOne, boardState)) {
            pawnMoves.push(upOne);
            if (p0.y + 2*POV !== promotion && !isOccupied(upTwo, boardState) && p0.y === OG) {
                pawnMoves.push(upTwo);
            }
        }
        return (pawnMoves.find(p => samePosition(p, p1))) ? true : false;
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
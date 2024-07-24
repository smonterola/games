import { PieceType } from "../../Constants";
import { evaluate } from "../../engine/evaluate";
import { Piece, Position } from "../../models";
//import { generatePiece } from "./initChessboard";

export function updatePieceMap(
    pieceMap: Map<string, Piece>, 
    p0: Position, 
    p1: Position, 
    movePiece: Piece,
){
    const newPieceMap = new Map<string, Piece>(pieceMap);
    newPieceMap.delete(p0.stringPosition());
    newPieceMap.set(p1.stringPosition(), movePiece);
    console.log(evaluate(newPieceMap))
    return newPieceMap;
}

export function promotePawn(
    pieceMap: Map<string, Piece>,
    p0: Position,
    pawn: Piece,
    pieceType: PieceType,
){
    const newPieceMap = new Map<string, Piece>(pieceMap);
    let newPiece: Piece = new Piece(pawn.position, pieceType, pawn.color);
    newPieceMap.delete(p0.stringPosition());
    newPieceMap.set(pawn.position.stringPosition(), newPiece);
    return newPieceMap;
}

export function castle(
    pieceMap: Map<string, Piece>,
    king: Piece,
    rook: Piece,
){
    const newPieceMap = new Map<string, Piece>(pieceMap);
    newPieceMap.delete(king.position.stringPosition()); //deleting king
    newPieceMap.delete(rook.position.stringPosition()); //deleting rook
    [rook.position.x, king.position.x] = rook.position.x === 0 ? [3, 2] : [5, 6];
    newPieceMap.set(rook.position.stringPosition(), rook);
    newPieceMap.set(king.position.stringPosition(), king);
    return newPieceMap;
}
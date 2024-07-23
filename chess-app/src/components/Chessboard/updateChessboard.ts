import { stringPosition } from "../../rules/pieceLogic";
import { Piece, PieceType, Position } from "../../Constants";
import { evaluate } from "../../engine/evaluate";
import { generatePiece } from "./initChessboard";

export function updatePieceMap(
    pieceMap: Map<string, Piece>, 
    p0: Position, 
    p1: Position, 
    movePiece: Piece,
){
    const newPieceMap = new Map<string, Piece>(pieceMap);
    newPieceMap.delete(stringPosition(p0));
    newPieceMap.set(stringPosition(p1), movePiece);
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
    let newPiece: Piece = generatePiece(pawn.color, pieceType);
    newPiece.position = pawn.position;
    newPieceMap.delete(stringPosition(p0));
    newPieceMap.set(stringPosition(pawn.position), newPiece);
    console.log(newPieceMap)
    return newPieceMap;
}

export function castle(
    pieceMap: Map<string, Piece>,
    king: Piece,
    rook: Piece,
){
    const newPieceMap = new Map<string, Piece>(pieceMap);
    newPieceMap.delete(stringPosition(king.position)); //deleting king
    newPieceMap.delete(stringPosition(rook.position)); //deleting rook
    [rook.position.x, king.position.x] = rook.position.x === 0 ? [3, 2] : [5, 6];
    newPieceMap.set(stringPosition(rook.position), rook);
    newPieceMap.set(stringPosition(king.position), king);
    return newPieceMap;
}
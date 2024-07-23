import { stringPosition } from "../../rules/pieceLogic";
import { Piece, Position } from "../../Constants";
import { evaluate } from "../../engine/evaluate";

export function updatePieceMap(
    pieceMap: Map<string, Piece>, 
    p0: Position, 
    p1: Position, 
    movePiece: Piece 
){
    const newPieceMap = new Map<string, Piece>(pieceMap);
    newPieceMap.delete(stringPosition(p0));
    newPieceMap.set(stringPosition(p1), movePiece);
    console.log(evaluate(newPieceMap))
    return newPieceMap;
}
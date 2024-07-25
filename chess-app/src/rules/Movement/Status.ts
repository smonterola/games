import { Piece, Position } from "../../models";
import { PieceColor } from "../../Constants";

export const isOccupied = (
    coordinate: Position,
    pieceMap: Map<string, Piece>,
): boolean => {
    const occupied = pieceMap.has(coordinate.stringPosition());
    return occupied;
}

export const canCapture = (
    coordinate: Position,
    pieceMap: Map<string, Piece>,
    color: PieceColor,
): boolean => {
    const capturable = 
        pieceMap.has(coordinate.stringPosition()) && 
        pieceMap.get(coordinate.stringPosition())!.color !== color;
    return capturable;
}
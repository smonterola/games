import { Piece, Position } from "../../models";
import { PieceColor } from "../../Constants";

export const isOccupied = (
    coordinate: Position,
    pieceMap: Map<string, Piece>,
): boolean => {
    const occupied = pieceMap.has(coordinate.string);
    return occupied;
}

export const canCapture = (
    coordinate: Position,
    pieceMap: Map<string, Piece>,
    color: PieceColor,
): boolean => {
    const capturable = 
        pieceMap.has(coordinate.string) && 
        pieceMap.get(coordinate.string)!.color !== color;
    return capturable;
}


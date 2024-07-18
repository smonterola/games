import { Position, Piece, PieceColor, samePosition } from "../../Constants";

export const isOccupied = (
    coordinate: Position,
    boardState: Piece[],
): boolean => {
    const piece = boardState.find((p) => 
        samePosition(coordinate, p.position));
    return (piece) ? true : false; 
}

export const canCapture = (
    coordinate: Position,
    boardState: Piece[],
    color: PieceColor,
): boolean => {
    const piece = boardState.find((p) => 
        samePosition(coordinate, p.position) && p.color !== color); 
    return (piece) ? true : false;
}


import { Position, Piece, PieceColor } from "../../Constants";

export const isOccupied = (
    coordinate: Position,
    boardState: Piece[],
): boolean => {
    const piece = boardState.find((p) => 
        samePosition(coordinate, p.position));
    return piece ? true : false; 
}

export const canCapture = (
    coordinate: Position,
    boardState: Piece[],
    color: PieceColor,
): boolean => {
    const piece = boardState.find((p) => 
        samePosition(coordinate, p.position) && p.color !== color); 
    return piece ? true : false;
}

export function getPosition(p: Position): Position {
    return {x: p.x, y: p.y};
}

export function samePosition(p0: Position, p1: Position): boolean {
    return p0.x === p1.x && p0.y === p1.y;
}

export function addPositions(p0: Position, p1: Position): Position {
    return {x: p0.x + p1.x, y: p0.y + p1.y}
}

export function checkBounds(p: Position): boolean {
    return (
        p.x >= 0 && p.x <= 7 &&
        p.y >= 0 && p.y <= 7
    )
}
import { xAxis, yAxis, Position, Piece, PieceColor } from "../../Constants";

export const isOccupied = (
    coordinate: Position,
    pieceMap: Map<string, Piece>,
): boolean => {
    const occupied = pieceMap.get(stringPosition(coordinate)) ? true : false;
    return occupied;
}

export const canCapture = (
    coordinate: Position,
    pieceMap: Map<string, Piece>,
    color: PieceColor,
): boolean => {
    const capturable = pieceMap.has(stringPosition(coordinate)) && pieceMap.get(stringPosition(coordinate))?.color !== color;
    return capturable;
}

export function getPosition(p: Position): Position {
    return {x: p.x, y: p.y};
}

export function stringPosition(p: Position): string {
    return `${xAxis[p.x]}${yAxis[p.y]}`;
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
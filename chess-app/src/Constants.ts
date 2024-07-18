export const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const TILESIZE = 100;
//look at viewport | responsive design

export interface Piece {
    image: string;
    position: Position;
    type: PieceType;
    color: PieceColor;
}

export interface Position {
    x: number;
    y: number;
}

export function samePosition(p0: Position, p1: Position) {
    return p0.x === p1.x && p0.y === p1.y;
}

export function convertCoordinates(p0: Position, p1: Position) {
    return [p0.x, p0.y, p1.x, p1.y];
}

export function checkBounds(p: Position) {
    return (
        p.x >= 0 && p.x <= 7 &&
        p.y >= 0 && p.y <= 7
    )
}

export enum PieceType {
    PAWN,
    BSHP,
    NGHT,
    ROOK,
    QUEN,
    KING,
}

export enum PieceColor {
    WHITE,
    BLACK,
}

export const rookDirections: Position[] = [
    {x: 1, y: 0}, // 0pi/2
    {x: 0, y: 1}, // 1pi/2
    {x:-1, y: 0}, // 2pi/2
    {x: 0, y:-1}, // 3pi/2
];

export const bishopDirections: Position[] = [
    {x: 1, y: 1}, //  pi/4
    {x: 1, y:-1}, // 3pi/4
    {x:-1, y:-1}, // 5pi/4
    {x:-1, y: 1}, // 7pi/4
];


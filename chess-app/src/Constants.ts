export const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const tileSize = 100;
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
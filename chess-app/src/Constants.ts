export const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export enum PieceType {
    PAWN,
    BSHP,
    NGHT,
    ROOK,
    QUEN,
    KING,
    HIGHTLIGHT,
    EMPTY,
}

export enum PieceColor {
    WHITE,
    BLACK,
}

//["", "B", "N", "R", "Q", "K", "+", "#", "$", "O-O", "O-O-O"]
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
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

let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
const minDimPx = (vw < vh) ? vw : vh;
export let pxToVmin = 100 / minDimPx;
console.log(minDimPx)
export let TILESIZE = minDimPx / 8;
console.log("Tilesize")
console.log(TILESIZE)

document.documentElement.style.setProperty("--tileSize", `${TILESIZE}px`);
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
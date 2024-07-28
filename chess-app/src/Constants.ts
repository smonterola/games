export const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export enum PieceType {
    PAWN = "",
    NGHT = "N",
    BSHP = "B",
    ROOK = "R",
    QUEN = "Q",
    KING = "K",
}

export enum PieceColor {
    WHITE = "w",
    BLACK = "b",
}

//["", "B", "N", "R", "Q", "K", "+", "#", "$", "O-O", "O-O-O"]

let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
const minDimPx = (vw < vh) ? vw : vh;
export let TILESIZE = minDimPx / 8;
document.documentElement.style.setProperty("--tileSize", `${TILESIZE}px`);
//look at viewport | responsive design


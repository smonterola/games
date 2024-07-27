import { PieceType, PieceColor } from "../Constants";
import { PositionMap } from "./MapAliases";
import { Position } from "./Position";

const parent = "assets/images/";
const pieceSet = "palmpals";
const file = ".png"

export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    color: PieceColor;
    moveMap: PositionMap = new Map();
    enPassant?: boolean = false;
    hasMoved?: boolean = false; //for castling
    constructor(
        position: Position, 
        type: PieceType, 
        color: PieceColor,
    ){
        this.image = `${parent}${pieceSet}/${color}${type}${file}`;
        this.position = position;
        this.type = type;
        this.color = color;
    } 
}
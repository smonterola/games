import { PieceType, PieceColor } from "../Constants";
import { Position } from "./Position";

const parent = "assets/images/";
const pieceSet = "default";
const file = ".png"

export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    color: PieceColor;
    enPassant?: boolean;
    hasMoved?: boolean; //for castling
    moveMap?: Map<string, Position>;
    constructor(
        position: Position, 
        type: PieceType, 
        color: PieceColor,
        //moveMap: Map<string, Position>
    ){
        this.image = `${parent}${pieceSet}/${color}${type}${file}`;
        this.position = position;
        this.type = type;
        this.color = color;
        //this.moveMap = moveMap;
    } 
}
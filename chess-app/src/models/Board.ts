import { PieceColor } from "../Constants";
import { PieceMap } from "./MapAliases";

export class Board {
    private _board: PieceMap;
    private _attributes: number[];
    constructor(
        board: PieceMap,
        attributes: number[]
    ){
        this._board = board;
        this._attributes = attributes;
    }
    setBoard(
        board: PieceMap,
    ): void {
        this._board = board;
    }
    setAttributes(
        turn: PieceColor, 
        shortCastle: boolean,
        longCastle: boolean,
        enPassant: number,
    ): void { //make this a bitset later
        this._attributes = [
            (turn === PieceColor.WHITE) ? 1 : 0,
            (shortCastle) ? 1 : 0,
            (longCastle)  ? 1 : 0,
            enPassant,
        ];
    }
    get pieces(): PieceMap {
        return this._board;
    }
    get attributes(): number[] {
        return this._attributes;
    }
}
import { PieceMap, Position, PositionMap, Piece } from "../../models";

//DEEP CLONING
export function deepClone(pieceMap: PieceMap): PieceMap {
    const clonePieceMap: PieceMap = new Map();
    for (const piece of pieceMap.values()) {
        const key: string = piece.position.string;
        const clonePosition: Position = piece.position.clone();
        const cloneMoveMap: PositionMap = new Map();
        for (const destination of piece.moveMap!.values()) {
            cloneMoveMap.set(destination.string, destination.clone());
        }
        const clonePiece: Piece = piece.clone();
        clonePiece.moveMap = new Map(cloneMoveMap);
        clonePiece.enPassant = piece.enPassant;
        clonePiece.hasMoved = piece.hasMoved;

        clonePieceMap.set(key, clonePiece);
    }
    //console.log("deep cloning")
    return clonePieceMap;
}
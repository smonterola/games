import { PieceMap, Position, PositionMap, Piece } from "../../models";

//DEEP CLONING
export function deepClonePMap(pieceMap: PieceMap): PieceMap {
    const clonePieceMap: PieceMap = new Map()
    for (const piece of pieceMap.values()) {
        const key: string = piece.position.string;
        const clonePosition: Position = piece.position.clone();
        const cloneMoveMap: PositionMap = new Map();
        for (const destination of piece.moveMap!.values()) {
            cloneMoveMap.set(destination.string, destination.clone());
        }
        const clonePiece: Piece = new Piece(
            clonePosition, 
            piece.type, 
            piece.color, 
            cloneMoveMap,
        );
        clonePiece.enPassant = piece.enPassant;
        clonePiece.hasMoved = piece.hasMoved;

        clonePieceMap.set(key, clonePiece)
    }
    return clonePieceMap;
}
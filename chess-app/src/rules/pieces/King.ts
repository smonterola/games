import { PieceColor, PieceType } from "../../Constants";
import { Piece, PieceMap, Position, PositionMap } from "../../models";
import { pieceDirectons } from "./Directions";
import { cloneMoves } from "../History/Clone";

export function castle(
    pieceMap: PieceMap, 
    king: Piece, 
    kingMap: PositionMap,
): PositionMap {
    const pMap = pieceMap;
    const rank = king.color === PieceColor.WHITE ? 0 : 7;
    if (
        king.type !== PieceType.KING || 
        king.hasMoved === true || 
        isCheck(pMap, king.position, king.color) ||
        !pMap.has(new Position(7, rank).string)
    ){
        return kingMap;
    }
    const newKingMap: PositionMap = cloneMoves(kingMap);
    const shortCastle: boolean = (
        pMap.get(new Position(7, rank).string)?.hasMoved === false && //kingside rook hasn't moved
        canPass(pMap, new Position(5, rank), king.color) &&
        canPass(pMap, new Position(6, rank), king.color)
    );
    const longCastle: boolean = (
        pMap.get(new Position(0, rank).string)?.hasMoved === false && //queenside rook hasn't moved
        !new Position(1, rank).isOccupied(pMap) &&
        canPass(pMap, new Position(2, rank), king.color) &&
        canPass(pMap, new Position(3, rank), king.color)
    );
    if (shortCastle) {
        const shortKing = new Position(6, rank);
        newKingMap.set(shortKing.string, shortKing);
    }
    if (longCastle) {
        const longKing = new Position(2, rank);
        newKingMap.set(longKing.string, longKing);
    }
    return newKingMap;
}

export function isCheck(
    pieceMap: PieceMap,
    p: Position,
    color: PieceColor
): boolean {
    for (const pieceType in PieceType) {
        const type: PieceType = PieceType[pieceType as keyof typeof PieceType];
        const [directions, once] = pieceDirectons.get(type)!;
        for (let direction of directions) {
            let safe = false;
            let tempPosition: Position = p.addPositions(direction);
            if (type === PieceType.PAWN) {
                const POV = color === PieceColor.WHITE ? 1 : -1;
                tempPosition = p.addPositions(new Position(direction.x, POV));
            }
            while (tempPosition.checkBounds && !safe) {
                if (!tempPosition.isOccupied(pieceMap)) {
                    tempPosition = tempPosition.addPositions(direction);
                } else {
                    if (
                        pieceMap.get(tempPosition.string)!.color !== color && 
                        pieceMap.get(tempPosition.string)!.type  === type
                    ){
                        return true; 
                    }
                    else {
                        safe = true;
                        break;
                    }
                }
                if (once) { //limits kings, knights, and pawns to only one move per direction
                    break; 
                }
            }
        }
    }
    return false;
}

export function canPass(
    pieceMap: PieceMap,
    p: Position,
    color: PieceColor,
){  //this functions makes sure the king cannot castle through check
    return !p.isOccupied(pieceMap) && !isCheck(pieceMap, p, color);
}

export function findKing(
    pieceMap: PieceMap,
    prevKey: string,
    color: PieceColor,
): string { //if the king is in the same spot, easy index. Otherwise, look through all the pieces for the king.
    const piece: Piece = pieceMap.has(prevKey) ? 
        pieceMap.get(prevKey)! : 
        new Piece(new Position(-1, -1), PieceType.PAWN, color);
    if (piece.type === PieceType.KING && piece.color === color) {
        return prevKey;
    }
    const king: Piece = [...pieceMap.values()].find(
        (p) => (p.type === PieceType.KING && p.color === color)
    )!
    if (!king) {
        console.log("king not found")
        console.log(pieceMap)
    } else {
        //console.log(king)
    }
    return king.position.string;
}
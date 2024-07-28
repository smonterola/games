import { PieceColor, PieceType } from "../../Constants";
import { Piece, PieceMap, Position, PositionMap } from "../../models";
import { deepClone } from "../History/Clone";
import { pieceDirectons } from "./Directions";
//put checkmate and stalemate

export function castle(
    pieceMap: PieceMap, 
    king: Piece, 
    kingMap: PositionMap,
): PositionMap {
    const pMap = deepClone(pieceMap);
    if (
        king.type !== PieceType.KING || 
        king.hasMoved === true || 
        isCheck(pMap, king.position, king.color)
    ) {
        console.log("king has moved")
        console.log(king.hasMoved)
        return kingMap;
    }
    const rank = king.color === PieceColor.WHITE ? 0 : 7;
    //must not allow castling through check
    const shortCastle = 
        pMap.get(new Position(7, rank).string)?.hasMoved === false && //kingside rook hasn't moved
        canPass(pMap, new Position(5, rank), king.color) &&
        canPass(pMap, new Position(6, rank), king.color);
    const longCastle  = 
        pMap.get(new Position(7, rank).string)?.hasMoved === false && //queenside rook hasn't moved
        !new Position(1, rank).isOccupied(pMap) &&
        canPass(pMap, new Position(2, rank), king.color) &&
        canPass(pMap, new Position(3, rank), king.color);
    if (shortCastle) {
        const shortKing = new Position(6, rank);
        kingMap.set(shortKing.string, shortKing);
    }
    if (longCastle) {
        const longKing = new Position(2, rank);
        kingMap.set(longKing.string, longKing);
    }
    return kingMap;
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
                        /*console.log(
                            pieceMap.get(tempPosition.string)!.type + " on "
                            + tempPosition.string + " sees " + p.string
                        );
                        console.log("found threat");*/
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
){
    return !p.isOccupied(pieceMap) && !isCheck(pieceMap, p, color);
}

export function findKing(
    pieceMap: PieceMap,
    prevKey: string,
    color: PieceColor,
): string {
    const piece: Piece = pieceMap.has(prevKey) ? 
        pieceMap.get(prevKey)! : 
        new Piece(new Position(-1, -1), PieceType.PAWN, color);
    if (piece.type === PieceType.KING && piece.color === color) {
        return prevKey;
    }
    const king: Piece = [...pieceMap.values()].find(
        (p) => (p.type === PieceType.KING && p.color === color)
    )!
    return king.position.string;
}
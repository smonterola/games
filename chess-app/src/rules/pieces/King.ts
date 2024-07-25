import { PieceColor, PieceType } from "../../Constants";
import { Piece, Position } from "../../models";
import { isOccupied } from "../Movement/Status";
//cannot castle through check
//needs features to not move into check
//put checkmate and stalemate
//other pieces cannot allow discovered check

export function castle(
    pieceMap: Map<string, Piece>, 
    piece: Piece, 
    kingMap: Map<string, Position>
): Map<string, Position> {
    if (piece.type !== PieceType.KING || piece.hasMoved === true) {
        return kingMap;
    }
    const rank = piece.color === PieceColor.WHITE ? 0 : 7;
    //must not allow castling through check
    const shortCastle = 
        pieceMap.get(new Position(7, rank).stringPosition())?.hasMoved === false &&
        !isOccupied(new Position(5, rank), pieceMap) &&
        !isOccupied(new Position(6, rank), pieceMap);
    const longCastle  = 
        pieceMap.get(new Position(7, rank).stringPosition())?.hasMoved === false &&
        !isOccupied(new Position(1, rank), pieceMap) &&
        !isOccupied(new Position(2, rank), pieceMap) &&
        !isOccupied(new Position(3, rank), pieceMap);
    if (shortCastle) {
        const shortKing = new Position(6, rank);
        kingMap.set(shortKing.stringPosition(), shortKing);
    }
    if (longCastle) {
        const longKing = new Position(2, rank);
        kingMap.set(longKing.stringPosition(), longKing);
    }
    return kingMap;
}
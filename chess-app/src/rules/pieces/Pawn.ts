import { Piece, PieceMap, Position, PositionMap } from "../../models";
import { PieceColor, PieceType } from "../../Constants";

export const movePawn = (
    p: Position,
    color: PieceColor,
    pieceMap: PieceMap,
): [PositionMap, boolean] => {
    let pawnMap: PositionMap = new Map();
    let enPassant = false;
    const [POV, OG] = 
        (color === PieceColor.WHITE) ? 
        [ 1, 1] : 
        [-1, 6];
    const pawnDirections: Position[] = [
        new Position(-1*POV, 1*POV),
        new Position( 1*POV, 1*POV),
        new Position( 0    , 1*POV),
        new Position( 0    , 2*POV),
        new Position(-1*POV, 0),
        new Position( 1*POV, 0),
    ];
    let i = 0;
    const [upperLeft, upperRight, upOne, upTwo, left, right] = [
        p.addPositions(pawnDirections[i++]),
        p.addPositions(pawnDirections[i++]),
        p.addPositions(pawnDirections[i++]),
        p.addPositions(pawnDirections[i++]),
        p.addPositions(pawnDirections[i++]),
        p.addPositions(pawnDirections[i++]),
    ];
    if (
        upperLeft.canCapture(pieceMap, color) ||
        (left.canCapture(pieceMap, color) && 
        pieceMap.get(left.string)!.enPassant === true && //needs to be this order for indexing purposes
        pieceMap.get(left.string)!.type === PieceType.PAWN)
    ) {
        pawnMap.set(upperLeft.string, upperLeft);
    }
    if (
        upperRight.canCapture(pieceMap, color) ||
        (right.canCapture(pieceMap, color) && 
        pieceMap.get(right.string)!.enPassant === true &&
        pieceMap.get(right.string)!.type === PieceType.PAWN)
    ) {
        pawnMap.set(upperRight.string, upperRight);
    }
    if (!upOne.isOccupied(pieceMap)) {
        pawnMap.set(upOne.string, upOne);
        if (p.y === OG && !upTwo.isOccupied(pieceMap)) {
            pawnMap.set(upTwo.string, upTwo);
            enPassant = true;
        }
    }
    return [pawnMap, enPassant];
}
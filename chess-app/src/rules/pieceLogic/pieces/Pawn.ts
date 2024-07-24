import { Piece, Position } from "../../../models";
import { PieceColor, PieceType } from "../../../Constants";
import { isOccupied, canCapture } from "../Status";

export const movePawn = (
    p: Position,
    color: PieceColor,
    pieceMap: Map<string, Piece>,
): [Map<string, Position>, boolean] => {
    let pawnMap = new Map<string, Position>();
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
        canCapture(upperLeft, pieceMap, color) ||
        (canCapture(left, pieceMap, color) && 
        pieceMap.get(left.stringPosition())!.enPassant === true &&
        pieceMap.get(left.stringPosition())!.type === PieceType.PAWN)
    ) {
        pawnMap.set(upperLeft.stringPosition(), upperLeft);
    }
    if (
        canCapture(upperRight, pieceMap, color) ||
        (canCapture(right, pieceMap, color) && 
        pieceMap.get(right.stringPosition())!.enPassant === true &&
        pieceMap.get(right.stringPosition())!.type === PieceType.PAWN)
    ) {
        pawnMap.set(upperRight.stringPosition(), upperRight);
    }
    if (!isOccupied(upOne, pieceMap)) {
        pawnMap.set(upOne.stringPosition(), upOne);
        if (p.y === OG && !isOccupied(upTwo, pieceMap)) {
            pawnMap.set(upTwo.stringPosition(), upTwo);
            enPassant = true;
        }
    }
    return [pawnMap, enPassant];
}
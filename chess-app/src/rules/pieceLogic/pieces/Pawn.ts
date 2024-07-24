import { Piece, Position } from "../../../models";
import { PieceColor } from "../../../Constants";
import { isOccupied, canCapture } from "../Status";

export const movePawn = (
    p0: Position,
    color: PieceColor,
    pieceMap: Map<string, Piece>,
): Map<string, Position> => {
    let pawnMap = new Map<string, Position>();
    const [POV, OG, promotion] = 
        (color === PieceColor.WHITE) ? 
        [ 1, 1, 7] : 
        [-1, 6, 0];
    const pawnDirections: Position[] = [
        new Position(-1*POV, 1*POV),
        new Position( 1*POV, 1*POV),
        new Position( 0    , 1*POV),
        new Position( 0    , 2*POV),
    ];
    let i = 0;
    const [upperLeft, upperRight, upOne, upTwo] = [
        p0.addPositions(pawnDirections[i++]),
        p0.addPositions(pawnDirections[i++]),
        p0.addPositions(pawnDirections[i++]),
        p0.addPositions(pawnDirections[i++]),
    ];
    if (upperLeft.checkBounds()  && canCapture(upperLeft, pieceMap, color)) {
        pawnMap.set(upperLeft.stringPosition(), upperLeft);
    }
    if (upperRight.checkBounds() && canCapture(upperRight, pieceMap, color)) {
        pawnMap.set(upperRight.stringPosition(), upperRight);
    }
    if (!isOccupied(upOne, pieceMap)) {
        pawnMap.set(upOne.stringPosition(), upOne);
        if (p0.y === OG && !isOccupied(upTwo, pieceMap)) {
            pawnMap.set(upTwo.stringPosition(), upTwo);
        }
    }
    return pawnMap;
}
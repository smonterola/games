import { Position, PieceColor, Piece } from "../../../Constants";
import { isOccupied, canCapture, addPositions, checkBounds, stringPosition } from "../Position";

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
        {x:-1*POV, y: 1*POV},
        {x: 1*POV, y: 1*POV},
        {x: 0    , y: 1*POV},
        {x: 0    , y: 2*POV},
    ];
    let i = 0;
    const [upperLeft, upperRight, upOne, upTwo] = [
        addPositions(p0, pawnDirections[i++]),
        addPositions(p0, pawnDirections[i++]),
        addPositions(p0, pawnDirections[i++]),
        addPositions(p0, pawnDirections[i++]),
    ];
    if (checkBounds(upperLeft)  && canCapture(upperLeft, pieceMap, color)) {
        pawnMap.set(stringPosition(upperLeft), upperLeft);
    }
    if (checkBounds(upperRight) && canCapture(upperRight, pieceMap, color)) {
        pawnMap.set(stringPosition(upperRight), upperRight);
    }
    if (p0.y + 1*POV !== promotion && !isOccupied(upOne, pieceMap)) {
        pawnMap.set(stringPosition(upOne), upOne);
        if (p0.y === OG && !isOccupied(upTwo, pieceMap)) {
            pawnMap.set(stringPosition(upTwo), upTwo);
        }
    }
    return pawnMap;
}
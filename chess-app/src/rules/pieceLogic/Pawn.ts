import { Position, PieceColor, Piece, samePosition, addPositions } from "../../Constants";
import { isOccupied, canCapture } from "./TileAttributes";

export const movePawn = (
    p0: Position, //old
    p1: Position, //new
    color: PieceColor,
    boardState: Piece[],
): boolean => {
    const pawnMoves: Position[] = [];
    const [POV, OG, leftFile, rightFile, promotion] = 
        (color === PieceColor.WHITE) ? 
        [1, 1, 0, 7, 7] : 
        [-1, 6, 7, 0, 0];
    const pawnDirections: Position[] = [
        {x:-1*POV, y: 1*POV},
        {x: 1*POV, y: 1*POV},
        {x: 0    , y: 1*POV},
        {x: 0    , y: 2*POV},
    ]
    let i = 0;
    const [upperLeft, upperRight, upOne, upTwo] = [
        addPositions(p0, pawnDirections[i++]),
        addPositions(p0, pawnDirections[i++]),
        addPositions(p0, pawnDirections[i++]),
        addPositions(p0, pawnDirections[i++]),
    ];
    if (p0.x !== leftFile  && canCapture(upperLeft, boardState, color)) {
        pawnMoves.push(upperLeft);
    }
    if (p0.x !== rightFile && canCapture(upperRight, boardState, color)) {
        pawnMoves.push(upperRight);
    }
    if (p0.y + 1*POV !== promotion && !isOccupied(upOne, boardState)) {
        pawnMoves.push(upOne);
        if (p0.y + 2*POV !== promotion && !isOccupied(upTwo, boardState) && p0.y === OG) {
            pawnMoves.push(upTwo);
        }
    }
    return (pawnMoves.find(p => samePosition(p, p1))) ? true : false;
}
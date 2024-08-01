import { getPOV, PieceMap, Position, PositionMap } from "../../models";
import { PieceColor, PieceType } from "../../Constants";
import { rawPawnDirections } from "./Directions";

export function movePawn (
    pieceMap: PieceMap,
    p: Position,
    color: PieceColor,
): PositionMap {
    let pawnMap: PositionMap = new Map();
    const OG = color === PieceColor.WHITE ? 1 : 6;
    const POV = getPOV(color);
    const pawnDirections = rawPawnDirections.map(p => new Position(p.x*POV, p.y*POV))
    const pawnCanidates: Position[] = [];
    for (let i = 0; i < 6; i++) {
        pawnCanidates.push(p.addPositions(pawnDirections[i]));
    }
    const [upperLeft, upperRight, upOne, upTwo, left, right] = pawnCanidates;
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
        }
    }
    return pawnMap;
}
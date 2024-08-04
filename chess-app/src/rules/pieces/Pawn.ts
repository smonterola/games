import { Board, getPOV, PieceMap, Position, PositionMap } from "../../models";
import { PieceColor, PieceType } from "../../Constants";
import { rawPawnDirections } from "./Directions";

export function movePawn (
    board: Board,
    p: Position,
): PositionMap {
    const pieceMap = board.pieces;
    const [colorCode, _shortCastle, _longCastle, enPassantRank] = board.attributes;
    const color = colorCode ? PieceColor.WHITE : PieceColor.BLACK;

    const pawnMap: PositionMap = new Map();
    const [OG, rank] = colorCode ? [1, 5] : [6, 4];
    const POV = getPOV(color);

    const pawnDirections = rawPawnDirections.map(p => new Position(p.x*POV, p.y*POV))
    const pawnCanidates: Position[] = [];
    for (let i = 0; i < 6; i++) {
        pawnCanidates.push(p.addPositions(pawnDirections[i]));
    }

    const [upperLeft, upperRight, upOne, upTwo, left, right] = pawnCanidates;
    if (
        upperLeft.canCapture(pieceMap, color) || 
        left.samePosition(new Position(enPassantRank, rank))
    ){
        pawnMap.set(upperLeft.string, upperLeft);
    }
    if (
        upperRight.canCapture(pieceMap, color) ||
        left.samePosition(new Position(enPassantRank, rank))
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
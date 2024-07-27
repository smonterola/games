import { Piece, PieceMap, Position, PositionMap } from "../../models";
import { pieceDirectons } from "../pieces/Directions";

export const mapMoves = (
    pieceMap: PieceMap,
    piece: Piece,
): PositionMap => {
    let moveMap: PositionMap = new Map();
    const [directions, once] = pieceDirectons.get(piece.type)!;
    for (let direction of directions) {
        let tempPosition: Position = piece.position.addPositions(direction);
        while (tempPosition.checkBounds) {
            if (!tempPosition.isOccupied(pieceMap)) {
                moveMap.set(tempPosition.string, tempPosition.copyPosition);
                tempPosition = tempPosition.addPositions(direction);
            } else if (tempPosition.canCapture(pieceMap, piece.color)) {
                moveMap.set(tempPosition.string, tempPosition.copyPosition);
                break;
            } else {
                break;
            }
            if (once) { //limits kings and knights to only one move per direction
                break; 
            }
        }
    }
    return moveMap;
}
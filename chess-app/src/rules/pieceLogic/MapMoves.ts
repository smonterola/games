import { Piece, Position } from "../../models";
import { PieceColor } from "../../Constants";
import { isOccupied, canCapture, } from "./Status"

export const mapMoves = (
    p0: Position,
    color: PieceColor,
    pieceMap: Map<string, Piece>,
    directions: Position[],
    once: boolean,
): Map<string, Position> => {
    let moveMap = new Map<string, Position>();
    for (var direction of directions) {
        let tempPosition: Position = p0.addPositions(direction);
        while (tempPosition.checkBounds()) {
            if (!isOccupied(tempPosition, pieceMap)) {
                moveMap.set(tempPosition.copyPosition().stringPosition(), tempPosition.copyPosition());
                tempPosition = tempPosition.addPositions(direction);
            } else if (canCapture(tempPosition, pieceMap, color)) {
                moveMap.set(tempPosition.copyPosition().stringPosition(), tempPosition.copyPosition());
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
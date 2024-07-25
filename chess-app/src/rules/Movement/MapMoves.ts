import { Piece, Position } from "../../models";
import { isOccupied, canCapture, } from "./Status"
import { pieceDirectons  } from "../pieces/Directions";

export const mapMoves = (
    pieceMap: Map<string, Piece>,
    piece: Piece,
): Map<string, Position> => {
    let moveMap = new Map<string, Position>();
    const [directions, once] = pieceDirectons.get(piece.type)!;
    for (let direction of directions) {
        let tempPosition: Position = piece.position.addPositions(direction);
        while (tempPosition.checkBounds) {
            if (!isOccupied(tempPosition, pieceMap)) {
                moveMap.set(tempPosition.string, tempPosition.copyPosition);
                tempPosition = tempPosition.addPositions(direction);
            } else if (canCapture(tempPosition, pieceMap, piece.color)) {
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
import { Piece, PieceColor, Position} from "../../Constants";
import { isOccupied, canCapture, addPositions, checkBounds, getPosition } from "./Position"

export const mapMoves = (
    p0: Position,
    color: PieceColor,
    boardState: Piece[],
    directions: Position[],
    once: boolean,
): Position[] => {
    const moves: Position[] = [];
    for (var direction of directions) {
        let tempPosition: Position = addPositions(p0, direction);
        while (checkBounds(tempPosition)) {
            if (!isOccupied(tempPosition, boardState)) {
                moves.push(getPosition(tempPosition));
                tempPosition = addPositions(tempPosition, direction);
            } else if (canCapture(tempPosition, boardState, color)) {
                moves.push(getPosition(tempPosition));
                break;
            } else {
                break;
            }
            if (once) { //limits kings and knights to only one move
                break; 
            }
        }
    }
    return moves;
}
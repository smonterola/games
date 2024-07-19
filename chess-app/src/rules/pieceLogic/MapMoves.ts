import { Piece, PieceColor, Position} from "../../Constants";
import { isOccupied, canCapture, addPositions, checkBounds } from "./Position"

export const mapMoves = (
    p0: Position,
    color: PieceColor,
    boardState: Piece[],
    movement: Position[],
    once: boolean,
): Position[] => {
    const moves: Position[] = [];
    for (var direction of movement) {
        let tempPosition: Position = addPositions(p0, direction);
        while (checkBounds(tempPosition)) {
            if (!isOccupied(tempPosition, boardState)) {
                moves.push({x: tempPosition.x, y: tempPosition.y});
                tempPosition = addPositions(tempPosition, direction);
            } else if (canCapture(tempPosition, boardState, color)) {
                moves.push({x: tempPosition.x, y: tempPosition.y});
                break;
            } else {
                break;
            }
            if (once) { //limits kings and knights to only one move
                break; 
            }
        }
    }
    //console.log(moves);
    return moves;
}
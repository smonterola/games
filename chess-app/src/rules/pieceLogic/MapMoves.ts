import { Piece, PieceColor, Position, addPositions, checkBounds } from "../../Constants";
import { isOccupied, canCapture } from "./TileAttributes"

export const mapMoves = (
    p0: Position,
    color: PieceColor,
    boardState: Piece[],
    movement: Position[],
    once: boolean,
): Position[] => {
    const moves: Position[] = [];
    for (var direction of movement) {
        const tempPosition: Position = addPositions(p0, direction);
        //{x: p0.x, y: p0.y};
        //tempPosition.x += direction.x;
        //tempPosition.y += direction.y;
        while (checkBounds(tempPosition)) {
            if (!isOccupied(tempPosition, boardState)) {
                moves.push({x: tempPosition.x, y: tempPosition.y});
                tempPosition.x += direction.x;
                tempPosition.y += direction.y;
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
    return moves;
}
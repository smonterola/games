import { 
    Piece, 
    Position, 
    PieceType, 
    PieceColor, 
    samePosition, 
    convertCoordinates, 
    checkBounds,
    rookDirections,
    bishopDirections,
} from "../Constants";

export default class Rules {
    isOccupied(
        coordinate: Position,
        boardState: Piece[],
    ): boolean {
        const piece = boardState.find((p) => 
            samePosition(coordinate, p.position));
        return (piece) ? true : false; 
    }

    canCapture(
        coordinate: Position,
        boardState: Piece[],
        color: PieceColor,
    ): boolean {
        const piece = boardState.find((p) => 
            samePosition(coordinate, p.position) && p.color !== color); 
        return (piece) ? true : false;
    }
    
    isValidMove(
        p0: Position,
        p1: Position,
        type: PieceType, 
        color: PieceColor,
        boardState: Piece[],
    ): boolean {
        if (p1.x < 0 || p1.x > 7 || p1.y < 0 || p1.y > 7) return false; //do not move out of bounds
        switch (type) {
            case PieceType.PAWN: 
                return this.movePawn(p0, p1, color, boardState);
            case PieceType.BSHP:
                return this.moveBishop(p0, p1, color, boardState);
            case PieceType.NGHT:
                return this.moveKnight(p0, p1, color, boardState);
            case PieceType.ROOK:
                return this.moveRook(p0, p1, color, boardState);
            case PieceType.QUEN:
                return this.moveQueen(p0, p1, color, boardState);
            case PieceType.KING:
        }
        return true;
    }
    movePawn(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const [x0, y0, x, y] = convertCoordinates(p0, p1);
        //pawns are not symmetrical
        const [POV, OG] = (color === PieceColor.WHITE) ? [1, 1] : [-1, 6];
        //pawn push
        if (x === x0) {
            switch((y - y0) * POV) {
                //@ts-ignore
                case 2:
                    if (
                        (y0 !== OG) ||
                        (this.isOccupied({x, y: y - POV}, boardState))
                    ) {
                        return false;
                    }
                case 1:
                    return !this.isOccupied(p1, boardState);
                default:
                    return false;
            }
        //pawn capture
        } else if (Math.abs(x - x0) * (y - y0) * POV === 1) {
            return this.canCapture(p1, boardState, color);
        //need to add en passant
        } else {
            return false;
        }
    }
    moveKnight(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const [x0, y0, x, y] = convertCoordinates(p0, p1);
        if (Math.abs((x - x0) * (y - y0)) === 2) {
            return !this.isOccupied(p1, boardState)|| this.canCapture(p1, boardState, color);
        }
        return false;
    }
    moveBishop(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const bishopMoves: Position[] = this.mapMoves(p0, color, boardState, bishopDirections, false);
        return (bishopMoves.find(p => samePosition(p, p1))) ? true : false;
    }
    moveRook(
            p0: Position, //old
            p1: Position, //new
            color: PieceColor,
            boardState: Piece[],
        ) {
            const rookMoves: Position[] = this.mapMoves(p0, color, boardState, rookDirections, false);
            return (rookMoves.find(p => samePosition(p, p1))) ? true : false;
    }
    moveQueen(
        p0: Position, //old
        p1: Position, //new
        color: PieceColor,
        boardState: Piece[],
    ) {
        const queenDirections: Position[] = bishopDirections.concat(rookDirections);
        const rookMoves: Position[] = this.mapMoves(p0, color, boardState, queenDirections, false);
        return (rookMoves.find(p => samePosition(p, p1))) ? true : false;
    }
    mapMoves(
        p0: Position,
        color: PieceColor,
        boardState: Piece[],
        movement: Position[],
        king: boolean,
    ): Position[]  {
        const moves: Position[] = [];
        for (var direction of movement) {
            const tempPosition: Position = {x: p0.x, y: p0.y};
            tempPosition.x += direction.x;
            tempPosition.y += direction.y;
            while (checkBounds(tempPosition)) {
                if (!this.isOccupied(tempPosition, boardState)) {
                    moves.push({x: tempPosition.x, y: tempPosition.y});
                    tempPosition.x += direction.x;
                    tempPosition.y += direction.y;
                } else if (this.canCapture(tempPosition, boardState, color)) {
                    moves.push({x: tempPosition.x, y: tempPosition.y});
                    break;
                } else {
                    break;
                }
                if (king) { //limits king to only one move
                    break; 
                }
            }
        }
        return moves;
    }
}
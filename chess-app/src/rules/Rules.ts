import { Piece, Position, PieceType, PieceColor, samePosition, convertCoordinates, checkBounds } from "../Constants";

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
    ) {
        if (p1.x < 0 || p1.x > 7 || p1.y < 0 || p1.y > 7) return false; //do not move out of bounds
        switch (type) {
            case PieceType.PAWN: 
                return this.movePawn(p0, p1, color, boardState);
            case PieceType.BSHP:
                return this.moveBishop(p0, p1, color, boardState)
            case PieceType.NGHT:
                return this.moveKnight(p0, p1, color, boardState);
            case PieceType.ROOK:
            case PieceType.QUEN:
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
        //const [x0, y0, x, y] = convertCoordinates(p0, p1);
        const bishopMoves: Position[] = []
        const directions: Position[] = [
            {x: 1, y: 1}, //  pi/4
            {x: 1, y:-1}, // 3pi/4
            {x:-1, y:-1}, // 5pi/4
            {x:-1, y: 1}, // 7pi/4
        ];
        for (var direction of directions) {
            //console.log(direction);
            const tempPosition: Position = {x: p0.x, y: p0.y};
            //console.log("new direction")
            //console.log(tempPosition)
            tempPosition.x += direction.x;
            tempPosition.y += direction.y;
            while (checkBounds(tempPosition)) {
                //console.log(tempPosition);
                if (!this.isOccupied(tempPosition, boardState)) {
                    bishopMoves.push({x: tempPosition.x, y: tempPosition.y});
                    //console.log("pushing")
                    //console.log(tempPosition)
                    tempPosition.x += direction.x;
                    tempPosition.y += direction.y;
                } else if (this.canCapture(tempPosition, boardState, color)) {
                    //console.log("pushing")
                    //console.log(tempPosition)
                    bishopMoves.push({x: tempPosition.x, y: tempPosition.y});
                    break;
                } else {
                    break;
                }
            }
        }
        return (bishopMoves.find(p => samePosition(p, p1))) ? true : false;
    }
}
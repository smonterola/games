import { Piece, PieceType, PieceColor } from "../components/Chessboard/Chessboard";

export default class Rules {
    isOccupied(
        x: number, 
        y: number,
        boardState: Piece[],
    ): boolean {
        const piece = boardState.find((p) => p.x === x && p.y === y);
        return (piece) ? true : false; 
    }

    canCapture(
        x: number, 
        y: number,
        boardState: Piece[],
        color: PieceColor,
    ): boolean {
        const piece = boardState.find((p) => p.x === x && p.y === y && p.color !== color); 
        return (piece) ? true : false;
    }
    
    isValidMove(
        x0: number, 
        y0: number, 
        x: number, 
        y: number, 
        type: PieceType, 
        color: PieceColor,
        boardState: Piece[],
    ) {
        if (x < 0 || x > 7 || y < 0 || y > 7) return false; //do not move out of bounds
        switch (type) {
            case PieceType.PAWN: 
                return this.movePawn(x0, y0, x, y, color, boardState);
            case PieceType.BSHP:
            case PieceType.NGHT:
            case PieceType.ROOK:
            case PieceType.QUEN:
            case PieceType.KING:
        }
        return true;
    }
    movePawn(
        x0: number, 
        y0: number, 
        x: number, 
        y: number, 
        color: PieceColor,
        boardState: Piece[],
    ) {
        //pawns are not symmetrical
        const [POV, OG] = (color === PieceColor.WHITE) ? [1, 1] : [-1, 6];
        //pawn push
        if (x === x0) {
            switch((y - y0) * POV) {
                //@ts-ignore
                case 2:
                    if (
                        (y0 !== OG) ||
                        (this.isOccupied(x, y - POV, boardState))
                    ) {
                        return false;
                    }
                case 1:
                    return !this.isOccupied(x, y, boardState);
                default:
                    return false;
            }
        //pawn capture
        } else if (Math.abs(x - x0) * (y - y0) * POV === 1) {
            return this.canCapture(x, y, boardState, color);
        //need to add en passant
        } else {
            return false;
        }
    }
}
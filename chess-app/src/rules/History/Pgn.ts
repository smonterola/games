import { Piece, Position } from "../../models";
import { PieceType, PieceColor, xAxis } from "../../Constants";

export function nextTurn(pieceColor: PieceColor): PieceColor {
    return (pieceColor === PieceColor.WHITE) ? PieceColor.BLACK : PieceColor.WHITE;
}
export function pgnToString(
    piece: Piece, 
    p0: Position,
    append: String, 
    isCapture: boolean = false, 
    isCheck: boolean = false, 
    isShortCastle: boolean = false, 
    isLongCastle: boolean = false,
    isPromote: boolean = false,
) {
    const identifier: string = piece.type === PieceType.PAWN ? xAxis[p0.x] : piece.type;
    return (
        append + " " +
        (!isCapture ? piece.type : identifier + "x") +
        piece.position.string
    );
}
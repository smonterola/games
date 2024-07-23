import { Piece, PieceType, PieceColor, Position, xAxis } from "../../../Constants";
import { stringPosition } from "../Position";

const symbols = new Map<PieceType, string>([
    [PieceType.PAWN,  ""],
    [PieceType.BSHP, "B"],
    [PieceType.NGHT, "N"],
    [PieceType.ROOK, "R"],
    [PieceType.QUEN, "Q"],
    [PieceType.KING, "K"],
]);

export function pieceToInitial(type: PieceType): string {
    const char = symbols.get(type);
    return char ? char : ""
}

export function colorToInitial(pieceColor: PieceColor): string {
    return pieceColor === PieceColor.WHITE ? "w" : "b";
}
export function nextTurn(pieceColor: PieceColor): PieceColor {
    return pieceColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
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
    const identifier: string = piece.type === PieceType.PAWN ? xAxis[p0.x] : pieceToInitial(piece.type);
    return (
        append + " " +
        (!isCapture ? pieceToInitial(piece.type) : identifier + "x") +
        stringPosition(piece.position)
    );
}
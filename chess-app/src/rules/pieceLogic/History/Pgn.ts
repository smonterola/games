import { xAxis, yAxis, Position, Piece, PieceType, PieceColor } from "../../../Constants";

const symbols = new Map<PieceType, string>([
    [PieceType.PAWN,  ""],
    [PieceType.BSHP, "B"],
    [PieceType.NGHT, "N"],
    [PieceType.ROOK, "R"],
    [PieceType.QUEN, "Q"],
    [PieceType.KING, "K"],
]);

export function stringPosition(p: Position): string {
    return `${xAxis[p.x]}${yAxis[p.y]}`;
}

export function pieceToInitial(type: PieceType): string {
    const char = symbols.get(type);
    return char ? char : ""
}

export function nextTurn(pieceColor: PieceColor): PieceColor {
    return pieceColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
}
export function pgnToString(piece: Piece, previous: String) {
    return (
        previous + " " +
        pieceToInitial(piece.type) +
        stringPosition(piece.position)
    );
}
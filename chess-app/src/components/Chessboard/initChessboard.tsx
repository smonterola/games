import { Piece, Position } from "../../models";
import { PieceType, PieceColor } from "../../Constants";

export const initialPieces = new Map<string, Piece>();//: Piece[] = [];

const rankOrder: PieceType[] = [
    PieceType.ROOK,
    PieceType.NGHT,
    PieceType.BSHP,
    PieceType.QUEN,
    PieceType.KING,
    PieceType.BSHP,
    PieceType.NGHT,
    PieceType.ROOK,
];

for (let pieceColor of Object.values(PieceColor)) {
    const [color, y, POV] = pieceColor === PieceColor.BLACK ? 
        [PieceColor.BLACK, 7, -1] : [PieceColor.WHITE, 0, 1];
    for (let x = 0; x < 8; x++) {
        const pPiece: Position = new Position(x, y);
        const pPawn:  Position = new Position(x, y+POV);
        initialPieces.set(pPiece.stringPosition, new Piece(pPiece, rankOrder[x], color));
        initialPieces.set(pPawn.stringPosition,  new Piece(pPawn,  PieceType.PAWN,    color));
    }
}
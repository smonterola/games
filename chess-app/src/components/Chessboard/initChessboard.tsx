import { Board, Piece, Position } from "../../models";
import { PieceType, PieceColor } from "../../Constants";
import { PieceMap } from "../../models";
import Rules from "../../rules/Rules";

const initialMap: PieceMap = new Map();

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
        initialMap.set(pPiece.string, new Piece(pPiece, rankOrder[x],  color));
        initialMap.set(pPawn.string,  new Piece(pPawn, PieceType.PAWN, color));
    }
}
const initialAttributes = [
     1, /* PieceColor.WHITE, this is the starting color */
     1, /* true, start out with castling rights to short */
     1, /* true, start out with castling rights to long */
    15, /* make 15 the default value for en passant which means null for us as it is not a valid file */
];

export const initialBoard = new Board(initialMap, initialAttributes);

/*
let rules = new Rules();

const [blackMoveMap, _basicBoards] = rules.populateValidMoves(
    initialMap,
    PieceColor.BLACK,
    initialMap.get("e8")!
)
export const [initialPieceMap, initialBoards] = rules.populateValidMoves(
    blackMoveMap, 
    PieceColor.WHITE, 
    initialMap.get("e1")!
);
*/
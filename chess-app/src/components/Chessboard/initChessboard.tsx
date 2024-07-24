import { Piece, Position } from "../../models";
import { 
    PieceType, 
    PieceColor,
} from "../../Constants";

export const initialPieces = new Map<string, Piece>();//: Piece[] = [];

const parent = "assets/images/";
const pieceSet = "default";

const rankOrder = new Map <number, PieceType>([
    [0, PieceType.ROOK],
    [1, PieceType.NGHT],
    [2, PieceType.BSHP],
    [3, PieceType.QUEN],
    [4, PieceType.KING],
    [5, PieceType.BSHP],
    [6, PieceType.NGHT],
    [7, PieceType.ROOK],
]);

for (let pieceColor of Object.values(PieceColor)) {
    const [color, y, POV] = pieceColor === PieceColor.BLACK ? 
        [PieceColor.BLACK, 7, -1] : [PieceColor.WHITE, 0, 1];
    for (let x = 0; x < 8; x++) {
        const pPiece: Position = new Position(x, y);
        const pPawn:  Position = new Position(x, y+POV);
        initialPieces.set(pPiece.stringPosition(), new Piece(pPiece, rankOrder.get(x)!, color));
        initialPieces.set(pPawn.stringPosition(),  new Piece(pPawn,  PieceType.PAWN,    color));
    }
}

/*export function generatePiece(color: PieceColor, type: PieceType = PieceType.QUEN) {
    let symbol = "q"
    switch(type) {
        case PieceType.BSHP:
            symbol = "b";
            break;
        case PieceType.ROOK:
            symbol = "r";
            break;
        case PieceType.NGHT:
            symbol = "n";
            break;
        default:
            symbol = "q";
            break;
    }
    const child = "_" + color + ".png";
    const piece: Piece = {
        image: `${parent}${pieceSet}/${symbol}${child}`,
        position: {x: -1, y: -1},
        type,
        color,
    }
    return piece;
}
    */
import { 
    Piece, 
    PieceType, 
    PieceColor,
} from "../../Constants";
import { stringPosition } from "../../rules/pieceLogic";

export const initialPieces = new Map<string, Piece>();//: Piece[] = [];

const parent = "assets/images/";
const pieceSet = "default";

const rankOrder = new Map <number, [string, PieceType]>([
    [0, ["r", PieceType.ROOK]],
    [1, ["n", PieceType.NGHT]],
    [2, ["b", PieceType.BSHP]],
    [3, ["q", PieceType.QUEN]],
    [4, ["k", PieceType.KING]],
    [5, ["b", PieceType.BSHP]],
    [6, ["n", PieceType.NGHT]],
    [7, ["r", PieceType.ROOK]],
]);

for (let pieceColor of Object.values(PieceColor)) {
    const [color, y, POV] = pieceColor === PieceColor.BLACK ? 
        [PieceColor.BLACK, 7, -1] : [PieceColor.WHITE, 0, 1];
    const child = "_" + pieceColor + ".png";
    for (let x = 0; x < 8; x++) {
        const [symbol, type] = [rankOrder.get(x)![0], rankOrder.get(x)![1]];
        initialPieces.set(stringPosition({x, y}), { image: `${parent}${pieceSet}/${symbol}${child}`, position: {x, y}, type, color});
        initialPieces.set(stringPosition({x, y:y+POV}), { image: `${parent}${pieceSet}/p${child}`, position: {x, y: y+POV}, type: PieceType.PAWN, color});
    }
}

export function generatePiece(color: PieceColor, type: PieceType = PieceType.QUEN) {
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
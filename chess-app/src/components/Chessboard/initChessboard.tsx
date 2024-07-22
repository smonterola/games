import { 
    Piece, 
    PieceType, 
    PieceColor,
} from "../../Constants";
import { stringPosition } from "../../rules/pieceLogic";

export let initialPieces = new Map<string, Piece>();//: Piece[] = [];

const parent = "assets/images/";
const pieceSet = "palmpals";

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

for (let color = 0; color < 2; color++) {
    const [pieceColor, colorFlag, y, POV] = !(color) ? [PieceColor.BLACK, "b", 7, -1] : [PieceColor.WHITE, "w", 0, 1];
    const child = "_" + colorFlag + ".png";
    for (let x = 0; x < 8; x++) {
        const [symbol, type] = [rankOrder.get(x)![0], rankOrder.get(x)![1]];
        initialPieces.set(stringPosition({x, y}), { image: `${parent}${pieceSet}/${symbol}${child}`, position: {x, y}, type, color: pieceColor});
        initialPieces.set(stringPosition({x, y:y+POV}), { image: `${parent}${pieceSet}/p${child}`, position: {x, y: y+POV}, type: PieceType.PAWN, color: pieceColor});
    }
}
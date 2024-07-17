import { 
    Piece, 
    PieceType, 
    PieceColor,
} from "../../Constants";

export const initialBoardState: Piece[] = [];

const parent = "assets/images/";

for (let color = 0; color < 2; color++) {
    const [pieceColor, colorFlag, y] = (!(color)) ? [PieceColor.BLACK, "b", 7] : [PieceColor.WHITE, "w", 0];
    const child = "_" + colorFlag + ".png"
    
    initialBoardState.push({ image: `${parent}rook${child}`,   position: {x: 0, y}, type: PieceType.ROOK, color: pieceColor});
    initialBoardState.push({ image: `${parent}knight${child}`, position: {x: 1, y}, type: PieceType.NGHT, color: pieceColor});
    initialBoardState.push({ image: `${parent}bishop${child}`, position: {x: 2, y}, type: PieceType.BSHP, color: pieceColor});
    initialBoardState.push({ image: `${parent}queen${child}`,  position: {x: 3, y}, type: PieceType.QUEN, color: pieceColor});
    initialBoardState.push({ image: `${parent}king${child}`,   position: {x: 4, y}, type: PieceType.KING, color: pieceColor});
    initialBoardState.push({ image: `${parent}bishop${child}`, position: {x: 5, y}, type: PieceType.BSHP, color: pieceColor});
    initialBoardState.push({ image: `${parent}knight${child}`, position: {x: 6, y}, type: PieceType.NGHT, color: pieceColor});
    initialBoardState.push({ image: `${parent}rook${child}`,   position: {x: 7, y}, type: PieceType.ROOK, color: pieceColor});
    for (let rank = -1; rank <= 1; rank+=2) {
        for (let file = 0; file < 8; file++) {
            initialBoardState.push({ image: `${parent}pawn${child}`, position: {x: file, y: y+rank}, type: PieceType.PAWN, color: pieceColor});
        }
    }
}
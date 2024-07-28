import { PieceType } from "../../Constants";
import { Piece, PieceMap, Position } from "../../models";
import { deepClone } from "../../rules/History/Clone";

//consider making this a class
export function updatePieceMap(
    pieceMap: PieceMap, 
    p0: Position, 
    p1: Position, 
    movePiece: Piece,
){  
    //DEEP CLONING
    //MAKING NEW COPY? maybe?
    const newPieceMap: PieceMap = deepClone(pieceMap); //might need to make copies if this is bugged
    //DELETING WHERE PIECE WAS
    newPieceMap.delete(p0.string);
    //PAWN BEHAVIOR
    if (movePiece.type === PieceType.PAWN) {
        //EN PASSANT CHECKER
        const clearPosition = //enPassant checker
            (movePiece.type === PieceType.PAWN && !newPieceMap.has(p1.string)) ? 
            new Position(p1.x, p0.y) : p1;
        newPieceMap.delete(clearPosition.string);
        //CHECKING FOR PROMOTION
        if (canPromote(movePiece)) {
            movePiece = promotePawn(movePiece, PieceType.QUEN);
            movePiece.position = p1;
        }
    }
    //KING BEHAVIOR => MOVING ROOK TO SUIT KING
    if (movePiece.type === PieceType.KING && Math.abs(p1.x - p0.x) === 2) {
        const shift: number = Math.sign(p1.x - p0.x);
        const rookX = shift === 1 ? 7 : 0; 
        const moveRook: Piece = pieceMap.get(new Position(rookX, p0.y).string)!;
        //console.log(moveRook)
        newPieceMap.delete(moveRook.position.string)
        moveRook.position.x = p1.x - shift;
        newPieceMap.set(moveRook.position.string, moveRook);
        //console.log(moveRook)
    }
    //MOVING PIECE TO NEW SQUARE
    if (!p0.samePosition(p1)) {
        //movePiece.hasMoved = true;
    }
    newPieceMap.set(p1.string, movePiece);
    //console.log(evaluate(newPieceMap))
    return newPieceMap;
}
export function canPromote(
    piece: Piece,
) {
    return (
        piece.type === PieceType.PAWN && 
        (piece.position.y === 0 || piece.position.y === 7)
    );
}
export function promotePawn(
    pawn: Piece,
    pieceType: PieceType,
){
    const newPiece: Piece = new Piece(pawn.position, pieceType, pawn.color);
    newPiece.hasMoved = true;
    return newPiece;
}
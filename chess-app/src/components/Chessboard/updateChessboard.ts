import { PieceType } from "../../Constants";
import { Piece, PieceMap, Position } from "../../models";
import { deepClone } from "../../rules/History/Clone";

//consider making this a class
export function updatePieceMap(
    pieceMap: PieceMap, 
    p0: Position, 
    p1: Position, 
    piece: Piece,
){  
    let movePiece = piece.clone();
    movePiece.hasMoved = piece.hasMoved;
    movePiece.enPassant = piece.enPassant;

    //DEEP CLONING
    //MAKING NEW COPY? maybe?
    const newPieceMap: PieceMap = deepClone(pieceMap); //might need to make copies if this is bugged
    //DELETING WHERE PIECE WAS
    newPieceMap.delete(p0.string);
    //PAWN BEHAVIOR
    if (movePiece.type === PieceType.PAWN) {
        //CHECKING FOR PROMOTION
        if (p1.y === 0 || p1.y === 7) {
            movePiece.type = PieceType.QUEN;
            console.log("can promote")
            //movePiece = promotePawn(movePiece.clone(), PieceType.QUEN);
        } else {
            //EN PASSANT CHECKER
            const enPassantP = new Position(p1.x, p0.y);
            const canEnPassant = newPieceMap.get(enPassantP.string)?.enPassant === true //&& newPieceMap.get(enPassantP.string)?.type === PieceType.PAWN
            if (canEnPassant) {
                newPieceMap.delete(enPassantP.string);
            }
        }   
    }
    //KING BEHAVIOR => MOVING ROOK TO SUIT KING
    if (movePiece.type === PieceType.KING && Math.abs(p1.x - p0.x) === 2) {
        const shift: number = Math.sign(p1.x - p0.x);
        const rookX = shift === 1 ? 7 : 0; 
        const moveRook: Piece = pieceMap.get(new Position(rookX, p0.y).string)!;
        newPieceMap.delete(moveRook.position.string)
        moveRook.position.x = p1.x - shift;
        newPieceMap.set(moveRook.position.string, moveRook);
    }
    //MOVING PIECE TO NEW SQUARE
    if (!p0.clone().samePosition(p1.clone())) {
        movePiece.hasMoved = true;
    }
    movePiece.position = p1;
    newPieceMap.set(p1.string, movePiece);
    //console.log("update:")
    //console.log(newPieceMap)
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
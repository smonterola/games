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
    const newPieceMap: PieceMap = deepClone(pieceMap);
    
    let movePiece = piece.clone();
    const doublePawn: boolean = movePiece.type === PieceType.PAWN && Math.abs(p1.y - p0.y) === 2;
    //DELETING WHERE PIECE WAS
    newPieceMap.delete(p0.string);
    //PAWN BEHAVIOR
    if (movePiece.type === PieceType.PAWN) {
        //CHECKING FOR PROMOTION
        if (p1.y === 0 || p1.y === 7) {
            movePiece = promotePawn(movePiece, PieceType.QUEN);
        } else {
            //EN PASSANT CHECKER
            const enPassantP = new Position(p1.x, p0.y);
            const pawn = newPieceMap.get(enPassantP.string); 
            const canEnPassant = (
                pawn?.type === PieceType.PAWN &&
                pawn?.color !== movePiece.color && 
                (p1.y === 4 || p1.y === 5)
            );
            if (canEnPassant) {
                newPieceMap.delete(enPassantP.string);
            }
        }   
    }
    //KING BEHAVIOR => MOVING ROOK TO SUIT KING
    else if (movePiece.type === PieceType.KING && Math.abs(p1.x - p0.x) === 2) {
        const shift: number = Math.sign(p1.x - p0.x);
        const rookX = shift === 1 ? 7 : 0; 
        const moveRook: Piece = pieceMap.get(new Position(rookX, p0.y).string)!;
        newPieceMap.delete(moveRook.position.string)
        moveRook.position.x = p1.x - shift;
        newPieceMap.set(moveRook.position.string, moveRook);
    }
    //MOVING PIECE TO NEW SQUARE
    if (!p0.samePosition(p1)) {
        movePiece.hasMoved = true;
        movePiece.position = p1;
        movePiece.enPassant = doublePawn;
    }
    newPieceMap.set(p1.string, movePiece);
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
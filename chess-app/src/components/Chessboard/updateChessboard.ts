import { PieceType } from "../../Constants";
import { evaluate } from "../../engine/evaluate";
import { Piece, Position } from "../../models";

//consider making this a class
export function updatePieceMap(
    pieceMap: Map<string, Piece>, 
    p0: Position, 
    p1: Position, 
    movePiece: Piece,
){  
    //MAKING NEW COPY? maybe?
    const newPieceMap = pieceMap; //might need to make copies if this is bugged
    //DELETING WHERE PIECE WAS
    newPieceMap.delete(p0.stringPosition())
    //PAWN BEHAVIOR
    if (movePiece.type === PieceType.PAWN) {
        //EN PASSANT CHECKER
        const clearPosition = //enPassant checker
            (movePiece.type === PieceType.PAWN && !newPieceMap.has(p1.stringPosition())) ? 
            new Position(p1.x, p0.y) : p1;
        newPieceMap.delete(clearPosition.stringPosition());
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
        const moveRook: Piece = pieceMap.get(new Position(rookX, p0.y).stringPosition())!;
        newPieceMap.delete(moveRook.position.stringPosition())
        moveRook.position.x = p1.x - shift;
        newPieceMap.set(moveRook.position.stringPosition(), moveRook);
    }
    //MOVING PIECE TO NEW SQUARE
    movePiece.hasMoved = true;
    newPieceMap.set(p1.stringPosition(), movePiece);
    console.log(movePiece)
    console.log(evaluate(newPieceMap))
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
    //const newPieceMap = pieceMap;
    const newPiece: Piece = new Piece(pawn.position, pieceType, pawn.color);
    newPiece.hasMoved = true;
    return newPiece;
}
/*
export function castle(
    pieceMap: Map<string, Piece>,
    king: Piece,
    rook: Piece,
){
    const newPieceMap = pieceMap;
    newPieceMap.delete(king.position.stringPosition()); //deleting king
    newPieceMap.delete(rook.position.stringPosition()); //deleting rook
    [rook.position.x, king.position.x] = rook.position.x === 0 ? [3, 2] : [5, 6];
    newPieceMap.set(rook.position.stringPosition(), rook);
    newPieceMap.set(king.position.stringPosition(), king);
    return newPieceMap;
}*/
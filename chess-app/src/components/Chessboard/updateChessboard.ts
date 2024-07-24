import { PieceType } from "../../Constants";
import { evaluate } from "../../engine/evaluate";
import { Piece, Position } from "../../models";
//import { generatePiece } from "./initChessboard";

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
    return newPiece;
}

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
}
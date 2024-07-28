import { Piece, PieceMap, Position, PositionMap } from "../models";
import { PieceType, PieceColor } from "../Constants";
import { mapMoves, movePawn } from "."
import { castle, isCheck } from "./pieces/King";
import { updatePieceMap } from "../components/Chessboard/updateChessboard";
import { evaluate } from "../engine/evaluate";
import { cloneMoves, deepClone } from "./History/Clone";
export default class Rules {
    canMovePiece(
        p0: Position, //old
        p1: Position, //new
        pieceMap: PieceMap,
    ): boolean {
        const validMove = pieceMap.has(p0.string) ? 
            pieceMap.get(p0.string)!.moveMap?.has(p1.string) : false;
        return validMove ? true : false;
    }

    populateValidMoves(
        pieceMap: PieceMap,
        color: PieceColor,
        king: Piece,
    ): PieceMap {
        const pMap = deepClone(pieceMap);
        for (let piece of pMap.values()) {
            if (piece.color !== color) {
                piece.moveMap?.clear();
                continue;
            }
            if (piece.type === PieceType.PAWN) { 
                [piece.moveMap, piece.enPassant] = movePawn(pMap, piece.position, color);
            } else if (piece.type === PieceType.KING) {
                piece.moveMap = mapMoves(pMap, piece);
                piece.moveMap = castle(pMap, piece, piece.moveMap);
            } else {
                piece.moveMap = mapMoves(pMap, piece);
            }
            piece.moveMap = new Map(this.filterMoves(pMap, piece, king)); //this is what needs to be fixed
        }
        return pMap;
    }

    verifyMove(
        pieceMap: PieceMap,
        piece: Piece,
        destination: Position,
        king: Piece,
    ): [boolean, PieceMap, number] { //return legal moves. Also return the would be newPieceMap and the would be evaluation
        const newPieceMap = new Map(updatePieceMap(
            pieceMap, 
            piece.position, 
            destination,
            piece,
        ));
        const pKing = (piece.type !== PieceType.KING) ? king.position : destination;
        if (isCheck(newPieceMap, pKing, piece.color)) {
            return [false, new Map(), 0];
        }
        return [true, newPieceMap, evaluate(newPieceMap)];
    }

    filterMoves(
        pieceMap: PieceMap,
        piece: Piece,
        king: Piece,
    ): PositionMap {
        const pMap: PieceMap = deepClone(pieceMap);
        const moveMap = cloneMoves(piece.moveMap!)
        for (const destination of moveMap.values()) {
            const [isLegal, newPieceMap, evaluation] = this.verifyMove(
                pMap, 
                piece, 
                destination,
                king
            );
            if (!isLegal) moveMap.delete(destination.string);
        }
        return moveMap;
    }
}
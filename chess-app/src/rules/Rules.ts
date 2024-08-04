import { BoardMap, Piece, PieceMap, Position, PositionMap } from "../models";
import { PieceType, PieceColor, GameState } from "../Constants";
import { mapMoves, movePawn } from "."
import { castle, isCheck } from "./pieces/King";
import { updatePieceMap } from "../components/Chessboard/updateChessboard";
import { evaluate } from "../engine";
import { deepClone } from "./History/Clone";

export default class Rules {
    canMove(
        nextBoards: BoardMap,
        encoding: string, //pass to here in case it is not a map anymore
    ): boolean { //need to change this to encoding
        return nextBoards.has(encoding);
    }

    populateValidMoves(
        pieceMap: PieceMap,
        color: PieceColor,
        king: Piece,
    ): [PieceMap, BoardMap] {
        const pMap: PieceMap = (pieceMap);
        const longBoards: BoardMap = new Map();
        for (let piece of pMap.values()) {
            let destinationBoards: BoardMap = new Map();
            if (piece.color !== color) {
                //piece.moveMap?.clear();
                continue; //check if this should be cleared or not
            }
            if (piece.type === PieceType.PAWN) { 
                piece.moveMap = movePawn(pMap, piece.position, color);
            } else if (piece.type === PieceType.KING) {
                piece.moveMap = mapMoves(pMap, piece);
                piece.moveMap = castle(pMap, piece, piece.moveMap);
            } else {
                piece.moveMap = mapMoves(pMap, piece);
            }
            [piece.moveMap, destinationBoards] = this.filterMoves(pMap, piece, king); //this is what needs to be fixed
            for (let [destination, [nextBoard, score]] of destinationBoards) {
                const capture = (pMap.size - nextBoard.size) ? "" : ""
                longBoards.set(
                    piece.type + 
                    piece.position.string +
                    capture +
                    destination, 
                    [(nextBoard), score]
                );
            }
        }
        return [pMap, longBoards];
    }

    verifyMove(
        pieceMap: PieceMap,
        piece: Piece,
        destination: Position,
        king: Piece,
    ): [boolean, PieceMap, number] { //return legal moves. Also return the would be newPieceMap and the would be evaluation
        const nextPieceMap = updatePieceMap(
            pieceMap, 
            piece.position, 
            destination,
            piece,
        );
        const pKing = (piece.type !== PieceType.KING) ? 
            king.position : 
            destination;
        
        if (isCheck(nextPieceMap, pKing, piece.color)) {
            return [false, new Map(), 0];
        }
        return [true, nextPieceMap, evaluate(nextPieceMap)];
    }

    filterMoves(
        pieceMap: PieceMap,
        piece: Piece,
        king: Piece,
    ): [PositionMap, BoardMap] {
        const pMap: PieceMap = deepClone(pieceMap); //needs to stay to protect the rook //tried many times to remove it but it has to stay
        const moveMap = (piece.moveMap!);
        const destinationBoards: BoardMap = new Map()
        for (const destination of moveMap.values()) {
            const [isLegal, nextPieceMap, evaluation] = this.verifyMove(
                pMap, 
                piece, 
                destination,
                king
            );
            if (!isLegal) {
                moveMap.delete(destination.string);
            } else {
                destinationBoards.set(destination.string, [(nextPieceMap), evaluation]);
            }
        }
        return [moveMap, destinationBoards];
    }

    getStatus(
        futures: BoardMap,
        pieceMap: PieceMap,
        king: Piece,
    ): GameState { //uses prime number properties for logic
        const check: number = isCheck(pieceMap, king.position, king.color) ? 
            2 : 3;
        const moves: number = futures.size === 0 ?
            5 : 7;
        switch(check * moves) {
            case 10: 
                return GameState.CHECKMATE;
            case 14: 
                return GameState.CHECK;
            case 15: 
                return GameState.STALEMATE;
            default:
                return GameState.PLAY;
        }
    }
}
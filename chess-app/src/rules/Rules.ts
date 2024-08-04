import { BoardMap, Piece, PieceMap, Position, PositionMap } from "../models";
import { PieceType, PieceColor, GameState } from "../Constants";
import { mapMoves, movePawn } from "."
import { castle, isCheck } from "./pieces/King";
import { updateBoard } from "../components/Chessboard/updateChessboard";
import { evaluate } from "../engine";
import { deepClone } from "./History/Clone";
import { Board } from "../models";

export default class Rules {
    canMove(
        nextBoards: BoardMap,
        encoding: string, //pass to here in case it is not a map anymore
    ): boolean { //need to change this to encoding
        return nextBoards.has(encoding);
    }

    populateValidMoves(
        board: Board,
        color: PieceColor,
        king: Piece,
    ): [PieceMap, BoardMap] {
        const pMap: PieceMap = (board.pieces);
        const nextBoards: BoardMap = new Map();
        for (let piece of pMap.values()) {
            let destinationBoards: BoardMap = new Map();
            if (piece.color !== color) {
                continue; //check if this should be cleared or not
            }
            switch (piece.type) {
                case PieceType.PAWN:
                    piece.moveMap = movePawn(board, piece.position);
                    break;
                case PieceType.KING:
                    piece.moveMap = castle(board, piece);
                    break;
                default:
                    piece.moveMap = mapMoves(pMap, piece);
                    break;
            }
            [piece.moveMap, destinationBoards] = this.filterMoves(
                new Board(pMap, board.attributes),
                piece, 
                king
            );
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
        const nextPieceMap = updateBoard( //change the attributes here
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
        board: Board,
        piece: Piece,
        king: Piece,
    ): [PositionMap, BoardMap] {
        const pMap: PieceMap = deepClone(board.pieces); //needs to stay to protect the rook //tried many times to remove it but it has to stay
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
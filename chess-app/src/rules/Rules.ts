import { BoardMap, Piece, PieceMap, Position, PositionMap } from "../models";
import { PieceType, nextTurn, GameState } from "../Constants";
import { mapMoves, movePawn } from "."
import { castle, findKingKey, isCheck } from "./pieces/King";
import { updateBoard } from "../components/Chessboard/updateChessboard";
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
        king: Piece,
        enemyKing: string,
    ): [Board, BoardMap] {
        const pMap: PieceMap = (board.pieces);
        const attributes = board.attributes;
        const nextBoards: BoardMap = new Map();
        const enemyKingKey = findKingKey(pMap, enemyKing, nextTurn(king.color));
        for (let piece of pMap.values()) {
            let destinationBoards: BoardMap = new Map();
            if (piece.color !== king.color) {
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
                new Board(pMap, attributes),
                piece, 
                king,
                enemyKingKey,
            );
            for (let [move, nextBoard] of destinationBoards) {
                nextBoards.set(move, nextBoard);
            }
        }
        board.setBoard(pMap);
        return [board, nextBoards];
    }

    verifyMove(
        board: Board,
        piece: Piece,
        destination: Position,
        king: Piece,
        enemyKingKey: string,
    ): [boolean, string, Board] { //return legal moves. Also return the would be newPieceMap and the would be evaluation
        const [move, nextBoard] = updateBoard( //change the attributes here
            board, 
            piece.position, 
            destination,
            king.position.string,
            enemyKingKey,
        );

        const pKing = (piece.type !== PieceType.KING) ? 
            king.position : destination;
        
        if (isCheck(nextBoard.pieces, pKing, piece.color)) {
            return [false, "#hangingMate#", nextBoard];
        }
        return [true, move, nextBoard];
    }

    filterMoves(
        board: Board,
        piece: Piece,
        king: Piece,
        enemyKing: string,
    ): [PositionMap, BoardMap] {
        const pMap: PieceMap = board.pieces; //does NOT need deep clone
        const moveMap = piece.moveMap ? piece.moveMap : new Map();
        const destinationBoards: BoardMap = new Map();
        const enemyKingKey = findKingKey(pMap, enemyKing, nextTurn(piece.color));
        for (const destination of moveMap.values()) {
            const [isLegal, move, nextBoard] = this.verifyMove(
                board, 
                piece, 
                destination,
                king,
                enemyKingKey,
            );
            if (!isLegal) {
                moveMap.delete(destination.string);
            } else {
                destinationBoards.set(move, nextBoard);
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
        //return GameState.PLAY;
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
import { PieceColor, PieceType, xAxis } from "../Constants";
import { Board, PieceMap, Position } from "../models";
import { Piece } from "../models";


export function boardToFen(board: Board): string {
    const pieceMap = board.pieces;
    let fen: string = "";
    for (let rank = 7; rank >= 0; rank--) {
        let emptySpaces = 0;
        for (let file = 0; file <= 7; file++) {
            const p: Position = new Position(file, rank);
            if (!pieceMap.has(p.string)) {
                emptySpaces++;
            } else {
                if (emptySpaces > 0) {
                    fen += `${emptySpaces}`
                    emptySpaces = 0;
                }
                const piece: Piece = pieceMap.get(p.string)!;
                fen += pieceFen(piece.type, piece.color);
            }
        }
        if (emptySpaces > 0) {
            fen += `${emptySpaces}`;
        }
        if (rank > 0) fen += "/";
    }
    const attributes = board.attributes;
    const color: string = (attributes[0]) ? "w" : "b";
    const wS: string = (attributes[1]) ? "K" : "";
    const wL: string = (attributes[2]) ? "Q" : "";
    const bS: string = (attributes[3]) ? "k" : "";
    const bL: string = (attributes[4]) ? "q" : "";
    let castling = wS + wL + bS + bL;
    if (castling === "") {
        castling = "-";
    }
    const enPassantFile: number = attributes[5];
    let enPassant: string = "-";
    if (enPassantFile !== 15) {
        const rank: number = (color !== "w") ? 3 : 6;
        enPassant = xAxis[enPassantFile] + `${rank}`;
    }
    fen += " " + color + " " + castling + " " + enPassant + " " + `${attributes[6]} ${attributes[7]}`;
    return fen;
}

export function fenToBoard(fen: string) {
    const [pieces, color, castling, enPassant, halfMoves, moveCount] = fen.split(" ", 6);
    const ranks = pieces.split("/", 8);

    const pieceMap: PieceMap = new Map();
    for (let rank = 7; rank >= 0; rank--) {
        let x = 0;
        const pieceRow: string = ranks[rank];
        while(x < 8) {
            //pieceRow[]
        }
    }
}

function pieceFen(type: PieceType, color: PieceColor): string {
    const char: string = type === PieceType.PAWN ? "P" : `${type}`;
    if (color === PieceColor.WHITE) {
        return char;
    }
    return char.toLowerCase();
}
/*
function fenPiece(char: string, p: Position): Piece {

}*/

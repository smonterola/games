import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Rules from "../../rules/Rules";

const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
//look at viewport | responsive design
const tileSize = 100;

export interface Piece {
    image: string;
    x: number;
    y: number;
    type: PieceType;
    color: PieceColor;
}

export enum PieceType {
    PAWN,
    BSHP,
    NGHT,
    ROOK,
    QUEN,
    KING,
}

export enum PieceColor {
    WHITE,
    BLACK,
}
const parent = "assets/images/";

const initialBoardState: Piece[] = [];

for (let color = 0; color < 2; color++) {
    const [pieceColor, colorFlag, y] = (!(color)) ? [PieceColor.BLACK, "b", 7] : [PieceColor.WHITE, "w", 0];
    const child = "_" + colorFlag + ".png"
    
    initialBoardState.push({ image: `${parent}rook${child}`,   x: 0, y, type: PieceType.ROOK, color: pieceColor})
    initialBoardState.push({ image: `${parent}knight${child}`, x: 1, y, type: PieceType.NGHT, color: pieceColor})
    initialBoardState.push({ image: `${parent}bishop${child}`, x: 2, y, type: PieceType.BSHP, color: pieceColor})
    initialBoardState.push({ image: `${parent}queen${child}`,  x: 3, y, type: PieceType.QUEN, color: pieceColor})
    initialBoardState.push({ image: `${parent}king${child}`,   x: 4, y, type: PieceType.KING, color: pieceColor})
    initialBoardState.push({ image: `${parent}bishop${child}`, x: 5, y, type: PieceType.BSHP, color: pieceColor})
    initialBoardState.push({ image: `${parent}knight${child}`, x: 6, y, type: PieceType.NGHT, color: pieceColor})
    initialBoardState.push({ image: `${parent}rook${child}`,   x: 7, y, type: PieceType.ROOK, color: pieceColor})
    for (let rank = -1; rank <= 1; rank+=2) {
        for (let file = 0; file < 8; file++) {
            initialBoardState.push({ image: `${parent}pawn${child}`, x: file, y: y+rank, type: PieceType.PAWN, color: pieceColor})
        }
    }
}

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const rules = new Rules();
    
    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / tileSize));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - tileSize*8) / tileSize)));
            const x = e.clientX - tileSize/2; //fix this when flex scaling
            const y = e.clientY - tileSize/2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - tileSize/4;
            const minY = chessboard.offsetTop  - tileSize/4;
            const maxX = chessboard.offsetLeft - tileSize/4*3 + chessboard.clientWidth;
            const maxY = chessboard.offsetTop  - tileSize/4*3 + chessboard.clientHeight;
            const x = e.clientX - tileSize/2; //fix this when flex scaling
            const y = e.clientY - tileSize/2;
            activePiece.style.position = "absolute";
            
            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / tileSize);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - tileSize*8) / tileSize));
            
            const movePiece = pieces.find(p => p.x === gridX && p.y === gridY);
            const gonePiece = pieces.find(p => p.x ===     x && p.y ===     y);
            if (movePiece) {
                const validMove = rules.isValidMove(
                    gridX, 
                    gridY, 
                    x, 
                    y, 
                    movePiece.type, 
                    movePiece.color, 
                    pieces,
                );
                if (validMove) {
                    const newPieces = pieces.reduce((results, piece) => {
                        if (piece.x === movePiece.x && piece.y === movePiece.y) {
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        } else if (!(piece.x === x && piece.y === y)) {
                            results.push(piece);
                        }
                        return results;
                    }, [] as Piece[]);
                    setPieces(newPieces);
                }
            } else {
                activePiece.style.position = "relative";
                activePiece.style.removeProperty("top");
                activePiece.style.removeProperty("left");
            }
            setActivePiece(null);
        }
    }
    let board = [];
    for (let j = yAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < xAxis.length; i++) {
            const number = i+j;
            let image = undefined;

            pieces.forEach((p) => {
                if (p.x === i && p.y === j) {
                    image = p.image;
                }
            });
            board.push(<Tile key={`${i}${j}`} image={image} number={number}/>)
        }
    }
    return (
        <div 
            onMouseMove={(e) => movePiece(e)}
            onMouseDown={(e) => grabPiece(e)} 
            onMouseUp  ={(e) => dropPiece(e)}  
            id="chessboard"
            ref={chessboardRef}
        >   
            {board}
        </div>
    );
}
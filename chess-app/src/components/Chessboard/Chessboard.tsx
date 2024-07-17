import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Rules from "../../rules/Rules";
import { 
    xAxis, 
    yAxis, 
    tileSize, 
    Piece,
    Position,
    samePosition,
} from "../../Constants";
import { initialBoardState } from "./initChessboard";

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [getPosition, setPosition] = useState<Position>({x: -1, y: -1})
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const rules = new Rules();
    
    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            const getX = (Math.floor((e.clientX - chessboard.offsetLeft) / tileSize));
            const getY = (Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - tileSize*8) / tileSize)));
            setPosition({x: getX, y: getY});
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
            //controls the boundaries
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
            const x = Math.floor(
                (e.clientX - chessboard.offsetLeft) / tileSize
            );
            const y = Math.abs(
                Math.ceil(
                    (e.clientY - chessboard.offsetTop - tileSize*8) / tileSize
                )
            );
            const cursorP: Position = {x, y};
            const movePiece = pieces.find(p => samePosition(p.position, getPosition));
            if (movePiece) {
                const validMove = rules.isValidMove(
                    getPosition, 
                    cursorP,
                    movePiece.type, 
                    movePiece.color, 
                    pieces,
                );
                if (validMove) {
                    const newPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, getPosition)) {
                            piece.position = cursorP;
                            results.push(piece);
                        } else if (!(samePosition(piece.position, cursorP))) {
                            results.push(piece);
                        }
                        return results;
                    }, [] as Piece[]);
                    setPieces(newPieces);
                } else {
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
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
                if (samePosition(p.position, {x: i, y: j})) {
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
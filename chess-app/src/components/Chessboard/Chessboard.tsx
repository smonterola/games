import { MouseEvent, useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";

const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
//look at viewport | responsive design
const tileSize = 100;

interface Piece {
    image: string
    x: number
    y: number
}

const parent = "assets/images/";

const initialBoardState: Piece[] = [];

for (let color = 0; color < 2; color++) {
    const cF = (color === 0) ? "b" : "w"; // cF is colorFlag
    const y = (color === 0) ? 7 : 0; //flip from 8th rank to 1st rank
    const child = "_" + cF + ".png"
    
    initialBoardState.push({ image: `${parent}rook${child}`,   x: 0, y})
    initialBoardState.push({ image: `${parent}knight${child}`, x: 1, y})
    initialBoardState.push({ image: `${parent}bishop${child}`, x: 2, y})
    initialBoardState.push({ image: `${parent}queen${child}`,  x: 3, y})
    initialBoardState.push({ image: `${parent}king${child}`,   x: 4, y})
    initialBoardState.push({ image: `${parent}bishop${child}`, x: 5, y})
    initialBoardState.push({ image: `${parent}knight${child}`, x: 6, y})
    initialBoardState.push({ image: `${parent}rook${child}`,   x: 7, y})
    for (let rank = -1; rank <= 1; rank+=2) {
        for (let file = 0; file < 8; file++) {
            initialBoardState.push({ image: `${parent}pawn${child}`, x: file, y: y+rank})
        }
    }
}

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState)
    const chessboardRef = useRef<HTMLDivElement>(null);
    
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
            const maxX = chessboard.offsetLeft - tileSize/4*3 + chessboard.clientHeight;
            const maxY = chessboard.offsetTop  - tileSize/4*3 + chessboard.clientWidth;
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
            
            setPieces((value) => {
                const pieces = value.map((p) => {
                    if (p.x === gridX && p.y === gridY) {
                        p.x = x;
                        p.y = y;
                    }
                    return p;
                });
                return pieces;
            })
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
            })
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
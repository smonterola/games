import { MouseEvent, useRef } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";

const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
    image: string
    x: number
    y: number
}

const pieces: Piece[] = [];
const parent = "assets/images/";
for (let color = 0; color < 2; color++) {
    const cF = (color === 0) ? "b" : "w"; // cF is colorFlag
    const y = (color === 0) ? 7 : 0; //flip from 8th rank to 1st rank
    const child = "_" + cF + ".png"

    pieces.push({ image: `${parent}rook${child}`,   x: 0, y})
    pieces.push({ image: `${parent}knight${child}`, x: 1, y})
    pieces.push({ image: `${parent}bishop${child}`, x: 2, y})
    pieces.push({ image: `${parent}queen${child}`,  x: 3, y})
    pieces.push({ image: `${parent}king${child}`,   x: 4, y})
    pieces.push({ image: `${parent}bishop${child}`, x: 5, y})
    pieces.push({ image: `${parent}knight${child}`, x: 6, y})
    pieces.push({ image: `${parent}rook${child}`,   x: 7, y})
    for (let rank = -1; rank <= 1; rank+=2) {
        for (let file = 0; file < 8; file++) {
            pieces.push({ image: `${parent}pawn${child}`, x: file, y: y+rank})
        }
    }
}

export default function Chessboard() {
    const chessboardRef = useRef<HTMLDivElement>(null);
    
    let activePiece: HTMLElement | null = null;
    
    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        if (element.classList.contains("chess-piece")) {
            const x = e.clientX - 50; //fix this when flex scaling
            const y = e.clientY - 50;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            activePiece = element;
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop  - 25;
            const maxX = chessboard.offsetLeft - 75 + chessboard.clientHeight;
            const maxY = chessboard.offsetTop  - 75 + chessboard.clientWidth;
            const x = e.clientX - 50; //fix this when flex scaling
            const y = e.clientY - 50;
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
        if (activePiece) {
            activePiece = null;
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
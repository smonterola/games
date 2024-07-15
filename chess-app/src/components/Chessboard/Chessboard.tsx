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
            board.push(<Tile image={image} number={number}/>)
        }
    }
    return <div id="chessboard">{board}</div>;
}
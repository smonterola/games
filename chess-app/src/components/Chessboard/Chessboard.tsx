import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Rules from "../../rules/Rules";
import { 
    xAxis, 
    yAxis, 
    TILESIZE, 
    Piece,
    Position,
    PieceColor,
} from "../../Constants";
import { initialPieces } from "./initChessboard";
import { checkBounds, samePosition, stringPosition, nextTurn, pgnToString } from "../../rules/pieceLogic";

let moveCounter = 1;
const pgn = new Map<number, string>();
let turn: PieceColor = PieceColor.WHITE;
//let currMoves: string = ""

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [getPosition, setPosition] = useState<Position>({x: -1, y: -1})
    const [pieceMap, setPieceMap] = useState(new Map<string, Piece>(initialPieces));
    const chessboardRef = useRef<HTMLDivElement>(null);
    const rules = new Rules();

    //let pieceMap = new Map<string, Piece>(initialPieces);

    //for piece
    
    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (!chessboard || !element.classList.contains("chess-piece")) {
            return;
        }
        const getX = (Math.floor((e.clientX - chessboard.offsetLeft) / TILESIZE));
        const getY = (Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - TILESIZE*8) / TILESIZE)));
        setPosition({x: getX, y: getY});
        const x = e.clientX - TILESIZE/2; //fix this when flex scaling
        const y = e.clientY - TILESIZE/2;
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        setActivePiece(element);
    }
    
    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (!chessboard || !activePiece) {
            return;
        }
        const minX = chessboard.offsetLeft - TILESIZE/4;
        const minY = chessboard.offsetTop  - TILESIZE/4;
        const maxX = chessboard.offsetLeft - TILESIZE/4*3 + chessboard.clientWidth;
        const maxY = chessboard.offsetTop  - TILESIZE/4*3 + chessboard.clientHeight;
        const x = e.clientX - TILESIZE/2; //fix this when flex scaling
        const y = e.clientY - TILESIZE/2;
        activePiece.style.position = "absolute";
        //controls the boundaries
        if (x < minX)        { 
            activePiece.style.left = `${minX}px`; //setActivePiece(null); 
        } else if (x > maxX) { 
            activePiece.style.left = `${maxX}px`; //setActivePiece(null); 
        } else               { 
            activePiece.style.left = `${x}px`;
        }
        if (y < minY)        { 
            activePiece.style.top = `${minY}px`; //setActivePiece(null); 
        } else if (y > maxY) { 
            activePiece.style.top = `${maxY}px`; //setActivePiece(null); 
        } else               { 
            activePiece.style.top = `${y}px`;
        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (!chessboard || !activePiece) {
            return;
        }
        setActivePiece(null); 
        const x = Math.floor((e.clientX - chessboard.offsetLeft) / TILESIZE );
        const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - TILESIZE*8) / TILESIZE));
        const cursorP: Position = {x, y};
        //console.log(x, y)
        if (!checkBounds(cursorP)) {
            return;
        }
        let movePiece = pieceMap.get(stringPosition(getPosition))!;
        //find(p => samePosition(p.position, getPosition));
        if (!(movePiece)) {
            return;
        }
        const validMove = rules.isValidMove(
            getPosition, 
            cursorP,
            turn, 
            pieceMap,
        );
        console.log("here")
        if (validMove) {
            movePiece.position = cursorP;
            setPieceMap(prevMap => {
                const nextMap = new Map(prevMap);
                nextMap.delete(stringPosition(getPosition));
                nextMap.set(stringPosition(cursorP), movePiece);
                return nextMap;
            });
            console.log("valid")
            console.log("deleting " + stringPosition(getPosition))
            pieceMap.delete(stringPosition(getPosition))
            console.log("pushing " + stringPosition(cursorP))
            console.log("piece is at " + stringPosition(movePiece.position))
            pieceMap.set(stringPosition(cursorP), movePiece);
            /*setPieceMap(stringPosition())
            const newPieces = pieces.reduce((results, piece) => {
                if (samePosition(piece.position, getPosition)) {
                    piece.position = cursorP;
                    results.push(piece);*/
                    const previous: string = 
                        (pgn.has(moveCounter)) 
                            ? pgn.get(moveCounter)!: `${moveCounter}.`;
                    pgn.set(moveCounter, pgnToString(movePiece, previous));
                    moveCounter += movePiece.color; //WHITE = 0, BLACK = 1
                    console.log(pgn);
                //} else if (!(samePosition(piece.position, cursorP))) {
                //    results.push(piece);
                //} // if neither condition, do not push piece. This means a piece has just been captured and needs to disappear
                //return results;
            //}, [] as Piece[]);
            //setPieces(newPieces);
            turn = nextTurn(turn);
        } else {
            console.log("invalid")
            activePiece.style.position = "relative";
            activePiece.style.removeProperty("top");
            activePiece.style.removeProperty("left");
        }
    }
    //rendering board
    let board = [];
    for (let j = yAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < xAxis.length; i++) {
            const number = i+j;
            const piece = pieceMap.get(stringPosition({x: i, y: j}))
            //(p => (samePosition(p.position, {x: i, y: j})));
            let image = piece ? piece.image : undefined;
            board.push(<Tile key={`${i}${j}`} image={image} number={number}/>)
        }
    }
    console.log(pieceMap);
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
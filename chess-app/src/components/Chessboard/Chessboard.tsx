import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Rules from "../../rules/Rules";
import { Piece, Position, PieceMap, PositionMap } from "../../models";
import { xAxis, yAxis, TILESIZE, PieceColor} from "../../Constants";
import { nextTurn, findKing, pgnToString } from "../../rules";
import { updatePieceMap } from "./updateChessboard";
import { initialMap } from "./initChessboard";
import { evaluate } from "../../engine/evaluate";
import { deepClone } from "../../rules/History/Clone";

let moveCounter = 1;
const pgn = new Map<number, string>();
let turn: PieceColor = PieceColor.WHITE;
let positionHighlight: Position = new Position(-1, -1);

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [getPosition, setPosition] = useState<Position>(new Position(-1, -1));
    const [pieceMap, setPieceMap] = useState<PieceMap>(initialMap);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const rules = new Rules();

    let whiteKingKey: string = "e1";
    let blackKingKey: string = "e8";
    
    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (!chessboard || !element.classList.contains("chess-piece")) {
            return;
        }
        const getX = (Math.floor((e.clientX - chessboard.offsetLeft) / TILESIZE));
        const getY = (Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - TILESIZE*8) / TILESIZE)));
        setPosition(new Position(getX, getY));
        const [x, y] = [e.clientX - TILESIZE/2 , e.clientY - TILESIZE/2];
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
        const [x, y] = [e.clientX - TILESIZE/2 , e.clientY - TILESIZE/2]
        activePiece.style.position = "absolute";
        //controls the boundaries
        if (x < minX)        { activePiece.style.left = `${minX}px`; //setActivePiece(null); 
        } else if (x > maxX) { activePiece.style.left = `${maxX}px`; //setActivePiece(null); 
        } else               { activePiece.style.left = `${x}px`;
        }
        if (y < minY)        { activePiece.style.top = `${minY}px`; //setActivePiece(null); 
        } else if (y > maxY) { activePiece.style.top = `${maxY}px`; //setActivePiece(null); 
        } else               { activePiece.style.top = `${y}px`;
        }
        //activePiece.style.left = `${x}px`;
        //activePiece.style.top  = `${y}px`;
        
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (!chessboard || !activePiece) {
            return;
        }
        setActivePiece(null); 
        const x = Math.floor((e.clientX - chessboard.offsetLeft) / TILESIZE);
        const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - TILESIZE*8) / TILESIZE));
        const cursorP: Position = new Position(x, y);
        if (!cursorP.checkBounds) {
            return;
        }
        let movePiece = pieceMap.get(getPosition.string)!;
        if (!(movePiece)) {
            return;
        }
        whiteKingKey = findKing(pieceMap, whiteKingKey, PieceColor.WHITE);
        blackKingKey = findKing(pieceMap, blackKingKey, PieceColor.BLACK);
        const kingKey = movePiece.color === PieceColor.WHITE ? whiteKingKey : blackKingKey;
        const king: Piece = pieceMap.get(kingKey)!;
        const newPieceMap = rules.populateValidMoves(pieceMap, turn, king);
        const validMove = rules.canMovePiece(getPosition, cursorP, newPieceMap);
        setPieceMap(newPieceMap);
        console.log(pieceMap);
        console.log(movePiece.moveMap)
        if (validMove) {
            movePiece.position = cursorP;
            const isCapture = pieceMap.has(cursorP.string);
            setPieceMap(updatePieceMap(pieceMap, getPosition, cursorP, movePiece));
            const append: string = (pgn.has(moveCounter)) ? pgn.get(moveCounter)!: `${moveCounter}.`;
            pgn.set(moveCounter, pgnToString(movePiece, getPosition, append, isCapture));
            moveCounter += movePiece.color === PieceColor.WHITE ? 0 : 1; //WHITE = 0, BLACK = 1
            console.log(pgn);
            turn = nextTurn(turn);
            positionHighlight = new Position(-1, -1);
            console.log("eval:", evaluate(pieceMap));
            console.log(pieceMap)
        } else {
            console.log(getPosition.string, "to", cursorP.string, "is invalid")
            activePiece.style.position = "relative";
            activePiece.style.removeProperty("top");
            activePiece.style.removeProperty("left");
            positionHighlight = getPosition.copyPosition;
        }
    }
    //rendering board
    let board = [];
    let highlightMap: PositionMap = new Map();
    if (positionHighlight.samePosition(getPosition)) {
        highlightMap = pieceMap.has(getPosition.string) ? 
            pieceMap.get(getPosition.string)?.moveMap! : new Map();
    }
    for (let j = yAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < xAxis.length; i++) {
            const number = i+j;
            const piece = pieceMap.get(new Position(i, j).string);
            let image = piece ? piece.image : undefined;
            const highlight = highlightMap.has(new Position(i, j).string) ? true : false;
            board.push(<Tile key={`${i}${j}`} image={image} number={number} highlight={highlight}/>)
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
import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Rules from "../../rules/Rules";
import { Piece, Position } from "../../models";
import { 
    xAxis, yAxis, 
    TILESIZE, 
    PieceColor,
    PieceType,
} from "../../Constants";
import { initialPieces } from "./initChessboard";
import { nextTurn, pgnToString } from "../../rules";
import { updatePieceMap } from "./updateChessboard";
import { isCheck } from "../../rules/pieces/King";

let moveCounter = 1;
const pgn = new Map<number, string>();
let turn: PieceColor = PieceColor.WHITE;
let positionHighlight: Position = new Position(-1, -1);

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [getPosition, setPosition] = useState<Position>(new Position(-1, -1));
    const [pieceMap, setPieceMap] = useState(new Map<string, Piece>(initialPieces));
    const chessboardRef = useRef<HTMLDivElement>(null);
    const rules = new Rules();
    
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
        const x = Math.floor((e.clientX - chessboard.offsetLeft) / TILESIZE );
        const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - TILESIZE*8) / TILESIZE));
        const cursorP: Position = new Position(x, y);
        if (!cursorP.checkBounds) {
            return;
        }
        let movePiece = pieceMap.get(getPosition.string)!;
        if (!(movePiece)) {
            return;
        }
        setPieceMap(rules.populateValidMoves(turn, pieceMap));
        const revertPieceMap = new Map<string, Piece>(pieceMap);
        const validMove = rules.canMovePiece(getPosition, cursorP, pieceMap);
        
        if (validMove) {
            movePiece.position = cursorP;
            const isCapture = pieceMap.has(cursorP.string);
            setPieceMap(updatePieceMap(pieceMap, getPosition, cursorP, movePiece));
            const king: Piece = [...pieceMap.values()].find((p) => (p.type === PieceType.KING && p.color === movePiece.color))!
            if (isCheck(pieceMap, king.position, turn)) {
                console.log("king is at", king.position.string)
                console.log("cannot allow check")
                movePiece.position = getPosition;
                setPieceMap(revertPieceMap);
                activePiece.style.position = "relative";
                activePiece.style.removeProperty("top");
                activePiece.style.removeProperty("left");
                console.log(pieceMap)
                return;
            };
            console.log(pieceMap)
            const append: string = (pgn.has(moveCounter)) ? pgn.get(moveCounter)!: `${moveCounter}.`;
            pgn.set(moveCounter, pgnToString(movePiece, getPosition, append, isCapture));
            moveCounter += movePiece.color === PieceColor.WHITE ? 0 : 1; //WHITE = 0, BLACK = 1
            console.log(pgn);
            turn = nextTurn(turn);
            positionHighlight = new Position(-1, -1);
        } else {
            activePiece.style.position = "relative";
            activePiece.style.removeProperty("top");
            activePiece.style.removeProperty("left");
            positionHighlight = getPosition.copyPosition;
        }
    }
    //rendering board
    let board = [];
    let highlightMap = new Map<string, Position>();
    if (positionHighlight.samePosition(getPosition)) {
        highlightMap = pieceMap.has(getPosition.string) ? 
            pieceMap.get(getPosition.string)?.moveMap! : new Map<string, Position>();
    } else {
        highlightMap = new Map<string, Position>();
    }
    //console.log(pieceMap)
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
import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Rules from "../../rules/Rules";
import { Piece, Position, PieceMap, PositionMap, BoardMap } from "../../models";
import { xAxis, yAxis, TILESIZE, PieceColor, GameState} from "../../Constants";
import { nextTurn, findKing, pgnToString } from "../../rules";
import { initialBoards, initialPieceMap } from "./initChessboard";

let moveCounter = 1;
const pgn = new Map<number, string>();
let turn: PieceColor = PieceColor.WHITE;
let positionHighlight: Position = new Position(-1, -1);
let whiteKingKey: string = "e1";
let blackKingKey: string = "e8";

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [getPosition, setPosition] = useState<Position>(new Position(-1, -1));
    const [pieceMap, setPieceMap] = useState<PieceMap>(initialPieceMap);
    const [getBoards, setBoards] = useState<BoardMap>(initialBoards);
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
        const [minX, minY, maxX, maxY] = [
            chessboard.offsetLeft - TILESIZE/4, 
            chessboard.offsetTop  - TILESIZE/4, 
            chessboard.offsetLeft - TILESIZE/4*3 + chessboard.clientWidth,
            chessboard.offsetTop  - TILESIZE/4*3 + chessboard.clientHeight
        ];
        const [x, y] = [e.clientX - TILESIZE/2 , e.clientY - TILESIZE/2]
        activePiece.style.position = "absolute";
        //controls the boundaries
        let piXel: string = `${x}px`;
        if (x < minX)        { piXel = `${minX}px`;
        } else if (x > maxX) { piXel = `${maxX}px`;
        }
        activePiece.style.left = piXel;

        let piYel: string = `${y}px`;
        if (y < minY)        { piYel = `${minY}px`;
        } else if (y > maxY) { piYel = `${maxY}px`;
        }
        activePiece.style.top = piYel;
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
        const validMove = rules.canMove(getBoards, getPosition, cursorP);
        if (!validMove) {
            activePiece.style.position = "relative";
            activePiece.style.removeProperty("top");
            activePiece.style.removeProperty("left");
            positionHighlight = getPosition.copyPosition;
            return; 
        }
        const nextBoard: PieceMap = getBoards.get(getPosition.string+cursorP.string)![0];
        const isCapture = pieceMap.has(cursorP.string);
        setPieceMap(nextBoard);
        const append: string = (pgn.has(moveCounter)) ? pgn.get(moveCounter)!: `${moveCounter}.`;
        pgn.set(moveCounter, pgnToString(movePiece, getPosition, cursorP, append, isCapture));
        moveCounter += movePiece.color === PieceColor.WHITE ? 0 : 1; //WHITE = 0, BLACK = 1
        console.log(pgn);
        turn = nextTurn(turn);
        positionHighlight = getPosition.copyPosition;
        [whiteKingKey, blackKingKey] = [
            findKing(pieceMap, whiteKingKey, PieceColor.WHITE), 
            findKing(pieceMap, blackKingKey, PieceColor.BLACK)
        ];
        const kingKey = turn === PieceColor.WHITE ? whiteKingKey : blackKingKey;
        const king: Piece = pieceMap.get(kingKey)!;
        const [newPieceMap, newBoards] = rules.populateValidMoves(nextBoard, turn, king);
        const status: GameState = rules.getStatus(newBoards, newPieceMap, king);
        console.log(status);
        console.log(newPieceMap);
        if (status === GameState.CHECKMATE || status === GameState.STALEMATE) {
            return;
        }
        setBoards(newBoards);
    }
    //rendering board
    let board = [];
    //console.log("making new board")
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
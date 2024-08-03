import { useRef, useState } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Rules from "../../rules/Rules";
import { Piece, Position, PieceMap, BoardMap } from "../../models";
import { xAxis, yAxis, TILESIZE, PieceColor, GameState} from "../../Constants";
import { nextTurn, findKing, pgnToString } from "../../rules";
import { initialBoards, initialPieceMap } from "./initChessboard";
import { quadMoves, evaluate, worstCase } from "../../engine";
import { deepClone } from "../../rules/History/Clone";
import { miniMaxAlphaBeta } from "../../engine/Engine";

let moveCounter = 1;
const pgn = new Map<number, string>();
let turn: PieceColor = PieceColor.WHITE;
let positionHighlight: Position = new Position(-1, -1);

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [getPosition, setPosition] = useState<Position>(new Position(-1, -1));
    const [pieceMap, setPieceMap] = useState<PieceMap>(initialPieceMap);
    const [getBoards, setBoards] = useState<BoardMap>(initialBoards);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const rules = new Rules();    

    function grabPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        const element = e.target as HTMLElement;
        if (!chessboard || !element.classList.contains("chess-piece")) {
            console.log("finding moves that are good for", turn)
            
            setTimeout(
                function(){
                    const start = performance.now();
                    const bestMoveScore = miniMaxAlphaBeta(pieceMap, 4, 2, -9999, 9999, (turn), [], "e1", "e1");
                    
                    //const depthTwo = quadMoves(getBoards, turn); 
                    const end = performance.now();
                    console.log(bestMoveScore);
                    console.log("time taken:", Math.round((end - start)/10)/100, "seconds");
                    //console.log(depthTwo);
                }, 0
            );
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
        const validMove = rules.canMove(getBoards, getPosition, cursorP);
        if (!validMove) {
            activePiece.style.position = "relative";
            activePiece.style.removeProperty("top");
            activePiece.style.removeProperty("left");
            positionHighlight = getPosition.copyPosition;
            return; 
        }
        positionHighlight = getPosition.copyPosition;
        const nextBoard: PieceMap = getBoards.get(getPosition.string+cursorP.string)![0];
        const isCapture = pieceMap.has(cursorP.string);
        const movePiece = pieceMap.get(getPosition.string)!;
        setPieceMap(nextBoard);
        const append: string = (pgn.has(moveCounter)) ? pgn.get(moveCounter)!: `${moveCounter}.`;
        pgn.set(moveCounter, pgnToString(movePiece, getPosition, cursorP, append, isCapture));
        moveCounter += movePiece.color === PieceColor.WHITE ? 0 : 1; //WHITE = 0, BLACK = 1
        console.log(pgn);
        turn = nextTurn(turn);
        
        const [whiteKingKey, blackKingKey] = [
            findKing(pieceMap, "e1", PieceColor.WHITE), 
            findKing(pieceMap, "e8", PieceColor.BLACK)
        ];
        const kingKey = turn === PieceColor.WHITE ? whiteKingKey : blackKingKey;
        const king: Piece = pieceMap.get(kingKey)!;
        const [newPieceMap, newBoards] = rules.populateValidMoves((nextBoard), turn, king);
        const status: GameState = rules.getStatus(newBoards, newPieceMap, king);
        setTimeout(function(){
            console.log(status, evaluate((newPieceMap)));
            console.log(newPieceMap);
            }, 0);
        if (status === GameState.CHECKMATE || status === GameState.STALEMATE) {
            return;
        }
        //console.log(newBoards)
        setBoards(newBoards);

        //console.log(worstCase(newBoards, turn))
        //const depthTwo = doubleMoves(newBoards, turn); 
        //console.log(depthTwo);
        //let lines = (createDeque(newBoards));
        //const newLines = scoreMoves(lines, newBoards, 1, turn, whiteKingKey, blackKingKey);
        //console.log(newLines)
        //const possibleBranches = countMoves(newBoards, 3, 0, turn, whiteKingKey, blackKingKey);
        //console.log(possibleBranches)
    }
    //rendering board
    const board = [];
    const highlightMap = (positionHighlight.samePosition(getPosition) && pieceMap.has(getPosition.string)) ?
        pieceMap.get(getPosition.string)?.moveMap! : new Map();
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
import { PieceColor } from "../Constants";
import { Piece, BoardMap, PieceMap, getPOV } from "../models";
import { findKing, nextTurn } from "../rules";
import Rules from "../rules/Rules";
import { Deque } from "./Deque";

type MovesScore = [string[], number];
//type Moves = string[]; //type MoveRec = [string, number, string[]]

export function worstCase(boardMap: BoardMap, color: PieceColor): number {
    let worstEval = -1000 * getPOV(color);
    if (boardMap.size === 0) {
        return -worstEval;
    }
    for (let [_board, evaluation] of boardMap.values()) {
        if (color === PieceColor.BLACK && evaluation < worstEval) {
            worstEval = evaluation;
        }
        else if (color === PieceColor.WHITE && evaluation > worstEval) {
            worstEval = evaluation;
        }
    }
    return worstEval;
}

function miniMax(movesEval: MovesScore[], color: PieceColor): number {
    let worstEval = -1000 * getPOV(color);
    movesEval.forEach(moveEval => {
        const evaluation = moveEval[1];
        if (color === PieceColor.BLACK && evaluation < worstEval) {
            worstEval = evaluation;
        }
        else if (color === PieceColor.WHITE && evaluation > worstEval) {
            worstEval = evaluation;
        }
    });
    return worstEval; 
} 

function alphaBetaBoard(boardMap: BoardMap, color: PieceColor, alpha: number, beta: number): number[] {
    for (const [_board, evaluation] of boardMap.values()) {
        if (color === PieceColor.BLACK && evaluation < beta) {
            beta = evaluation;
        }
        else if (color === PieceColor.WHITE && evaluation > alpha) {
            alpha = evaluation;
        }
    }
    if (boardMap.size === 0) {
        return (color === PieceColor.WHITE) ? [1024, beta] : [alpha, -1024];
    }
    return [alpha, beta];
}

function alphaBetaMoves(movesEval: MovesScore[], color: PieceColor, alpha: number, beta: number): number[] {
    movesEval.forEach(movesEval => {
        const evaluation = movesEval[1];
        if (color === PieceColor.BLACK && evaluation < beta) {
            beta = evaluation;
        }
        else if (color === PieceColor.WHITE && evaluation > alpha) {
            alpha = evaluation;
        }
    })
    if (!movesEval) {
        return (color === PieceColor.WHITE) ? [alpha, 1024] : [-1024, beta];
    }
    return [alpha, beta];
}

function boardsToScores(boardMap: BoardMap, color: PieceColor): MovesScore[] {
    const moveScore: MovesScore[] = [];
    for (const [move, [_board, evaluation]] of boardMap) {
        moveScore.push([[move], evaluation]);
    }
    return moveScore;
}

export function quadMoves(boardMap: BoardMap, color0: PieceColor) {
    const POV = getPOV(color0);
    let alpha: number = -1024;
    let beta:  number =  1024;
    //set up
    const patience: number = 10;
    const tolerance: number = 0.626;
    const rules = new Rules();
    const color1 = nextTurn(color0);
    let [king0Key, king1Key] = (color0 === PieceColor.WHITE) ? ["e1", "e8"] : ["e8", "e1"];

    let finalMoveScores:MovesScore[] = [];
    let iterations = 0;
    //loop through enemy moves
    const worstZero = worstCase(boardMap, color0);
    for (const [move0, [board0, evaluation0]] of boardMap) { //ENEMY BOARDS
        console.log(move0);
        //if they make a move that is not as punishing, stop and find how to respond to their real threats
        
        const newBoards1 = deriveNewBoards(board0, color1, king1Key);
        //[alpha, beta] = alphaBetaMiniMax(newBoards1, color1, alpha, beta);
        //save the best case scenario
        const bestFirst: number = worstCase(newBoards1, color1);
        let move0Scores:MovesScore[] = []; 
        if (Math.abs(bestFirst) > 100) {
            move0Scores.push([[move0], -POV*1000]);
            console.log("mate found on", move0);
            break;
        }
        if (pruneEarly(evaluation0, worstZero, 0)) continue; 
       
        //loop through our response
        for (const [move1, [board1, evaluation1]] of newBoards1) { //OUR BOARDS
            //do not be overly optimistic. If the move is too good, assume route won't be taken
            const newBoards2 = deriveNewBoards(board1, color0, king0Key);
            //store worst case
            let move1Scores:MovesScore[] = [];       
            const worstSecond: number = worstCase(newBoards2, color0);
            if (Math.abs(worstSecond) > 100) {
                move1Scores.push([[move0, move1], -POV*1000]);
                //console.log("mate found on", move0, move1);
                break;
            }
            if (pruneEarly(evaluation1, bestFirst, 1)) continue;
            
            //loop through enemy moves
            for (let [move2, [board2, evaluation2]] of newBoards2) { //ENEMY BOARDS
                //if the move is too good for us, stop searching. Notice each time the wiggle room decreases
                const newBoards3 = deriveNewBoards(board2, color1, king1Key);
                const bestThird: number = worstCase(newBoards3, color1);
                let move2Scores:MovesScore[] = [];
                if (Math.abs(bestThird) > 100) {
                    move1Scores.push([[move0, move1, move2], -POV*1000]);
                    //console.log("mate found on", move0, move1, move2);
                    break
                }
                
                if (pruneEarly(evaluation2, worstSecond, 3)) continue;
                const board2Size = board2.size;
                for (const [move3, [board3, evaluation3]] of newBoards3) { //OUR BOARDS
                    iterations++;
                    let move3Scores:MovesScore[] = [];       
                    if (pruneEarly(evaluation3, bestThird, 3)) continue;
                    const newBoards4 = deriveNewBoards(board3, color0, king0Key);
                    const worstFourth: number = worstCase(newBoards4, color0);
                    if (Math.abs(worstFourth) > 100) {
                        move2Scores.push([[move0, move1, move2, move3], -POV*1000]);
                        //console.log("mate found on", move0, move1, move2, move3);
                        break;
                    }
                    if (board3.size >= board2Size) {
                        move2Scores.push([[move0, move1, move2, move3], evaluation3]);
                        continue;
                    }
                    const board3Size = board3.size;
                    for (let [move4, [board4, evaluation4]] of newBoards4) {
                    //the harshes pruning possible. If its not the best move, then stop
                        if (pruneEarly(evaluation4, worstFourth, 3)) continue;
                        if (board4.size >= board3Size) {
                            move2Scores.push([[move0, move1, move2, move3, move4], evaluation4]);
                            continue;
                        }
                        continue;
                        //let move4Scores:MovesScore[] = [];
                        /*const newBoards5 = deriveNewBoards(board4, color1, king1Key);
                        const bestFifth: number = worstCase(newBoards5, color1);
                        const board4Size = board4.size;*
                        for (let [move5, [board5, evaluation5]] of newBoards5) {
                            continue
                            if (pruneEarly(evaluation5, bestFifth, 15)) continue; 
                            if (board5.size >= board4Size) {
                                continue;
                            }
                            if (evaluation5 === bestFifth) {
                                move4Scores.push([[move0, move1, move2, move3, move4, move5], bestFifth]);
                            }
                        }   */
                        //move3Scores.push(...move4Scores);
                    }/*
                    const scoreThird: number = miniMax(move3Scores, color0);
                    move2Scores = move1Scores.filter(moveScore => moveScore[1] === scoreThird);
                    move2Scores.push(...move3Scores);*/
                }
                /*
                //end of branching. The next for loop pushes in only the worst possible responses at the end of the tree
                */
                //const bestThird: number = miniMax(boardsToScores(newBoards3, color1), color1); //this is only called once
                //[alpha, beta] = alphaBetaBoard(newBoards3, color0, alpha, beta);
                
                //  now go through all the new responses added and only save the best from the worst
                //  evaluation will always be passed as the worst possible score. The function will avoid returning moves
                //  that lead to worse evals willingly
                const scoreSecond: number = miniMax(move2Scores, color1);
                move2Scores = move2Scores.filter(moveScore => moveScore[1] === scoreSecond)
                move1Scores.push(...move2Scores);
            }
            //the enemy will now choose from all the filtered moves and pick the worse one for us
            const scoreFirst: number = miniMax(move1Scores, color0);
            move1Scores = move1Scores.filter(moveScore => moveScore[1] === scoreFirst)
            move0Scores.push(...move1Scores);
        }
        //final filter, pick the best move from what is remaining
        const scoreZero: number = miniMax(move0Scores, color1);
        move0Scores = move0Scores.filter(moveScore => moveScore[1] === scoreZero);
        finalMoveScores.push(...move0Scores);
    } 
    const scoreFinal: number = miniMax(finalMoveScores, color0);
    finalMoveScores = finalMoveScores.filter(moveScore => moveScore[1] === scoreFinal);

    const size = finalMoveScores.length;
    const option1 = finalMoveScores[Math.floor(0.9*Math.random() * size)];
    const option2 = finalMoveScores[Math.floor(0.3 * size)];
    const option3 = finalMoveScores[Math.floor(0.9 * size)];
    //const first = [option1[0][0], option1[0]];
    //const second = [option2[0][0], option2[0]];
    //const third = [option3[0][0], option3[0]];
    const one = option1[0][0];
    const two = option2[0][0];
    const three = option3[0][0]
    //totalMoveScores.sort(function(a, b){
    //    return -(a[1] - b[1])*POV;
    //});
    //return [first, second, third];
    //return totalMoveScores;
    //return [option1, option2, option3];
    //console.log("alpha:", alpha, "beta:", beta)
    console.log(option1, option2, option3);
    console.log(iterations)
    return [one, two, three, "eval:", option1[1], "options:", size];
}

function pruneEarly(evaluation: number, benchmark: number, exponent: number): boolean {
    const tolerance = 10;
    const scalar = 0.626;
    return (Math.abs(evaluation - benchmark) > tolerance * scalar**exponent);
}

function deriveNewBoards(pieceMap: PieceMap, color: PieceColor, starterKey: string): BoardMap {
    return new Rules().populateValidMoves(
        pieceMap, color, pieceMap.get(
            findKing(
                pieceMap, starterKey, color
            )
        )!
    )[1]; 
}
//[alpha, beta] = alphaBetaMoves(move2Scores, color1, alpha, beta);
                /*move2Scores.forEach(moveScore => {
                    const evaluation: number = moveScore[1];
                    if ((evaluation < alpha && color0 === PieceColor.WHITE) ||
                        (evaluation > beta && color0 === PieceColor.BLACK)
                    ){ 
                        //pass
                    } else {
                        totalMoveScores.push(moveScore);
                    }
                })*/
                 //totalMoveScores.push(...move0Scores);
        //const finalScore: number = miniMax(move0Scores, color1);
        //finalMoveScores = move0Scores.filter(moveScore => moveScore[1] === scoreZero); 
        /*if (
                        (evaluation3 < alpha && color0 === PieceColor.WHITE) ||
                        (evaluation3 > beta && color0 === PieceColor.BLACK)
                    ){ 
                        continue;
                    }*/
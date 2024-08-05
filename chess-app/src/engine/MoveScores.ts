import { PieceColor } from "../Constants";
import { Piece, BoardMap, PieceMap, getPOV } from "../models";
import { findKingKey, nextTurn } from "../rules";
import Rules from "../rules/Rules";
import { Deque } from "./Deque";
/*
type MovesScore = [string[], number];
//type Moves = string[]; //type MoveRec = [string, number, string[]]

export function worstCase(boardMap: BoardMap, color: PieceColor): number {
    let worstEval = -1000 * getPOV(color);
    if (boardMap.size === 0) {
        return -worstEval;
    }
    for (let [, evaluation] of boardMap.values()) {
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

function setAlphaBeta(evaluation: number, color: PieceColor, alpha: number, beta: number): number[] {
    if (color === PieceColor.WHITE && evaluation > alpha) {
        alpha = evaluation;
    } else if (color === PieceColor.BLACK && evaluation < beta) {
        beta = evaluation;
    }
    return [alpha, beta];
}

function pruneAB(evaluation: number, color: PieceColor, alpha: number, beta: number, error: number): boolean {
    if ((color === PieceColor.WHITE && evaluation + error < alpha) ||
        (color === PieceColor.BLACK && evaluation - error > beta)
    ){
        return true;
    }
    return false;
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
    let alpha: number = -1024; //best recorded position for us
    let beta:  number =  1024; //best recorded position for opponent
    //set up
    const color1 = nextTurn(color0);
    let [king0Key, king1Key] = (color0 === PieceColor.WHITE) ? ["e1", "e8"] : ["e8", "e1"];
    let iterations = 0;
    
    /* STARTS HERE */ /*
    const worstZero = worstCase(boardMap, color0);
    let finalMoveScores:MovesScore[] = [];
    // loop through our moves
    for (const [move0, [board0, evaluation0]] of boardMap) { //OUR BOARDS
        console.log(move0);
        const board0Size = board0.size;
        //if (pruneEarly(evaluation0, worstZero, 0)) {
        //    continue; 
        //}
        if (pruneAB(evaluation0, color0, alpha, beta, 5)) {
            continue;
        }
        const branch0: string[] = [move0];
        const newBoards1 = deriveNewBoards(board0, color1, king1Key);
        const bestFirst: number = worstCase(newBoards1, color1);
        if (Math.abs(bestFirst) > 1000) {
            finalMoveScores.push([branch0, 1000*POV]);
            break;
        }
        let move0Scores:MovesScore[] = [];
        //loop through the enemy's response to our first move
        for (const [move1, [board1, evaluation1]] of newBoards1) { //THEIR BOARDS
            const board1Size = board1.size;
            if (board0Size === board1Size && pruneAB(evaluation1, color1, alpha, beta, 4)) {
                continue;
            }
            const branch1: string[] = [...branch0, move1];
            const newBoards2 = deriveNewBoards(board1, color0, king0Key);
            const worstSecond: number = worstCase(newBoards2, color0);
            if (Math.abs(worstSecond) > 100) {
                move0Scores.push([branch1, POV*1000]);
                break;
            }
            let move1Scores:MovesScore[] = [];       
            //loop through our third move
            for (let [move2, [board2, evaluation2]] of newBoards2) { //OUR BOARDS that we generate from our third move
                //if the move is too good for us, stop searching. Notice each time the wiggle room decreases
                const board2Size = board2.size;
                if (board1Size === board2Size && pruneAB(evaluation2, color0, alpha, beta, 3)) {
                    continue;
                }
                const branch2: string[] = [...branch1, move2];
                const newBoards3 = deriveNewBoards(board2, color1, king1Key);
                const bestThird: number = worstCase(newBoards3, color1);
                if (Math.abs(bestThird) > 100) {
                    move1Scores.push([branch2, POV*1000]);
                    break;
                }
                let move2Scores:MovesScore[] = [];
                for (const [move3, [board3, evaluation3]] of newBoards3) { //THEIR BOARDS
                    const board3Size = board3.size;
                    if (board2Size === board3Size && pruneAB(evaluation3, color1, alpha, beta, 0.7)) {
                        continue;
                    }

                    const branch3: string[] = [...branch2, move3];
                    const newBoards4 = deriveNewBoards(board3, color0, king0Key);
                    const worstFourth: number = worstCase(newBoards4, color0);
                    if (Math.abs(worstFourth) > 100) {
                        move2Scores.push([branch3, POV*1000]);
                        break;
                    }
                    let move3Scores:MovesScore[] = [];       
                    
                    for (let [move4, [board4, evaluation4]] of newBoards4) {
                    //the harshes pruning possible. If its not the best move, then stop
                        iterations++
                        const board4Size = board4.size;
                        const branch4: string[] = [...branch3, move4];
                        if (board3Size === board4Size) { // && pruneAB(evaluation0, color0, alpha, beta, 0.7)) {
                            move3Scores.push([branch4, evaluation4])
                            continue;
                        }
                        if (pruneAB(evaluation4, color1, alpha, beta, 0.7)) {
                            continue;
                        }
                        
                        const newBoards5 = deriveNewBoards(board4, color1, king1Key);
                        const bestFifth: number = worstCase(newBoards5, color1);
                        
                        if (Math.abs(bestFifth) > 100) {
                            move3Scores.push([branch4, POV*1000]);
                            break;
                        }
                        
                        let move4Scores:MovesScore[] = [];
                        for (let [move5, [board5, evaluation5]] of newBoards5) {
                            
                            const board5Size = board5.size;
                            //if (evaluation5 !== bestFifth) continue;
                            const branch5: string[] = [...branch4, move5];
                            if (1 || board4Size === board5Size) {
                                move4Scores.push([branch5, evaluation5]);
                                iterations++
                            }
                        }
                        const scoreFourth: number = miniMax(move4Scores, color1);
                        [alpha, beta] = setAlphaBeta(scoreFourth, color1, alpha, beta);
                        move3Scores.push(...move4Scores);
                    }
                    const scoreThird: number = miniMax(move3Scores, color0);
                    //[alpha, beta] = setAlphaBeta(scoreThird, color0, alpha, beta);
                    move2Scores.push(...move3Scores.filter(moveScore => moveScore[1] === scoreThird));
                }
                //  now go through all the new responses added and only save the best from the worst
                //  evaluation will always be passed as the worst possible score. The function will avoid returning moves
                //  that lead to worse evals willingly
                const scoreSecond: number = miniMax(move2Scores, color1);
                
                move1Scores.push(...move2Scores.filter(moveScore => moveScore[1] === scoreSecond))
            }
            //the enemy will now choose from all the filtered moves and pick the worse one for us
            const scoreFirst: number = miniMax(move1Scores, color0);
            move0Scores.push(...move1Scores.filter(moveScore => moveScore[1] === scoreFirst))
        }
        //final filter, pick the best move from what is remaining
        const scoreZero: number = miniMax(move0Scores, color1);
        finalMoveScores.push(...move0Scores.filter(moveScore => moveScore[1] === scoreZero));
        [alpha, beta] = setAlphaBeta(scoreZero, color1, alpha, beta);
    } 
    const scoreFinal: number = miniMax(finalMoveScores, color0);
    finalMoveScores = finalMoveScores.filter(moveScore => moveScore[1] === scoreFinal);

    const size = finalMoveScores.length;
    const option1 = finalMoveScores[Math.floor(Math.random() * size)];
    const option2 = finalMoveScores[Math.floor(Math.random() * 0.5 + 0.5 * size)];
    const option3 = finalMoveScores[Math.floor(Math.random() * 0.5 * size)];
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
    console.log("alpha:", alpha, "beta:", beta)
    console.log(option1, option2, option3);
    console.log(iterations)
    return [one, two, three, "eval:", option1[1], "options:", size];
}

function pruneEarly(evaluation: number, benchmark: number, exponent: number): boolean {
    const tolerance = 10;
    const scalar = 0.626;
    return (Math.abs(evaluation - benchmark) > tolerance * scalar**exponent);
}

//function alphaBeta(evaluation: number, bestScore: number, )

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
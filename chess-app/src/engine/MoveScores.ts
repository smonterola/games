import { PieceColor } from "../Constants";
import { BoardMap, PieceMap } from "../models";
import Rules from "../rules/Rules";
type movesScore = [[string], number];

export function sortMoves(boardMap: BoardMap, color: PieceColor): movesScore[] {
    const POV: number = color === PieceColor.WHITE ? 1 : -1;
    if (boardMap.size === 0) {
        return [[["GAMEOVER"], 1000*POV]]
    }
    let moveScores:movesScore[] = new Array();
    for (let [move, [_, evaluation]] of boardMap) {
        moveScores.push([[move], evaluation]);
    }
    moveScores.sort(function(a, b){
        return (b[1] - a[1])*POV;
    });
    return moveScores;
}
/*
export function scoreMoves(
    lines: movesScore[],
    boardMap: BoardMap, 
    depth: number,
    turn: PieceColor,
    kingKey: string,
    nextKey: string,
): movesScore[]{
    //const rules = Rules;
    if (depth <= 0) {
        const score: number = sortMoves(boardMap, turn)[0][1];
        lines.forEach(moveScore => {
            moveScore[0], score 
        });
        return lines;
    }
    for (let moveScore = lines.pop(); (moveScore); moveScore = lines.pop()) {
        const move = moveScore[0].pop();
    }
    return lines;
}
*/
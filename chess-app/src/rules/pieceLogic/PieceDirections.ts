import { Position } from "../../Constants";

export const rookDirections: Position[] = [
    {x: 1, y: 0}, // 0pi/2
    {x: 0, y: 1}, // 1pi/2
    {x:-1, y: 0}, // 2pi/2
    {x: 0, y:-1}, // 3pi/2
];

export const bishopDirections: Position[] = [
    {x: 1, y: 1}, //  pi/4
    {x: 1, y:-1}, // 3pi/4
    {x:-1, y:-1}, // 5pi/4
    {x:-1, y: 1}, // 7pi/4
];

export const knightDirections: Position[] = [
    {x: 2, y: 1},
    {x: 2, y:-1},
    {x:-2, y:-1},
    {x:-2, y: 1},
    {x: 1, y: 2},
    {x: 1, y:-2},
    {x:-1, y:-2},
    {x:-1, y: 2},
]

export const queenDirections: Position[] = 
    rookDirections.concat(bishopDirections);


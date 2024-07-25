import { Position } from "../../../models";

export const rookDirections: Position[] = [
    new Position( 1, 0), // 0pi/2
    new Position( 0, 1), // 1pi/2
    new Position(-1, 0), // 2pi/2
    new Position( 0,-1), // 3pi/2
];

export const bishopDirections: Position[] = [
    new Position( 1, 1), //  pi/4
    new Position( 1,-1), // 3pi/4
    new Position(-1,-1), // 5pi/4
    new Position(-1, 1), // 7pi/4
];

export const knightDirections: Position[] = [
    new Position( 2, 1),
    new Position( 2,-1),
    new Position(-2,-1),
    new Position(-2, 1),
    new Position( 1, 2),
    new Position( 1,-2),
    new Position(-1,-2),
    new Position(-1, 2),
]

export const queenDirections: Position[] = 
    rookDirections.concat(bishopDirections);


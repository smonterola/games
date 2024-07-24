import { xAxis, yAxis } from "../Constants";
export class Position {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    samePosition(p: Position): boolean {
        return this.x === p.x && this.y === p.y;
    }
    copyPosition(): Position {
        return new Position(this.x, this.y);
    }
    stringPosition(): string {
        return `${xAxis[this.x]}${yAxis[this.y]}`;
    }
    addPositions(p: Position): Position {
        return new Position(this.x + p.x, this.y + p.y);
    }
    checkBounds(): boolean {
        return (
            this.x >= 0 && this.x <= 7 &&
            this.y >= 0 && this.y <= 7
        )
    }
}
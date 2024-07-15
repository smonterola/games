import React from "react";

import "./Chessboard.css";

const rankAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const fileAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Chessboard() {
    let board = [];
    for (let i = 0; i < rankAxis.length; i++) {
        for (let j = 0; j < fileAxis.length; j++) {
            const number = i + j;
            if (number % 2 === 1) {
                board.push(
                    <div className="tile black-tile"></div>
                );
            } else {
                board.push(
                    <div className="tile white-tile"></div>
                );
            }
        }
    }
    return <div id="chessboard">{board}</div>;
}
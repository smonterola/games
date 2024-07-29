import { Piece } from "./Piece"
import { Position } from "./Position";

export type PieceMap = Map<string, Piece>;
export type PositionMap = Map<string, Position>;
export type BoardMap = Map<string, [PieceMap, number]>;
export type PieceCount = Map<string, number>;
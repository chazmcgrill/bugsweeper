/// <reference types="react-scripts" />

interface GridTile {
    id: number;
    tile: number;
    row: number;
    col: number;
    showing: boolean;
    flagged: boolean;
    neighbours?: number;
}

import { GAME_CONFIG } from "./config";
import { resetFloodStack, findNeighbours } from ".";

enum TileStatus {
    empty,
    bug,
}

export const createNewBoard = (customBugIndexes?: number[]) => {
    resetFloodStack();
    const totalArea = GAME_CONFIG.width * GAME_CONFIG.height;

    // generate bug locations use recursion to not allow duplicates
    let bugIndexes: number[] = [];

    const getBugIndexes = (): number => {
        let id = Math.floor(Math.random() * totalArea);
        return bugIndexes.includes(id) ? getBugIndexes() : id;
    }

    while (bugIndexes.length < GAME_CONFIG.bugs) {
        bugIndexes.push(getBugIndexes());
    }

    if (customBugIndexes) bugIndexes = customBugIndexes;

    // create grid with data for location and tile status
    let baseGrid = Array
        .apply(null, Array(totalArea))
        .map((item, index) => {
            const tile = bugIndexes.includes(index) ? TileStatus.bug : TileStatus.empty;
            const row = Math.floor(index / GAME_CONFIG.width);
            const col = index % GAME_CONFIG.width;

            return { id: index, tile, row, col, showing: false, flagged: false }
        });

    // find neigbours for each cell
    const grid = baseGrid.map(item => {
        let neighbours = item.tile !== TileStatus.bug ? findNeighbours(item, bugIndexes) : 9;
        return { ...item, neighbours };
    });

    return grid;
}
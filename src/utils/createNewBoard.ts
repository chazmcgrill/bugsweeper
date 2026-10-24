import { GAME_CONFIG } from './config';
import { resetFloodStack, findNeighbours } from '.';

const TileStatus = {
    Empty: 0,
    Bug: 1,
} as const;

export const createNewBoard = () => {
    resetFloodStack();
    const totalArea = GAME_CONFIG.width * GAME_CONFIG.height;

    // generate bug locations use recursion to not allow duplicates
    let bugIndexes: number[] = [];

    const getBugIndexes = (): number => {
        let id = Math.floor(Math.random() * totalArea);
        return bugIndexes.includes(id) ? getBugIndexes() : id;
    };

    while (bugIndexes.length < GAME_CONFIG.bugs) {
        bugIndexes.push(getBugIndexes());
    }

    if (GAME_CONFIG.customBugIndexes) bugIndexes = GAME_CONFIG.customBugIndexes;

    // create grid with data for location and tile status
    let baseGrid = Array.apply(null, Array(totalArea)).map((_, index) => {
        const tile = bugIndexes.includes(index) ? TileStatus.Bug : TileStatus.Empty;
        const row = Math.floor(index / GAME_CONFIG.width);
        const col = index % GAME_CONFIG.width;

        return { id: index, tile, row, col, showing: false, flagged: false };
    });

    // find neigbours for each cell
    const grid = baseGrid.map((item) => {
        let neighbours = item.tile !== TileStatus.Bug ? findNeighbours(item, bugIndexes) : 9;
        return { ...item, neighbours };
    });

    return grid;
};

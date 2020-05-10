import { GAME_CONFIG } from "./config";

enum TileStatus {
    empty,
    mine,
}

export const createNewBoard = () => {
    const totalArea = GAME_CONFIG.width * GAME_CONFIG.height;
    // generate mined locations use recursion to not allow duplicates
    let mineIndexs: number[] = [];

    function getMines(): number {
        let id = Math.floor(Math.random() * totalArea);
        return mineIndexs.includes(id) ? getMines() : id;
    }

    while (mineIndexs.length < GAME_CONFIG.mines) {
        mineIndexs.push(getMines());
    }

    // create grid with data for location and tile status
    let baseGrid = Array
        .apply(null, Array(totalArea))
        .map((item, index) => {
            const tile = mineIndexs.includes(index) ? TileStatus.mine : TileStatus.empty;
            const row = Math.floor(index / GAME_CONFIG.width);
            const col = index % GAME_CONFIG.width;

            return { id: index, tile, row, col, showing: false, flagged: false }
        });

    // find neigbours for each cell
    const grid = baseGrid.map(item => {
        let neighbours = item.tile !== TileStatus.mine ? findNeighbours(item, mineIndexs) : 9;
        return { ...item, neighbours };
    });

    return { grid, mineIndexs };
}

// get initial neigbours for each node
export const findNeighbours = (item: GridTile, mines: number[]): number => {
    let neigbours = getNeighbourIds(item);
    return neigbours.filter(id => mines.includes(id)).length;
}

// pass in a node get array of neighbours back
export const getNeighbourIds = (item: GridTile): number[] => {
    const id = item.id;
    const idArray = [];

    // rule out edge cases
    const leftEdge = item.col < 1;
    const rightEdge = item.col === GAME_CONFIG.width - 1;

    if (!leftEdge) idArray.push(id - 1);
    if (!rightEdge) idArray.push(id + 1);

    // check above
    if (item.row > 0) {
        if (!leftEdge) idArray.push((id - GAME_CONFIG.width) - 1);
        idArray.push(id - GAME_CONFIG.width);
        if (!rightEdge) idArray.push((id - GAME_CONFIG.width) + 1);
    }

    // check below
    if (item.row < GAME_CONFIG.height - 1) {
        if (!leftEdge) idArray.push((id + GAME_CONFIG.width) - 1);
        idArray.push(id + GAME_CONFIG.width);
        if (!rightEdge) idArray.push((id + GAME_CONFIG.width) + 1);
    }

    return idArray;
}
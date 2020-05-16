import { GAME_CONFIG } from "./config";

export let floodStack = [] as number[];

export const resetFloodStack = () => {
    floodStack = [];
};

// get initial neigbours for each node
export const findNeighbours = (item: GridTile, bugIndexes: number[]): number => {
    let neigbours = getNeighbourIds(item);
    return neigbours.filter(id => bugIndexes.includes(id)).length;
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

export const endStateCheck = (grid: GridTile[], flags: number): string | false => {
    const openTiles = grid.filter(t => t.showing === true).length;

    if (flags === GAME_CONFIG.bugs && openTiles === grid.length - GAME_CONFIG.bugs) {
        return "You Win!"
    }

    return false;
}

export const floodFill = (item: GridTile, grid: GridTile[]): void => {
    if (floodStack.includes(item.id) || item.neighbours !== 0 || item.showing || item.flagged) {
        return;
    }

    floodStack.push(item.id);

    let neighbours = getNeighbourIds(item);

    for (let neighbour of neighbours) {
        if (grid[neighbour].neighbours === 0) {
            floodFill(grid[neighbour], grid);
        }
    }

    return;
}

export const newTileStatus = (item: GridTile, grid: GridTile[]): number[] => {
    if (item.neighbours === 0) {
        floodFill(item, grid);

        let neighbours = floodStack
            .reduce((acc, cur) => {
                const neighbourIds = getNeighbourIds(grid[cur]);
                return acc.concat(neighbourIds);
            }, [] as number[])
            .filter((a, b, self) => self.indexOf(a) === b && !grid[a].flagged);

        return floodStack.concat(neighbours);
    }

    return [item.id];
}
import React, {Component} from 'react';
import Controls from './Controls';
import Board from './Board';
import Footer from './Footer';

const GAME = {
    width: 10,
    height: 10,
    mines: 10
}

const TILE_STATUS = {
    empty: 0,
    mine: 1
}

interface State {
    grid: GridTile[];
    mineIndexs: number[];
    flagCounter: number;
    endFlag: boolean | string;
}

class MinesweeperGame extends Component<{}, State> {
    state: State = {
        grid: [],
        mineIndexs: [],
        flagCounter: 0,
        endFlag: false
    }
    
    floodStack = [] as number[];

    componentDidMount() {
        this.createGrid();
    }

    createGrid = (): void => {
        const totalArea = GAME.width * GAME.height;
        // generate mined locations use recursion to not allow duplicates
        let mineIndexs: number[] = [];

        function getMines(): number {
            let id = Math.floor(Math.random() * totalArea);
            return mineIndexs.includes(id) ? getMines() : id;
        }

        while (mineIndexs.length < GAME.mines) {
            mineIndexs.push(getMines());
        }

        // create grid with data for location and tile status
        let baseGrid = Array
            .apply(null, Array(totalArea))
            .map((item, index) => {
                const tile = mineIndexs.includes(index) ? TILE_STATUS.mine : TILE_STATUS.empty;
                const row = Math.floor(index / GAME.width);
                const col = index % GAME.width;

                return {id: index, tile, row, col, showing: false, flagged: false}
            });

        // find neigbours for each cell
        const grid = baseGrid.map(item => {
            let neighbours = item.tile !== TILE_STATUS.mine ? this.findNeighbours(item, mineIndexs) : 9;
            return {...item, neighbours};
        });

        this.setState({ grid, mineIndexs, flagCounter: 0, endFlag: false });
    }

    // get initial neigbours for each node
    findNeighbours = (item: GridTile, mines: number[]): number => {
        let neigbours = this.getNeighbourIds(item);
        return neigbours.filter(id => mines.includes(id)).length;
    }

    // pass in a node get array of neighbours back
    getNeighbourIds = (item: GridTile): number[] => {
        const id = item.id;
        const idArray = [];

        // rule out edge cases
        const leftEdge = item.col < 1;
        const rightEdge = item.col === GAME.width - 1;

        if (!leftEdge) idArray.push(id - 1);
        if (!rightEdge) idArray.push(id + 1);

        // check above
        if (item.row > 0) {
            if (!leftEdge) idArray.push((id - GAME.width) - 1);
            idArray.push(id - GAME.width);
            if (!rightEdge) idArray.push((id - GAME.width) + 1);
        }

        // check below
        if (item.row < GAME.height - 1) {
            if (!leftEdge) idArray.push((id + GAME.width) - 1);
            idArray.push(id + GAME.width);
            if (!rightEdge) idArray.push((id + GAME.width) + 1);
        }

        return idArray;
    }

    newTileStatus = (item: GridTile): number[] => {
        if (item.neighbours === 0) {
            const { grid } = this.state;
            this.floodFill(item, this.state.grid);

            let neighbours = this.floodStack
                .reduce((acc, cur) => {
                    const neighbourIds = this.getNeighbourIds(grid[cur]);
                    return acc.concat(neighbourIds);
                }, [] as number[])
                .filter((a, b, self) => self.indexOf(a) === b && !grid[a].flagged);

            return this.floodStack.concat(neighbours);
        }

        return [item.id];
    }

  floodFill = (item: GridTile, grid: GridTile[]): void => {
        if (this.floodStack.includes(item.id) || item.neighbours !== 0 || item.showing || item.flagged) {
            return;
        }

        this.floodStack.push(item.id);

        let neighbours = this.getNeighbourIds(item);

        for (let neighbour of neighbours) {
            if (grid[neighbour].neighbours === 0) {
                this.floodFill(grid[neighbour], grid);
            }
        }

        return;
  }

    endStateCheck = (grid: GridTile[], flags: number): string | false => {
        const openTiles = grid.filter(t => t.showing === true).length;

        /* check flags match mines and open tiles matches expected value */
        if (flags === GAME.mines && openTiles === grid.length - GAME.mines) {
            return "You Win!"
        }

        return false;
    }

    handleReset = (): void => {
        this.floodStack = [];
        this.createGrid();
    }

    tileClick = (id: number): void => {
        const currentItem = this.state.grid[id];

        if (!this.state.endFlag) {
            let ids = this.newTileStatus(currentItem);

            const grid = this.state.grid.map((item, index) => {
                return ids.includes(index) ? {...item, showing: true} : item;
            });

            let endFlag = this.endStateCheck(grid, this.state.flagCounter);

            if (currentItem.neighbours === 9) endFlag = "Oops Game Over!"

            this.setState({ grid, endFlag });
        }
    }

    tileRightClick = (id: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.preventDefault();
        if (!this.state.endFlag) {
            const grid = this.state.grid.map(n => (
                n.id === id ? { ...n, flagged: !n.flagged } : n
            ));

            const flagCounter = grid.filter(n => n.flagged).length;

            const endFlag = this.endStateCheck(grid, flagCounter);

            this.setState({ grid, flagCounter, endFlag });
        }
    }

    render() {
        const {grid, flagCounter, endFlag} = this.state;

        return (
            <div className="app">
                <div className="container">
                    <Controls
                        mines={GAME.mines}
                        endGame={endFlag}
                        flagCounter={flagCounter}
                    />
                    <Board
                        grid={grid}
                        handleTileClick={this.tileClick}
                        handleRightClick={this.tileRightClick}
                    />
                    <button onClick={this.handleReset}>New Game</button>
                </div>
                <Footer />
            </div>
        );
    }
}

export default MinesweeperGame;

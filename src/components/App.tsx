import React, {Component} from 'react';
import Controls from './Controls';
import Board from './Board';
import Footer from './Footer';
import { GAME_CONFIG } from '../utils/config';
import { getNeighbourIds, createNewBoard } from '../utils/helpers';

interface State {
    grid: GridTile[];
    mineIndexs: number[];
    flagCounter: number;
    endFlag: boolean | string;
}

class App extends Component<{}, State> {
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
        const { grid, mineIndexs } = createNewBoard();
        this.setState({ grid, mineIndexs, flagCounter: 0, endFlag: false });
    }

    newTileStatus = (item: GridTile): number[] => {
        if (item.neighbours === 0) {
            const { grid } = this.state;
            this.floodFill(item, this.state.grid);

            let neighbours = this.floodStack
                .reduce((acc, cur) => {
                    const neighbourIds = getNeighbourIds(grid[cur]);
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

        let neighbours = getNeighbourIds(item);

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
        if (flags === GAME_CONFIG.mines && openTiles === grid.length - GAME_CONFIG.mines) {
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
                        mines={GAME_CONFIG.mines}
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

export default App;

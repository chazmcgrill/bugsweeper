import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import Board from './Board';
import Footer from './Footer';
import { GAME_CONFIG } from '../utils/config';
import * as utils from '../utils';
import { createNewBoard } from '../utils/createNewBoard';

interface GameState {
    grid: GridTile[];
    flagCounter: number;
    endFlag: boolean | string;
}

interface AppProps {
    customBugIndexes?: number[];
}

const DEFAULT_GAME_STATE = {
    grid: [],
    flagCounter: 0,
    endFlag: false,
};

const toggleGridItemFlag = (grid: GridTile[], id: number) => grid
    .map(item => item.id === id ? { ...item, flagged: !item.flagged } : item);

const App = ({ customBugIndexes }: AppProps) => {
    const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);

    const tileClick = (id: number): void => {
        const { grid, endFlag, flagCounter } = gameState;
        const currentItem = grid[id];

        if (!endFlag) {
            const ids = utils.newTileStatus(currentItem, grid);
            const newGrid = grid.map((item, index) => ids.includes(index) ? { ...item, showing: true } : item);

            let newEndFlag = utils.endStateCheck(newGrid, flagCounter);

            if (currentItem.neighbours === 9) newEndFlag = "Oops Game Over!"

            setGameState({ ...gameState, grid: newGrid, endFlag: newEndFlag })
        }
    }

    const tileRightClick = (id: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.preventDefault();

        if (!gameState.endFlag) {
            const grid = toggleGridItemFlag(gameState.grid, id);
            const flagCounter = grid.filter(n => n.flagged).length;
            const endFlag = utils.endStateCheck(grid, flagCounter);

            setGameState({ grid, endFlag, flagCounter })
        }
    }

    const handleReset = (): void => {
        const grid = createNewBoard();
        setGameState({ ...DEFAULT_GAME_STATE, grid });
    }

    useEffect(() => {
        const grid = createNewBoard(customBugIndexes);
        setGameState({ ...DEFAULT_GAME_STATE, grid });
    }, [customBugIndexes]);

    const { grid, endFlag, flagCounter } = gameState;

    return (
        <div className="app">
            <div className="container">
                <Controls
                    bugs={GAME_CONFIG.bugs}
                    endGame={endFlag}
                    flagCounter={flagCounter}
                />
                <Board
                    grid={grid}
                    handleTileClick={tileClick}
                    handleRightClick={tileRightClick}
                />
                <button onClick={handleReset}>New Game</button>
            </div>
            <Footer />
        </div>
    );
}

export default App;

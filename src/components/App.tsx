import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import Board from './Board';
import Footer from './Footer';
import { GAME_CONFIG } from '../utils/config';
import { createNewBoard, endStateCheck, newTileStatus } from '../utils';

export let floodStack = [] as number[];

interface GameState {
    grid: GridTile[];
    flagCounter: number;
    endFlag: boolean | string;
}

const DEFAULT_GAME_STATE = {
    grid: [],
    flagCounter: 0,
    endFlag: false,
};

const toggleGridItemFlag = (grid: GridTile[], id: number) => grid
    .map(item => item.id === id ? { ...item, flagged: !item.flagged } : item);

const App = () => {
    const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);

    const tileClick = (id: number): void => {
        const { grid, endFlag, flagCounter } = gameState;
        const currentItem = grid[id];

        if (!endFlag) {
            const ids = newTileStatus(currentItem, grid);
            const newGrid = grid.map((item, index) => ids.includes(index) ? { ...item, showing: true } : item);
            
            let newEndFlag = endStateCheck(grid, flagCounter);

            if (currentItem.neighbours === 9) newEndFlag = "Oops Game Over!"

            setGameState({ ...gameState, grid: newGrid, endFlag: newEndFlag })
        }
    }

    const tileRightClick = (id: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.preventDefault();

        if (!gameState.endFlag) {
            const grid = toggleGridItemFlag(gameState.grid, id);
            const flagCounter = grid.filter(n => n.flagged).length;
            const endFlag = endStateCheck(grid, flagCounter);

            setGameState({ grid, endFlag, flagCounter })
        }
    }

    const handleReset = (): void => {
        floodStack = [];
        const grid = createNewBoard();
        setGameState({ ...DEFAULT_GAME_STATE, grid });
    }

    useEffect(() => {
        const grid = createNewBoard();
        setGameState({ ...DEFAULT_GAME_STATE, grid });
    }, []);

    const { grid, endFlag, flagCounter } = gameState;

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

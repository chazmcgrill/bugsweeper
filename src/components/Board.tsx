import React from 'react';
import Tile from './Tile';

interface Props {
    grid: GridTile[];
    handleTileClick: (id: number) => void;
    handleRightClick: (id: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Board = (props: Props) => {
    return (
        <div className="game-board">
            {props.grid.map((tile, index) => (
                <Tile
                    key={index}
                    tileData={tile}
                    handleTileClick={props.handleTileClick}
                    handleRightClick={props.handleRightClick}
                />
            ))}
        </div>
    )
}

export default Board;

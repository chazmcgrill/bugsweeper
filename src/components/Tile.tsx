import React from 'react';

const colorKey = ["204A4D#", "#9C66BD", "#BD5580", "#DE6864", "#DEAE4D", "#39C138"];

interface Props {
    tileData: GridTile;
    handleTileClick: (id: number) => void;
    handleRightClick: (id: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Tile = ({tileData, handleTileClick, handleRightClick}: Props) => {
    function tileInfo() {
        switch (tileData.neighbours) {
            case 0:
                return '';
            case 9:
                return <i className="fa fa-bug" />;
            default:
                return tileData.neighbours;
        }
    };

    const neighboursIndex = tileData.neighbours ? tileData.neighbours - 1 : 0;

    const tileStyle = {
        background: tileData.tile === 0 ? '#B2EAB9' : '#EA8582', 
        color: colorKey[neighboursIndex]
    };
    
    return tileData.showing ? (
        <div className="tile" style={tileStyle} test-id="tile-showing">
            {tileInfo()}
        </div>
    ) : (
        <div onClick={() => handleTileClick(tileData.id)} onContextMenu={(e) => handleRightClick(tileData.id, e)} className="tile" test-id="tile-flagged">
            {tileData.flagged && <i className="fa fa-ban" />}
        </div>
    )
};

export default Tile;

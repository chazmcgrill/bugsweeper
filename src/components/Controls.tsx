import React from 'react';

interface Props {
	mines: number;
	endGame: boolean | string;
	flagCounter: number;
}

const Controls = ({ mines, endGame, flagCounter }: Props) => (
	<div className="controls">
		<span>{endGame ? endGame : `Find ${mines - flagCounter} bugs`}</span>
	</div>
)

export default Controls;

import React from 'react';

interface Props {
	bugs: number;
	endGame: boolean | string;
	flagCounter: number;
}

const Controls = ({ bugs, endGame, flagCounter }: Props) => (
	<div className="controls">
		<span>{endGame ? endGame : `Find ${bugs - flagCounter} bugs`}</span>
	</div>
)

export default Controls;

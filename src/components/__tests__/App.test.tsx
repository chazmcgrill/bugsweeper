import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../../utils/config', () => ({
    get GAME_CONFIG() {
        return {
            width: 10,
            height: 10,
            bugs: 2,
        };
    },
}));

test('shows initial message', () => {
    const { asFragment } = render(<App />);
    expect(screen.getAllByText('Find 2 bugs')).toBeTruthy();
    expect(screen.getAllByTestId('tile')).toHaveLength(100);
    expect(asFragment()).toMatchSnapshot();
});

test('right click tile adds flag icon', () => {
    render(<App />);

    const eventNode = screen.getAllByTestId('tile')[0];

    fireEvent.contextMenu(eventNode);

    const flagTile = screen.getByTestId('flag-icon');

    expect(flagTile).toBeTruthy();
});

test('right click tile updates bug count', () => {
    render(<App customBugIndexes={[0]} />);
    const eventNode = screen.getAllByTestId('tile')[0];

    fireEvent.contextMenu(eventNode);

    const titleText = screen.getByText('Find 1 bugs');

    expect(titleText).toBeTruthy();
});

test('pressing on bug ends game', () => {
    render(<App customBugIndexes={[0]} />);
    const eventNode = screen.getAllByTestId('tile')[0];

    fireEvent.click(eventNode);

    const titleText = screen.getByText('Oops Game Over!');

    expect(titleText).toBeTruthy();
});

test('pressing on bug shows bug icon', () => {
    render(<App customBugIndexes={[0]} />);
    const eventNode = screen.getAllByTestId('tile')[0];

    fireEvent.click(eventNode);

    const tile = screen.getByTestId('bug-icon');

    expect(tile).toBeTruthy();
});

test('pressing on non bug clears tiles', () => {
    render(<App customBugIndexes={[0]} />);
    const eventNode = screen.getAllByTestId('tile')[5];

    fireEvent.click(eventNode);

    const tile = screen.getAllByTestId('tile-showing');

    expect(tile).toBeTruthy();
});

test('pressing new game resets board', () => {
    render(<App customBugIndexes={[0]} />);
    const eventNode = screen.getAllByTestId('tile')[5];

    fireEvent.click(eventNode);

    screen.getAllByTestId('tile-showing');

    const button = screen.getByText('New Game');

    fireEvent.click(button);

    const tiles = screen.getAllByTestId('tile');

    expect(screen.getByText('Find 2 bugs')).toBeTruthy();
    expect(tiles).toHaveLength(100);
});

test('on flagging all bugs win state is shown', () => {
    render(<App customBugIndexes={[0, 1]} />);
    const bug1 = screen.getAllByTestId('tile')[0];
    const bug2 = screen.getAllByTestId('tile')[1];
    const nonBug = screen.getAllByTestId('tile')[99];

    fireEvent.contextMenu(bug1);
    fireEvent.contextMenu(bug2);
    fireEvent.click(nonBug);

    const headerText = screen.getByText('You Win!');

    expect(headerText).toBeTruthy();
});

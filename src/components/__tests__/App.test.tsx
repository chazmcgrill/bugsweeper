import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App';

jest.mock('../../utils/config', () => ({
    get GAME_CONFIG() {
        return {
            width: 10,
            height: 10,
            bugs: 2
        }
    }
}))

test('shows initial message', () => {
    const { asFragment } = render(<App />);
    expect(screen.getAllByText('Find 2 bugs')).toBeTruthy();
    expect(screen.getAllByTestId('tile')).toHaveLength(100);
    expect(asFragment()).toMatchSnapshot();
});

test('right click tile adds flag icon', async () => {
    const { getByTestId, getAllByTestId } = render(<App />);        
    const eventNode = getAllByTestId('tile')[0];

    fireEvent.contextMenu(eventNode);

    const tile = await getByTestId('flag-icon');

    expect(tile).toBeTruthy();    
});

test('right click tile updates bug count', async () => {
    const { getByText, getAllByTestId } = render(<App customBugIndexes={[0]} />);
    const eventNode = getAllByTestId('tile')[0];

    fireEvent.contextMenu(eventNode);

    const titleText = await getByText('Find 1 bugs');

    expect(titleText).toBeTruthy();
});

test('pressing on bug ends game', async () => {
    const { getByText, getAllByTestId } = render(<App customBugIndexes={[0]} />);
    const eventNode = getAllByTestId('tile')[0];

    fireEvent.click(eventNode);

    const titleText = await getByText('Oops Game Over!');

    expect(titleText).toBeTruthy();
});

test('pressing on bug shows bug icon', async () => {
    const { getByTestId, getAllByTestId } = render(<App customBugIndexes={[0]} />);
    const eventNode = getAllByTestId('tile')[0];

    fireEvent.click(eventNode);

    const tile = await getByTestId('bug-icon');

    expect(tile).toBeTruthy();  
});

test('pressing on non bug clears tiles', async () => {
    const { getAllByTestId } = render(<App customBugIndexes={[0]} />);
    const eventNode = getAllByTestId('tile')[5];

    fireEvent.click(eventNode);

    const tile = await getAllByTestId('tile-showing');

    expect(tile).toBeTruthy(); 
});

test('pressing new game resets board', async () => {
    const { getByText, getAllByTestId } = render(<App customBugIndexes={[0]} />);
    const eventNode = getAllByTestId('tile')[5];

    fireEvent.click(eventNode);

    await getAllByTestId('tile-showing');

    const button = getByText('New Game');

    fireEvent.click(button);

    const tiles = await getAllByTestId('tile');

    expect(getByText('Find 2 bugs')).toBeTruthy();
    expect(tiles).toHaveLength(100); 
});

test('on flagging all bugs win state is shown', async () => {
    const { getByText, getAllByTestId } = render(<App customBugIndexes={[0, 1]} />);
    const bug1 = getAllByTestId('tile')[0];
    const bug2 = getAllByTestId('tile')[1];
    const nonBug = getAllByTestId('tile')[99];

    fireEvent.contextMenu(bug1);
    fireEvent.contextMenu(bug2);
    fireEvent.click(nonBug);

    const headerText = await getByText('You Win!');

    expect(headerText).toBeTruthy();
});
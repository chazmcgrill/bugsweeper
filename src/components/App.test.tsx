import { vi, it, expect, describe, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App';
import type { GameConfig } from '../utils/config';

const mockConfig = vi.hoisted(() => ({
    GAME_CONFIG: {
        width: 10,
        height: 10,
        bugs: 2,
    } as GameConfig,
}));

vi.mock('../utils/config', () => ({
    get GAME_CONFIG() {
        return mockConfig.GAME_CONFIG;
    },
    get SOCIAL_CONFIG() {
        return {};
    },
}));

describe('Game', () => {
    beforeEach(() => {
        mockConfig.GAME_CONFIG = { width: 10, height: 10, bugs: 2 };
    });

    it('shows initial message', () => {
        render(<App />);
        expect(screen.getAllByText('Find 2 bugs')).toBeTruthy();
        expect(screen.getAllByTestId('tile')).toHaveLength(100);
    });

    it('right click tile adds flag icon', () => {
        render(<App />);

        const eventNode = screen.getAllByTestId('tile')[0];

        fireEvent.contextMenu(eventNode);

        const flagTile = screen.getByTestId('flag-icon');

        expect(flagTile).toBeTruthy();
    });

    it('right click tile updates bug count', () => {
        mockConfig.GAME_CONFIG = { width: 10, height: 10, bugs: 2, customBugIndexes: [0] };
        render(<App />);
        const eventNode = screen.getAllByTestId('tile')[0];

        fireEvent.contextMenu(eventNode);

        const titleText = screen.getByText('Find 1 bugs');

        expect(titleText).toBeTruthy();
    });

    it('pressing on bug ends game', () => {
        mockConfig.GAME_CONFIG = { width: 10, height: 10, bugs: 2, customBugIndexes: [0] };
        render(<App />);
        const eventNode = screen.getAllByTestId('tile')[0];

        fireEvent.click(eventNode);

        const titleText = screen.getByText('Oops Game Over!');

        expect(titleText).toBeTruthy();
    });

    it('pressing on bug shows bug icon', () => {
        mockConfig.GAME_CONFIG = { width: 10, height: 10, bugs: 2, customBugIndexes: [0] };
        render(<App />);
        const eventNode = screen.getAllByTestId('tile')[0];

        fireEvent.click(eventNode);

        const tile = screen.getByTestId('bug-icon');

        expect(tile).toBeTruthy();
    });

    it('pressing on non bug clears tiles', () => {
        mockConfig.GAME_CONFIG = { width: 10, height: 10, bugs: 2, customBugIndexes: [0] };
        render(<App />);
        const eventNode = screen.getAllByTestId('tile')[5];

        fireEvent.click(eventNode);

        const tile = screen.getAllByTestId('tile-showing');

        expect(tile).toBeTruthy();
    });

    it('pressing new game resets board', () => {
        mockConfig.GAME_CONFIG = { width: 10, height: 10, bugs: 2, customBugIndexes: [0] };
        render(<App />);
        const eventNode = screen.getAllByTestId('tile')[5];

        fireEvent.click(eventNode);

        screen.getAllByTestId('tile-showing');

        const button = screen.getByText('New Game');

        fireEvent.click(button);

        const tiles = screen.getAllByTestId('tile');

        expect(screen.getByText('Find 2 bugs')).toBeTruthy();
        expect(tiles).toHaveLength(100);
    });

    it('on flagging all bugs win state is shown', () => {
        mockConfig.GAME_CONFIG = { width: 10, height: 10, bugs: 2, customBugIndexes: [0, 1] };
        render(<App />);
        const bug1 = screen.getAllByTestId('tile')[0];
        const bug2 = screen.getAllByTestId('tile')[1];
        const nonBug = screen.getAllByTestId('tile')[99];

        fireEvent.contextMenu(bug1);
        fireEvent.contextMenu(bug2);
        fireEvent.click(nonBug);

        const headerText = screen.getByText('You Win!');

        expect(headerText).toBeTruthy();
    });
});

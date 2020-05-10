// __tests__/fetch.test.js
import React from 'react'
import { render, screen } from '@testing-library/react'
// import '@testing-library/jest-dom/extend-expect'
import App from '../App';

test('shows initial message', () => {
    render(<App />);
    expect(screen.getAllByText('Find 10 bugs')).toBeTruthy();
});

test('flagging items works', () => {});

test('reset game works', () => {});

test('pressing on bug works', () => {});

test('pressing on none bug works', () => {});

test('game completion works', () => {});
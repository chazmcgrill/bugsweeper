export interface GameConfig {
    /** used for testing only */
    customBugIndexes?: number[];
    width: number;
    height: number;
    bugs: number;
}

export const GAME_CONFIG: GameConfig = {
    width: 10,
    height: 10,
    bugs: 10,
};

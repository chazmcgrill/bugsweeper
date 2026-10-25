import { FaFreeCodeCamp, FaGithub, FaLinkedin, FaCodepen, FaBluesky } from 'react-icons/fa6';

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

export const SOCIAL_CONFIG = {
    freeCodeCamp: {
        url: 'freecodecamp.com/chazmcgrill',
        icon: FaFreeCodeCamp,
    },
    bluesky: {
        url: 'bsky.app/profile/charlietaylor.dev',
        icon: FaBluesky,
    },
    github: {
        url: 'github.com/chazmcgrill',
        icon: FaGithub,
    },
    linkedin: {
        url: 'linkedin.com/in/charliejbtaylor',
        icon: FaLinkedin,
    },
    codepen: {
        url: 'codepen.io/chazmcgrill',
        icon: FaCodepen,
    },
} as const;

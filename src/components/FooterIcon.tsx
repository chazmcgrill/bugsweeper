import { createElement } from 'react';
import { SOCIAL_CONFIG } from '../utils/config';

interface Props {
    socialKey: keyof typeof SOCIAL_CONFIG;
}

const FooterIcon = ({ socialKey }: Props) => {
    return <a href={`https://${SOCIAL_CONFIG[socialKey].url}`}>{createElement(SOCIAL_CONFIG[socialKey].icon, { size: '1.2rem' })}</a>;
};

export default FooterIcon;

import { SOCIAL_CONFIG } from '../utils/config';
import FooterIcon from './FooterIcon';

const Footer = () => (
    <footer>
        <div className="footer-icons">
            {(Object.keys(SOCIAL_CONFIG) as Array<keyof typeof SOCIAL_CONFIG>).map((key) => (
                <FooterIcon key={key} socialKey={key} />
            ))}
        </div>
        <p className="footer-message">
            designed and coded by
            <a href="http://www.charlietaylor.dev"> charlie taylor</a>
        </p>
    </footer>
);

export default Footer;

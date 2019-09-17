import React from 'react';
import FooterIcon from './FooterIcon';

const Footer = () => (
    <footer>
        <div className="footer-icons">
            <FooterIcon url="www.freecodecamp.com/chazmcgrill" icon="free-code-camp" />
            <FooterIcon url="twitter.com/charlietcoder" icon="twitter" />
            <FooterIcon url="github.com/chazmcgrill" icon="github" />
            <FooterIcon url="www.linkedin.com/in/charliejbtaylor/" icon="linkedin" />
            <FooterIcon url="codepen.io/chazmcgrill/" icon="codepen" />
        </div>
        <p className="footer-message">designed and coded by
            <a href="http://www.charlietaylorcoder.com"> charlie taylor</a>
        </p>
    </footer>
);

export default Footer;
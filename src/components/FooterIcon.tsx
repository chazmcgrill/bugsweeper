import React from 'react';

interface Props {
    url: string;
    icon: string;
}

const FooterIcon = ({ url, icon }: Props) => (
    <a href={`https://${url}`}>
        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
    </a>
);

export default FooterIcon;
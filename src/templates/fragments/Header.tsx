import React from 'react';
import Logo from './Logo';
import My from './My';
import Nav from './Nav';

import '../../stylesheets/fragments/header.css';

interface NavProps {
    navClick: () => void;
}

const Header: React.FC<NavProps> = ({ navClick }) => {
    const callback_fromNav = () => {
        navClick();
    };

    return (
        <div id='header'>
            <Nav navClick={callback_fromNav} />
            <Logo />
            <My />
        </div>
    )
}

export default Header;
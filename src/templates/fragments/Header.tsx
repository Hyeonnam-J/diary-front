import React, { useState } from 'react';
import Logo from './Logo';
import My from './My';
import Nav from './Nav';

import '../../stylesheets/fragments/header.css';

interface NavProps {
    navClick: () => void;
}

const Header: React.FC<NavProps> = ({ navClick }) => {
    const [isNavOpen, setNavOpen] = useState(false);

    const callback_fromNav = () => {
        navClick();
        setNavOpen(prevState => !prevState);
    };

    const navWidth = 'var(--nav-contents-width)'

    return (
        <div id='header' style={{ left: isNavOpen ? `${navWidth}` : '0' }}>
            <Nav navClick={callback_fromNav} />
            <Logo />
            <My />
        </div>
    )
}

export default Header;
import React, { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import My from './My';
import Logo from './Logo';
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
            <div id='header-left'>
                <Logo />
                <Nav navClick={callback_fromNav} />
            </div>
            <div id='header-right'>
                <My />
            </div>
        </div>
    )
}

export default Header;
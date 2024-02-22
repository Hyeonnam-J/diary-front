import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutRouteProps } from "react-router-dom";

import '../../stylesheets/common/common.css';
import '../../stylesheets/common/layout.css';

import '../../stylesheets/common/common.css';
import '../../stylesheets/common/layout.css';
import Header from "../fragments/Header";

const SignLayout: React.FC<LayoutRouteProps> = (props) => {
    const [isNavOpen, setNavOpen] = useState(false);

    const callback_fromHeader = () => {
        setNavOpen(prevState => !prevState);
    };

    const navWidth = 'var(--nav-contents-width)'
    const navWidthMinus = 'var(--nav-contents-width-minus)'

    return (
        <div className="container">
            <Header navClick={callback_fromHeader} />

            <div id='nav-contents-box' style={{ left: isNavOpen ? '0' : navWidthMinus }}>
                <ul id='nav-contents'>
                    <li><Link to="/freeBoard">free board</Link></li>
                    <li>preparing...</li>
                </ul>
            </div>
            
            <main className='main-sign'>
                {props.children}
            </main>
        </div>
    );
}

export default SignLayout;

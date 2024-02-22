import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';

import '../../stylesheets/common/common.css';
import '../../stylesheets/common/layout.css';
import Header from '../fragments/Header';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
    const [isNavOpen, setNavOpen] = useState(false);

    const callback_fromHeader = () => {
        setNavOpen(prevState => !prevState);
    };

    const navWidth = 'var(--nav-contents-width)'
    const navWidthMinus = 'var(--nav-contents-width-minus)'

    return (
        <div className='container'>
            <Header navClick={callback_fromHeader} />
            
            <div id='nav-contents-box' style={{ left: isNavOpen ? '0' : navWidthMinus }}>
                <h3 id='nav-greetings'>Welcome</h3>
                <ul id='nav-contents'>
                    <li><Link to="/freeBoard">free board</Link></li>
                </ul>
            </div>

            <main style={{ left: isNavOpen ? navWidth : '0' }}>
                {props.children}
            </main>
        </div>
    );
}

export default Layout;
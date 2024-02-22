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
            <div id='nav-contents-box' style={{ left: isNavOpen ? '0' : navWidthMinus }}>
                <div id='nav-contents-box-space' />
                
                <ul id='nav-contents'>
                    <li><Link to="/freeBoard">free board</Link></li>
                    <li>preparing...</li>
                </ul>
            </div>

            <div id='main-wrap' style={{ left: isNavOpen ? navWidth : '0' }}>
                <Header navClick={callback_fromHeader} />
                <main>
                    <div>
                        {props.children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;
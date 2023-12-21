import React, { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { SERVER_IP } from "../../Config";
import My from "../fragments/My";
import Nav from "../fragments/Nav";

import '../../stylesheets/common/common.css';
import '../../stylesheets/common/layout.css';

interface LayoutProps {
    children: ReactNode;
}

const menuClickHandler = (uri: string, userId: string | null, accessToken: string | null) => {
    const response = fetch(SERVER_IP+uri, {
        headers: {
            "Content-Type": "application/json",
            "userId": `${userId}`,
            'Authorization': `${accessToken}`,
        },
        method: 'POST',
//         body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    })
}

const Layout: React.FC<LayoutProps> = (props) => {
    const [isNavOpen, setNavOpen] = useState(false);

    // 초깃값 null. 타입은 string.
    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // 비동기 데이터처리 따위에 쓰임.
    // 두 번째 파라미터는 의존성 배열로 그 배열의 값이 변경될 때 useEffect가 실행.
    // 지금은 빈 배열을 전달하여 한 번만 실행되도록 설정.
    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
        setAccessToken(localStorage.getItem('accessToken'));
    }, []);

    const receiveNavClick = () => {
        setNavOpen(prevState => !prevState);
    };

    const navWidth = 'var(--nav-contents-width)'
    const navWidthMinus = 'var(--nav-contents-width-minus)'

    return (
        <div className='container'>
            {/* MY 버튼은 종속 없이 늘 그자리에. 속성 absolute. */}
            <My />

            {/* nav-contents html 요소를 Nav.tsx에서 제어하기에는 코드가 복잡해짐
            DefaultLayout에 html 요소를 넣고 display 요소를 제어하는 것이 간편 */}
            <div id='nav-contents-box' style={{ left: isNavOpen ? '0' : navWidthMinus }}>
                <h3 id='nav-greetings'>Welcome</h3>
                <ul id='nav-contents'>
                    <li><Link to="/freeBoard">free board</Link></li>
                </ul>
            </div>

            <main className='main-default' style={{ left: isNavOpen ? navWidth : '0' }}>

                {/* nav는 상대적 위치로 종속. */}
                <Nav navClick={receiveNavClick} />
                {props.children}

            </main>
        </div>
    );
}

export default Layout;
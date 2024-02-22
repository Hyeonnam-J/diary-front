import React, { useState } from 'react';

import menu from '../../assets/imgs/menu.png'
import exit from '../../assets/imgs/exit.png'

import '../../stylesheets/common/common.css';
import '../../stylesheets/fragments/nav.css';

interface NavProps {
    navClick: () => void;
}

// Nav 리액트 컴포넌트를 정의하는 변수
// React.FC 해당 컴포넌트가 함수 컴포넌트임을 나타냄.
// <NavProps> 컴포넌트에 전달되는 props 타입
// ({ navClick }) 함수 컴포넌트의 파라미터.
// FC -> Functional Component
// props -> properties. 데이터를 전달하는 데 사용되는 객체.
const Nav: React.FC<NavProps> = ({ navClick }) => {
// const Nav: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const sendToHeaderCallback = () => {
        navClick();  // 헤더 콜백.
        setIsMenuOpen(prevState => !prevState); // setIsMenuOpen(!isMenuOpen);
    };
  
    return (
        <nav>
            <div id='nav-container' onClick={sendToHeaderCallback}>
            {/* <div id='nav-container'> */}
                <img src={ isMenuOpen ? exit : menu } alt='menu' />
            </div>
        </nav>
    );
}

export default Nav;
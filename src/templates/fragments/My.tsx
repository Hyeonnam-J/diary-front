import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import my from '../../assets/imgs/my.png';

import { deleteCookie, getAccessToken, getCookie, parseAccessToken } from '../../auth/cookie';
import '../../stylesheets/common/common.css';
import '../../stylesheets/fragments/my.css';

const My: React.FC = () => {
    const navigate = useNavigate();

    // React Hook인 useState를 사용하여 새로운 상태 변수를 생성
    // 변수명 isDropdownVisible, 초깃값 false.
    // 이 변수를 변경하기 위한 함수 setDropdownVisible.
    // useState를 담은 변수 isDropdownVisible의 상태가 바뀔 때마다
    // 해당 값에 의존하는 JSX 코드를 다시 실행하고 화면을 업데이트.
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isSignedIn, setSignedIn] = useState(false);
    const [nick, setNick] = useState('');
    
    const signOut = () => {
        setSignedIn(false);
        setDropdownVisible(false);
        if (getCookie()) deleteCookie();
        sessionStorage.clear();
        localStorage.clear();
        navigate('/');
    }

    useEffect(() => {
        // 새로고침이면,
        const isRefresh = sessionStorage.getItem('isRefresh');
        if(isRefresh === 'true'){
            // isStay가 true면 쿠키를 안 지우니 살아있지만 false면 지워지니 여기 시작 탬플릿에서 다시 할당.
            const isStay = localStorage.getItem('isStay');
            if(isStay === 'false'){
                const documentDotCookie = sessionStorage.getItem('documentDotCookie');
                if(documentDotCookie) document.cookie = documentDotCookie;
            }
        }

        const cookie = getCookie();
        if(cookie){
            const accessToken = getAccessToken(cookie);
            const { nick } = parseAccessToken(accessToken);

            setSignedIn(!!nick);
            setNick(nick || '');    
        }
    }, []);
    
    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    return (
        <div id='my'>
            <div id='my-container' onClick={toggleDropdown}>
                <img src={my} alt='my' />
                <div id='my-contents-box' style={{ display: isDropdownVisible ? 'flex' : 'none' }}>
                    <ul className='my-contents' style={{ display: !isSignedIn ? 'block' : 'none' }}>
                        <li><Link to="/">Home</Link></li>
                        <span className='separator'></span>
                        <li id='li-signIn'><Link to="/signIn">Sign In</Link></li>
                        <li><Link to="/signUp">Sign Up</Link></li>
                    </ul>
                    <ul className='my-contents' style={{ display: isSignedIn ? 'block' : 'none' }}>
                        <li><Link to="/">Home</Link></li>
                        <span className='separator'></span>
                        <li>{nick}</li>
                        <li onClick={signOut}>sign out</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default My;
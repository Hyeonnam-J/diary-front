import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { deleteCookie } from './auth/cookie';
import routes, { RouteConfig } from './templates/RouteConfig';

function App() {
    const once = true;

    /**
     * isStay === true, 세션 스토리지 신경 쓸 필요 없다. 로직 신경 쓸 필요 없다.
     * 
     * isStay === false, out일 때 쿠키 삭제. 세션 스토리지는 자동으로 삭제.
     * isStay === false, refresh일 때 쿠키 어쩔 수 없이 삭제. 세션 스토리지는 유지되므로 초기 탬플릿에서 다시 document.cookie에 세션 스토리지의 쿠키 값 넣어준다.
     * 
     * 새로고침 후 초기 설정은 addEventListener의 load지만 불규칙적으로 동작. My 탬플릿에서 초기 설정 중.
     */
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            // 새로고침이면 세션 스토리지는 유지되니 새로고침 탬플릿에서 isRefresh 값을 판별해볼 수 있다.
            // 새로고침 아니면 어차피 지워질 테니 값은 참으로 통일해도 상관 없음.
            sessionStorage.setItem('isRefresh', 'true');

            // isStay === false, out일 때 쿠키 삭제.
            const isStay = localStorage.getItem('isStay');
            if(isStay === 'false') deleteCookie();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // useEffect 내 return은 clean-up 함수로 컴포넌트가 언마운트 시 동작.
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [once]);

    return (
        // URL 변경을 React-Router가 감지.
        // map 함수로 순회하며 routes 배열의 path와 변경된 URL이 일치하는지 확인.
        // 일치하면 해당 라우트의 엘리먼트를 렌더링.
        <Routes>
            {/* 해시 셋으로 바로 접근해버리면 훨씬 빠르지만 코드의 간편성, 유지보수를 위해 이게 일반적인 방법? */}
            {routes.map((route: RouteConfig) => (
                <Route 
                    key={route.path} 
                    path={route.path} 
                    element={route.element} 
                />
            ))}
        </Routes>
    );
}

export default App;

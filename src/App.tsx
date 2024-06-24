import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { deleteCookie } from './auth/cookie';
import routes, { RouteConfig } from './templates/RouteConfig';

function App() {
    
    /**
     * 나가거나 새로고침 시,
     * 
     * 나가는데 isStay === true, 아무 처리도 안 하면 된다.
     * 세션 스토리지 자동 삭제. 로컬 스토리지의 isStay 및 cookie는 존재.
     * 
     * 나가는데 isStay === false, 쿠키를 지우면 된다.
     * 세션 스토리지 자동 삭제. 쿠키 삭제. 그럼 localStorage에 isStay가 false란 값만 남는다.
     * 
     * 새로고침이면 세션 스토리지에 새로고침 판별 여부를 저장해두고
     * isStay가 false면 쿠키를 삭제했으니, My 탬플릿에서 세션 스토리지에 저장해둔 쿠키를 다시 브라우저에 저장.
     */
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            sessionStorage.setItem('isRefresh', 'true');
            
            const isStay = localStorage.getItem('isStay');
            if(isStay === 'false') deleteCookie();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // useEffect 내 return은 clean-up 함수로 컴포넌트가 언마운트 시 동작.
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

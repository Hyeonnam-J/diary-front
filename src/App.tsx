import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import routes, { RouteConfig } from './templates/RouteConfig';

function App() {

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // useEffect 내 return은 clean-up 함수로 컴포넌트가 언마운트 시 동작.
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        // URL 변경을 React-Router가 감지.
        // map 함수로 순회하며 routes 배열의 path와 변경된 URL이 일치하는지 확인.
        // 일치하면 해당 라우트의 엘리먼트를 렌더링.
        <Routes>
            {/* 해시 셋으로 바로 접근해버리면 훨씬 빠르지만 코드의 간편성, 유지보수를 위해 이게 일반적인 방법? */}
            {routes.map((route: RouteConfig) => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
}

export default App;

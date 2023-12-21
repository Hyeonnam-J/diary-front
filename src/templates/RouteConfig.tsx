import Home from './Home';
import SignIn from './pages/user/SignIn';
import SignUp from './pages/user/SignUp';
import FreeBoard from './pages/freeBoard/FreeBoard';
import FreeBoardPostWrite from './pages/freeBoard/FreeBoardPostWrite';
import FreeBoardPostRead from './pages/freeBoard/FreeBoardPostRead';
import FreeBoardPostReply from './pages/freeBoard/FreeBoardPostReply';
import FreeBoardPostUpdate from './pages/freeBoard/FreeBoardPostUpdate';

interface RouteConfig {
    path: string;
    element: React.ReactNode;
}

const routes: RouteConfig[] = [
    { path: '/', element: <Home /> },   
    { path: '/signIn', element: <SignIn /> },
    { path: '/signUp', element: <SignUp /> },
    { path: '/freeBoard', element: <FreeBoard /> },
    { path: '/freeBoard/post/write', element: <FreeBoardPostWrite /> },
    { path: '/freeBoard/post/read', element: <FreeBoardPostRead /> },
    { path: '/freeBoard/post/reply', element: <FreeBoardPostReply /> },
    { path: '/freeBoard/post/update', element: <FreeBoardPostUpdate /> },
];

export type { RouteConfig };
export default routes;
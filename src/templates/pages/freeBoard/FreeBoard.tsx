import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout';

import { Page, SERVER_IP } from "../../../Config";

import { user } from "../../../auth/auth";
import { FreeBoardPost, FreeBoardSort } from "../../../type/FreeBoard";

import Button from "../../../stylesheets/modules/button.module.css";
import '../../../stylesheets/pages/freeBoard/freeBoard.css';
import { getAccessToken, getCookie, parseAccessToken } from '../../../auth/cookie';

const FreeBoard = () => {
    const once = true;
    const navigate = useNavigate();

    const [userId, setUserId] = useState<number | null>(0);

    const [posts, setPosts] = useState<FreeBoardPost[]>(() => []);

    const [totalPostsCount, setTotalPostsCount] = useState(0);
    const [totalPagesCount, setTotalPagesCount] = useState(0);

    const [curPage, setCurPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const cookie = getCookie();
            if(cookie){
                const accessToken = getAccessToken(cookie);
                const { userId } = parseAccessToken(accessToken);

                setUserId(userId);
            }
        }

        fetchData();
        getTotalPostsCount();
    }, [once]);

    /* 비동기 때문에 나눠야 한다. */
    useEffect(() => {
        setTotalPagesCount(Math.ceil(totalPostsCount / Page.perPageSize));
    }, [totalPostsCount]);

    useEffect(() => {
        const sort = FreeBoardSort.BASIC;
        getPosts(`/freeBoard/posts?page=${curPage}&sort=${sort}`);
    }, [curPage]);

    const getTotalPostsCount = () => {
        fetch(SERVER_IP+"/freeBoard/posts/totalCount", {
            method: 'GET',
            credentials: "include",
        })
        .then(response => response.json())
        .then(body => {
            setTotalPostsCount(body.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const getPosts = (uri: string) => {
        fetch(SERVER_IP+uri, {
            method: 'GET',
            credentials: "include",
        })
        .then(response => response.json())
        .then(body => {
            setPosts(body.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const write = async () => {
        if(userId === 0) {
            alert('Please sign in');
            return;
        }
        
        const result = await user();
        if(result.auth){
            navigate('/freeBoard/post/write');
        }else{
            alert(result.message);
        }
    }

    const read = (post: FreeBoardPost) => {
        navigate('/freeBoard/post/read', { state: { postId: post.id } });
    }

    return (
        <DefaultLayout>
            <div id='boardFrame'>
                <div id='boardHeader'>
                    <div id='boardHeader-top'></div>
                    <div id='boardHeader-bottom'>
                        <button className={ Button.primary } onClick={ write }>write</button>
                    </div>
                </div>

                <div id='boardSection'>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}></th>
                                <th style={{ width: '40%' }}>title</th>
                                <th style={{ width: '20%' }}>writer</th>
                                <th style={{ width: '20%' }}>date</th>
                                <th style={{ width: '10%' }}>view</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => {
                                const prefixTitle = post.depth === 0 ? '' : '└ ';
                                const paddingLeft = 10 * post.depth;

                                return (
                                    <tr key={post.id}>
                                        <td>{post.id}</td>
                                        <td onClick={() => read(post)} className='title' style={{paddingLeft: `${paddingLeft}px`}}>
                                            {prefixTitle}{post.title}
                                        </td>
                                        <td className='nick'>{post.user.nick}</td>
                                        <td>{post.createdDate}</td>
                                        <td>{post.viewCount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div id='boardFooter'>
                    {totalPagesCount > 0 && (
                        <ReactPaginate
                            pageRangeDisplayed={Page.perBlockSize}
                            marginPagesDisplayed={1}
                            pageCount={totalPagesCount}
                            onPageChange={ ({selected}) => setCurPage(selected)}
                            containerClassName={'pagination'}
                            activeClassName={'pageActive'}
                            previousLabel="<"
                            nextLabel=">"
                        />
                    )}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default FreeBoard;
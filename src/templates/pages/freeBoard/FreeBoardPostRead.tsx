import { useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, SERVER_IP } from "../../../Config";
import { user } from "../../../auth/auth";
import { getAccessToken, getCookie, parseAccessToken } from '../../../auth/cookie';
import Button from "../../../stylesheets/modules/button.module.css";
import Layout from "../../../stylesheets/modules/layout.module.css";
import '../../../stylesheets/pages/freeBoard/freeBoardPostRead.css';
import { FreeBoardComment, FreeBoardPostDetail } from "../../../type/FreeBoard";
import DefaultLayout from "../../layouts/DefaultLayout";

const FreeBoardPostDetailRead = () => {
    const once = true;

    const navigate = useNavigate();
    const location = useLocation();

    const [userId, setUserId] = useState<number | null>(0);

    const postId = location?.state?.postId;
    const [post, setPost] = useState<FreeBoardPostDetail | null>(null);
    const [comments, setComments] = useState<FreeBoardComment[]>([]);

    const [totalCommentsCount, setTotalCommentsCount] = useState(0);
    const [totalPageCount, setTotalPageCount] = useState(0);

    const [curPage, setCurPage] = useState(0);

    const [replyingStates, setReplyingStates] = useState<Record<string, boolean>>({});
    const [updatingStates, setUpdatingStates] = useState<Record<string, boolean>>({});

    const getTotalCommentsCount = useCallback(() => {
        fetch(`${SERVER_IP}/freeBoard/comments/totalCount/${postId}`, {
            method: 'GET',
            credentials: "include",
        })
        .then(response => response.json())
        .then(body => {
            setTotalCommentsCount(body.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, [postId, setTotalCommentsCount]);

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
    }, [once]);

    useEffect(() => {
        getTotalCommentsCount();
    }, [postId, getTotalCommentsCount]);    // ESLint 경고 때문에 의미 없이 함수를 의존성 배열에 넣음.

    useEffect(() => {
        setTotalPageCount(Math.ceil(totalCommentsCount / Page.perPageSize));
    }, [totalCommentsCount]);

    useEffect(() => {
        getComments(`/freeBoard/comments/${postId}?page=${curPage}`);
    }, [curPage, postId]);

    useEffect(() => {
        getPost(postId);
    }, [postId]);

    const getComments = (uri: string) => {
        fetch(SERVER_IP + uri, {
            method: 'GET',
            credentials: "include",
        })
        .then(response => response.json())
        .then(body => {
            setComments(body.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const getPost = (postId: number) => {
        fetch(`${SERVER_IP}/freeBoard/post/read/${postId}`, {
            method: 'GET',
            credentials: "include",
        })
        .then(response => response.json())
        .then(body => {
            setPost(body.data);
        })
    }

    const replyPost = async (post: FreeBoardPostDetail | null) => {
        if(userId === 0) {
            alert('Please sign in');
            return;
        }

        const isAuth = await user();
        if (isAuth) {
            if (post) navigate('/freeBoard/post/reply', { state: { postId: post.id } });
        } else navigate('/signIn');
    }

    const updatePost = async (post: FreeBoardPostDetail | null) => {
        if ((userId || 0) === post?.user.id) {
            navigate('/freeBoard/post/update', { state: { post: post } });
        } else alert('You are not writer');
    }

    const deletePost = async (post: FreeBoardPostDetail | null) => {
        if ((userId || 0) === post?.user.id) {
            fetch(`${SERVER_IP}/freeBoard/post/delete/${postId}`, {
                method: 'DELETE',
                credentials: "include",
            })
            .then(response => {
                if(response.status === 403){
                    alert('Replies exist');
                    return;
                }

                navigate('/freeBoard');
            });
        } else alert('You are not writer');
    }

    const writeComment = () => {
        if(userId === 0){
            alert('Please sign in');
            return;
        }

        const commentContent = document.querySelector<HTMLTextAreaElement>('#read-comment-write textarea')?.value;

        const data = {
            postId: postId,
            content: commentContent,
        }
        
        fetch(SERVER_IP+"/freeBoard/comment/write", {
            headers: {
                "Content-Type": 'application/json',
            },
            credentials: "include",
            method: 'POST',
            body: JSON.stringify(data),
        })
        .then(body => {
            getTotalCommentsCount();
            getComments(`/freeBoard/comments/${postId}?page=${curPage}`);
            const textarea = document.querySelector<HTMLTextAreaElement>('#read-comment-write textarea');
            if (textarea) textarea.value = '';
        })
    }

    const replyComment = (commentId: string) => {
        if(userId === 0){
            alert('Please sign in');
            return;
        }

        const commentContent = document.querySelector<HTMLTextAreaElement>('.read-comment-reply textarea')?.value;

        const data = {
            commentId: commentId,
            content: commentContent,
        }

        fetch(SERVER_IP+"/freeBoard/comment/reply", {
            headers: {
                "Content-Type": 'application/json',
            },
            credentials: "include",
            method: 'POST',
            body: JSON.stringify(data),
        })
        .then(body => {
            getTotalCommentsCount();
            getComments(`/freeBoard/comments/${postId}?page=${curPage}`);
            const textarea = document.querySelector<HTMLTextAreaElement>('#read-comment-reply textarea');
            if (textarea) textarea.value = '';
            showReplyCommentFrame(commentId);
        })
    }

    const showReplyCommentFrame = (commentId: string) => {
        setReplyingStates((prevStates) => ({
            [commentId]: !prevStates[commentId] || false,
        }));
    };

    const showUpdateCommentFrame = (commentId: string) => {
        if(userId === 0){
            alert('please sign in');
            return;
        }

        setUpdatingStates((prevStates) => ({
            [commentId]: !prevStates[commentId] || false,
        }));
    }

    const updateComment = (commentId: string) => {
        const updateTextarea = document.querySelector(`#read-comment-${commentId} .read-comment-update`) as HTMLTextAreaElement;

        let updatedContent = updateTextarea ? updateTextarea.value : ''; 
        
        const data = {
            commentId: commentId,
            content: updatedContent,
        }

        fetch(SERVER_IP+"/freeBoard/comment/update", {
            headers: {
                "Content-Type": 'application/json',
            },
            credentials: "include",
            method: 'PUT',
            body: JSON.stringify(data),
        })
        .then(body => {
            getComments(`/freeBoard/comments/${postId}?page=${curPage}`);
            updateTextarea.value = '';
            showUpdateCommentFrame(commentId);
        })
    }

    const deleteComment = (comment: FreeBoardComment) => {
        if(userId !== comment.user.id) {
            alert('Unauthorization');
            return;
        }

        fetch(`${SERVER_IP}/freeBoard/comment/delete/${comment.id}`, {
            method: 'DELETE',
            credentials: "include",
        })
        .then(response => {
            if(response.status === 403){
                alert('Replies exist');
                return;
            }
            getTotalCommentsCount();
            getComments(`/freeBoard/comments/${postId}?page=${curPage}`);
        });
    }

    const list = () => {
        navigate('/freeBoard');
    }

    return (
        <DefaultLayout>
            <div id='read-frame' className={Layout.centerFrame}>
                <div id='read-header'>
                    <button onClick={() => replyPost(post)} className={Button.primary}>reply</button>
                    <button onClick={() => updatePost(post)} className={Button.primary}>update</button>
                    <button onClick={() => deletePost(post)} className={Button.inactive}>delete</button>
                </div>
                
                {post !== null && (
                    <>
                        <div id='post-table'>
                            <p id='post-title'>{post.title}</p>
                            <p>{post.user.nick}</p>
                            <div id='post-dataAndViewCount'>
                                <p>{post.createdDate}</p>
                                <p>view {post.viewCount}</p>
                            </div>
                            <p id='post-content' className='textContent'>{post.content}</p>
                        </div>
                    </>
                )}

                <span className='separator'></span>
                
                <div id='read-comment'>
                    {comments.map((comment) => {
                        const isCurrentUserComment = comment.user.id.toString() === String(userId);;
                        const isReplyingToComment = replyingStates[comment.id] || false;
                        const isUpdatingComment = updatingStates[comment.id] || false;

                        const paddingLeft = comment.parent ? 0 : 20;

                        return (
                            <div key={comment.id} id={`read-comment-${comment.id}`} className='read-comment-container' style={{ paddingLeft: `${paddingLeft}px` }}>
                                <div className='read-comment-header'>
                                    <div className='read-comment-userContainer'>
                                        <p className='read-comment-user'>{comment.user?.nick}</p>
                                        <p className='read-comment-date'>{comment.createdDate}</p>
                                    </div>
                                    <div className='read-comment-btns'>
                                        {comment.parent && (
                                            <p onClick={() => showReplyCommentFrame( comment.id.toString() )}>reply</p>
                                        )}
                                        {isCurrentUserComment && (
                                            <>
                                                <p onClick={() => showUpdateCommentFrame( comment.id.toString() )}>update</p>
                                                <p onClick={() => deleteComment( comment )}>delete</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {!isUpdatingComment && (
                                    <p className='read-comment-content textContent'>{comment.content}</p>
                                )}
                                {isUpdatingComment && (
                                    <>
                                        <textarea className='read-comment-update'>{comment.content}</textarea>
                                        <button onClick={ () => updateComment( comment.id.toString() ) } className={Button.primary}>submit</button>
                                    </>
                                )}
                                {isReplyingToComment && (
                                    <div className='read-comment-reply'>
                                        <textarea></textarea>
                                        <button onClick = { () => replyComment(comment.id.toString()) } className={Button.primary}>submit</button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    <div id='read-comment-footer'>
                        <div id='read-comment-write'>
                            <textarea></textarea>
                            <button onClick = { () => writeComment() } className={Button.primary}>submit</button>
                        </div>
                        {totalPageCount > 0 && (
                            <ReactPaginate
                                pageRangeDisplayed={Page.perBlockSize}
                                marginPagesDisplayed={1}
                                pageCount={totalPageCount}
                                onPageChange={({ selected }) => setCurPage(selected)}
                                containerClassName={'pagination'}
                                activeClassName={'pageActive'}
                                previousLabel="<"
                                nextLabel=">"
                            />
                        )}
                    </div>
                </div>
                <div id='read-footer'>
                    <button id='list' onClick={list} className={Button.primary}>list</button>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default FreeBoardPostDetailRead;
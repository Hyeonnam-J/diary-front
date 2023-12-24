import React, { ReactNode, useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import DefaultLayout from "../../layouts/DefaultLayout";
import { SERVER_IP, Page } from "../../../Config";
import '../../../stylesheets/pages/freeBoard/freeBoardPostRead.css';
import Layout from "../../../stylesheets/modules/layout.module.css";
import Button from "../../../stylesheets/modules/button.module.css";
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { FreeBoardPostDetail, FreeBoardComment } from "../../../type/FreeBoard"
import { user } from "../../../auth/auth";

const FreeBoardPostDetailRead = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const postId = location?.state?.postId;
    const [post, setPost] = useState<FreeBoardPostDetail | null>(null);
    const [comments, setComments] = useState<FreeBoardComment[]>([]);

    const [totalCommentsCount, setTotalCommentsCount] = useState(0);
    const [totalPageCount, setTotalPageCount] = useState(0);
    const [totalBlockCount, setTotalBlockCount] = useState(0);

    const [curPage, setCurPage] = useState(0);

    const [replyingStates, setReplyingStates] = useState<Record<string, boolean>>({});
    const [updatingStates, setUpdatingStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const isStay = localStorage.getItem('isStay');
        if(isStay === "true"){
            setUserId(localStorage.getItem('userId'));
            setAccessToken(localStorage.getItem('accessToken'));
        }else{
            setUserId(sessionStorage.getItem('userId'));
            setAccessToken(sessionStorage.getItem('accessToken'));
        }

        getTotalCommentsCount();
    }, []);

    useEffect(() => {
        setTotalPageCount(Math.ceil(totalCommentsCount / Page.perPageSize));
    }, [totalCommentsCount]);

    useEffect(() => {
        setTotalBlockCount(Math.ceil(totalPageCount / Page.perBlockSize));
    }, [totalPageCount]);

    useEffect(() => {
        getComments(`/freeBoard/comments/${postId}?page=${curPage}`);
    }, [curPage]);

    useEffect(() => {
        getPost(postId);
    }, []);

    const getTotalCommentsCount = () => {
        const response = fetch(SERVER_IP + `/freeBoard/comments/totalCount/${postId}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(body => {
            setTotalCommentsCount(body.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const getComments = (uri: string) => {
        const response = fetch(SERVER_IP + uri, {
            method: 'GET',
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
            headers: {
            },
            method: 'GET',
        })
        .then(response => response.json())
        .then(body => {
            setPost(body.data);
        })
    }

    const replyPost = async (post: FreeBoardPostDetail | null) => {
        if(!userId) {
            alert('Please sign in');
            return;
        }

        const isAuth = await user(userId || '', accessToken || '');
        if (isAuth) {
            if (post) navigate('/freeBoard/post/reply', { state: { postId: post.id } });
        } else navigate('/signIn');
    }

    const updatePost = async (post: FreeBoardPostDetail | null) => {
        if ((userId || -1) == post?.user.id) {
            navigate('/freeBoard/post/update', { state: { post: post } });
        } else alert('You are not writer');
    }

    const deletePost = async (post: FreeBoardPostDetail | null) => {
        if ((userId || -1) == post?.user.id) {
            fetch(`${SERVER_IP}/freeBoard/post/delete/${postId}`, {
                headers: {
                    "Authorization": accessToken || '',
                },
                method: 'DELETE',
            })
            .then(response => {
                if(response.status == 403){
                    alert('Replies exist');
                    return;
                }

                navigate('/freeBoard');
            });
        } else alert('You are not writer');
    }

    const writeComment = () => {
        if(!userId){
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
                "userId": userId || '',
                "Authorization": accessToken || '',
            },
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
        if(!userId){
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
                "userId": userId || '',
                "Authorization": accessToken || '',
            },
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
        if(!userId){
            alert('please sign in');
            return;
        }

        setUpdatingStates((prevStates) => ({
            [commentId]: !prevStates[commentId] || false,
        }));
    }

    const updateComment = (commentId: string) => {
        const updateTextarea = document.querySelector(`#read-comment-${commentId} .read-comment-update`) as HTMLTextAreaElement;

        let updatedContent = '';
        if(updateTextarea){
            updatedContent = updateTextarea.value;
        }
        
        const data = {
            commentId: commentId,
            content: updatedContent,
        }

        fetch(SERVER_IP+"/freeBoard/comment/update", {
            headers: {
                "Content-Type": 'application/json',
                "Authorization": accessToken || '',
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
        .then(body => {
            getComments(`/freeBoard/comments/${postId}?page=${curPage}`);
            updateTextarea.value = '';
            showUpdateCommentFrame(commentId);
        })
    }

    const deleteComment = (comment: FreeBoardComment) => {
        if(userId !== comment.user.id.toString()) {
            alert('Unauthorization');
            return;
        }

        fetch(`${SERVER_IP}/freeBoard/comment/delete/${comment.id}`, {
            headers: {
                "Authorization": accessToken || '',
            },
            method: 'DELETE',
        })
        .then(response => {
            if(response.status == 403){
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
                        const isCurrentUserComment = comment.user.id.toString() === userId;
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
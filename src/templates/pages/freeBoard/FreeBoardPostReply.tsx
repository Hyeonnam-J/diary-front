import React, { ReactNode, useState, useEffect } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout";
import { SERVER_IP } from "../../../Config";
import '../../../stylesheets/pages/freeBoard/freeBoardPostReply.css';
import Layout from "../../../stylesheets/modules/layout.module.css";
import Button from "../../../stylesheets/modules/button.module.css";
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

const FreeBoardPostReply = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const postId = location?.state?.postId;

    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
        setAccessToken(localStorage.getItem('accessToken'));
    }, []);

    const reply = () => {
        const title = document.querySelector('input[name="reply-title"]') as HTMLInputElement;
        const content = document.querySelector('textarea[name="reply-content"]') as HTMLInputElement;

        const data = {
            postId: postId,
            title: title.value,
            content: content.value
        }

        fetch(SERVER_IP+"/freeBoard/post/reply", {
            headers: {
                "Content-Type": 'application/json',
                "userId": userId || '',
                "Authorization": accessToken || '',
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
        .then(response => {
            navigate('/freeBoard');
        });
    }
    return (
        <DefaultLayout>
            <div id='reply-frame'>
                {/* <div id='reply-space'></div> */}
                <div id='reply-header'>
                    <button onClick={ reply } className={ Button.primary }>submit</button>
                </div>
                <input type="text" id='reply-title' name="reply-title"/>
                {/* <div id='reply-custom'></div> */}
                <textarea id='reply-content' name="reply-content"></textarea>
            </div>
        </DefaultLayout>
    )
}
    
export default FreeBoardPostReply;
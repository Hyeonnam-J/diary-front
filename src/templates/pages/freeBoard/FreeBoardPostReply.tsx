import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_IP } from "../../../Config";
import Button from "../../../stylesheets/modules/button.module.css";
import '../../../stylesheets/pages/freeBoard/freeBoardPostReply.css';
import DefaultLayout from "../../layouts/DefaultLayout";
import { getAccessToken, getCookie, parseAccessToken } from '../../../auth/cookie';

const FreeBoardPostReply = () => {
    const once = true;

    const navigate = useNavigate();
    const location = useLocation();

    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const postId = location?.state?.postId;

    useEffect(() => {
        const fetchData = async () => {
            const cookie = getCookie();
            if(cookie){
                const accessToken = getAccessToken(cookie);
                const { userId } = parseAccessToken(accessToken);

                setAccessToken(accessToken);
                setUserId(userId);
            }
        }

        fetchData();
    }, [once]);

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
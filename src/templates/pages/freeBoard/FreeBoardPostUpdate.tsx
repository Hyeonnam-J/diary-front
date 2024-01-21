import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_IP } from "../../../Config";
import Button from "../../../stylesheets/modules/button.module.css";
import '../../../stylesheets/pages/freeBoard/freeBoardPostUpdate.css';
import { FreeBoardPostDetail } from "../../../type/FreeBoard";
import DefaultLayout from "../../layouts/DefaultLayout";

const FreeBoardPostUpdate = () => {
    const once = true;

    const navigate = useNavigate();
    const location = useLocation();

    const post: FreeBoardPostDetail = location?.state?.post;
    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const isStay = localStorage.getItem('isStay');
        if(isStay === "true"){
            setUserId(localStorage.getItem('userId'));
            setAccessToken(localStorage.getItem('accessToken'));
        }else{
            setUserId(sessionStorage.getItem('userId'));
            setAccessToken(sessionStorage.getItem('accessToken'));
        }
    }, [once]);

    const update = () => {
        const title = document.querySelector('input[name="update-title"]') as HTMLInputElement;
        const content = document.querySelector('textarea[name="update-content"]') as HTMLInputElement;

        const data = {
            postId: post.id,
            title: title.value,
            content: content.value
        }

        fetch(SERVER_IP+"/freeBoard/post/update", {
            headers: {
                "Content-Type": 'application/json',
                "Authorization": accessToken || '',
            },
            method: 'PUT',
            body: JSON.stringify(data),
        })
        .then(response => {
            navigate('/freeBoard');
        });
    }
    return (
        <DefaultLayout>
            <div id='update-frame'>
                <div id='update-space'></div>
                <div id='update-header'>
                    <button onClick={ update } className={ Button.primary }>submit</button>
                </div>
                <input type="text" id='update-title' name="update-title" defaultValue={post?.title || ''} />
                <div id='update-custom'></div>
                <textarea id='update-content' name="update-content" defaultValue={post?.content || ''} />
            </div>
        </DefaultLayout>
    )
}
    
export default FreeBoardPostUpdate;
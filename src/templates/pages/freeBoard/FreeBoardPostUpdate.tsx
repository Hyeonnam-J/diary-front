import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_IP } from "../../../Config";
import { responseHandler } from '../../../handler/responseHandler';
import Button from "../../../stylesheets/modules/button.module.css";
import '../../../stylesheets/pages/freeBoard/freeBoardPostUpdate.css';
import { Auth } from '../../../type/Auth';
import { FreeBoardPostRead } from "../../../type/FreeBoard";
import DefaultLayout from "../../layouts/DefaultLayout";

const FreeBoardPostUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const post: FreeBoardPostRead = location?.state?.post;

    const back = () => {
        navigate('/freeBoard/post/read', { state: { postId: post.id } });
    }

    const update = async () => {
        const title = document.querySelector('input[name="update-title"]') as HTMLInputElement;
        const content = document.querySelector('textarea[name="update-content"]') as HTMLInputElement;

        const data = {
            postId: post.id,
            title: title.value,
            content: content.value
        }

        const response = await fetch(SERVER_IP + "/freeBoard/post/update", {
            headers: {
                "Content-Type": 'application/json',
            },
            credentials: "include",
            method: 'PUT',
            body: JSON.stringify(data),
        })

        const auth: Auth = await responseHandler(response);
        if(auth.result){
            navigate('/freeBoard');
        }
    }
    
    return (
        <DefaultLayout>
            <div id='update-frame'>
                {/* <div id='update-space'></div> */}
                <div id='update-header'>
                    <button onClick={ back } className={ Button.primaryOutline }>Back</button>
                    <button onClick={update} className={Button.primary}>Submit</button>
                </div>
                <input type="text" id='update-title' name="update-title" defaultValue={post?.title || ''} />
                {/* <div id='update-custom'></div> */}
                <textarea id='update-content' name="update-content" defaultValue={post?.content || ''} />
            </div>
        </DefaultLayout>
    )
}

export default FreeBoardPostUpdate;
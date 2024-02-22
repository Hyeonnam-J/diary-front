import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_IP } from "../../../Config";
import { responseHandler } from '../../../handler/responseHandler';
import Button from "../../../stylesheets/modules/button.module.css";
import '../../../stylesheets/pages/freeBoard/freeBoardPostReply.css';
import { Auth } from '../../../type/Auth';
import DefaultLayout from "../../layouts/DefaultLayout";

const FreeBoardPostReply = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const postId = location?.state?.postId;

    const back = () => {
        navigate('/freeBoard');
    }

    const reply = async () => {
        const title = document.querySelector('input[name="reply-title"]') as HTMLInputElement;
        const content = document.querySelector('textarea[name="reply-content"]') as HTMLInputElement;

        const data = {
            postId: postId,
            title: title.value,
            content: content.value
        }

        const response = await fetch(SERVER_IP+"/freeBoard/post/reply", {
            headers: {
                "Content-Type": 'application/json',
            },
            credentials: "include",
            method: 'POST',
            body: JSON.stringify(data),
        })

        const auth: Auth = await responseHandler(response);
        if(auth.result){
            navigate('/freeBoard');
        }
    }
    
    return (
        <DefaultLayout>
            <div id='reply-frame'>
                {/* <div id='reply-space'></div> */}
                <div id='reply-header'>
                    <button onClick={ back } className={ Button.primaryOutline }>back</button>
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
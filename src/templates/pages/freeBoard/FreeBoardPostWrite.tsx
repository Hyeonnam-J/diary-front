import { useNavigate } from 'react-router-dom';
import { SERVER_IP } from "../../../Config";
import Button from "../../../stylesheets/modules/button.module.css";
import '../../../stylesheets/pages/freeBoard/freeBoardPostWrite.css';
import DefaultLayout from "../../layouts/DefaultLayout";
import { ErrorResponse } from '../../../type/Response';

const FreeBoardPostWrite = () => {
    const navigate = useNavigate();

    const write = async () => {
        const title = document.querySelector('input[name="write-title"]') as HTMLInputElement;
        const content = document.querySelector('textarea[name="write-content"]') as HTMLInputElement;

        const data = {
            title: title.value,
            content: content.value
        }

        const response = await fetch(SERVER_IP+"/freeBoard/post/write", {
            headers: {
                "Content-Type": 'application/json',
            },
            credentials: "include",
            method: 'POST',
            body: JSON.stringify(data),
        })

        if(response.ok) navigate('/freeBoard');
        else{
            const body: ErrorResponse = await response.json();
            alert(body.message);
        }
    }
    
    return (
        <DefaultLayout>
            <div id='write-frame'>
                {/* <div id='write-space'></div> */}
                <div id='write-header'>
                    <button onClick={ write } className={ Button.primary }>submit</button>
                </div>
                <input type="text" id='write-title' name="write-title"/>
                {/* <div id='write-custom'></div> */}
                <textarea id='write-content' name="write-content"></textarea>
            </div>
        </DefaultLayout>
    )
}
    
export default FreeBoardPostWrite;
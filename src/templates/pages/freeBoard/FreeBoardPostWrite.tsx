import React, { ReactNode, useState, useEffect } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout";
import { SERVER_IP } from "../../../Config";
import '../../../stylesheets/pages/freeBoard/freeBoardPostWrite.css';
import Layout from "../../../stylesheets/modules/layout.module.css";
import Button from "../../../stylesheets/modules/button.module.css";
import { Navigate, useNavigate } from 'react-router-dom';

const FreeBoardPostWrite = () => {
    const navigate = useNavigate();

    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
        setAccessToken(localStorage.getItem('accessToken'));
    }, []);

    const write = () => {
        const title = document.querySelector('input[name="write-title"]') as HTMLInputElement;
        const content = document.querySelector('textarea[name="write-content"]') as HTMLInputElement;

        const data = {
            title: title.value,
            content: content.value
        }

        fetch(SERVER_IP+"/freeBoard/post/write", {
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
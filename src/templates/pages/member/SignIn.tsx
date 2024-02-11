import { useNavigate } from 'react-router-dom';
import { SERVER_IP } from "../../../Config";
import Button from "../../../stylesheets/modules/button.module.css";
import Layout from "../../../stylesheets/modules/layout.module.css";
import '../../../stylesheets/pages/member/signIn.css';
import SignLayout from "../../layouts/SignLayout";
import { deleteCookie } from '../../../auth/cookie';

const SignIn = () => {
    const navigate = useNavigate();

    const requestSignIn = async () => {
        deleteCookie();
        localStorage.clear();
        sessionStorage.clear();
        
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement
        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement

        const data = {
            email: emailInput.value,
            password: passwordInput.value,
        }

        const response = await fetch(SERVER_IP+'/signIn', {
            headers: {
                "Content-Type": 'application/json',
            },
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if(response.ok){
            const isStayInput = document.querySelector('input[name="staySignedIn"]') as HTMLInputElement;
            const isStay = isStayInput.checked.toString();
            localStorage.setItem('isStay', isStay);

            // 새로고침을 대비해 로그인 후 세션 스토리지에도 쿠키 값 넣어둔다. 
            sessionStorage.setItem('documentDotCookie', document.cookie);

            navigate('/');
        }else if(response.status === 401){
            const responseToInput = document.querySelector('#responseToInput') as HTMLElement;
            if(responseToInput){
                responseToInput.innerHTML = 'Email or password is incorrect';
            }
        }
    }

    return (
        <SignLayout>
            <div id='signInFrame' className={Layout.centerFrame}>
                <div id='signInFrame-contents'>
                    <div id="signInFrame-inputs">
                        <p>Email</p>
                        <input type="text" name="email"></input>
                        <p>Password</p>
                        <input type="password" name="password"></input>
                    </div>

                    <div id='signInFrame-btns'>
                        <button className={ Button.primary } onClick={ requestSignIn }>Sign In</button>
                        <div id='signInFrame-sub'>
                            <label id='staySignIn-label'>
                                <input type="checkbox" name="staySignedIn" />
                                <p>Stay signed in</p>
                            </label>
                            <p id='findPassword'>Find password</p>
                        </div>
                    </div>
                </div>

                <p id='responseToInput' />
            </div>
        </SignLayout>
    )
}

export default SignIn;
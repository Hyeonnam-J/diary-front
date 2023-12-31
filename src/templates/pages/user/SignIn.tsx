import { useNavigate } from 'react-router-dom';
import SignLayout from "../../layouts/SignLayout";
import { SERVER_IP } from "../../../Config";
import '../../../stylesheets/pages/user/signIn.css';
import Layout from "../../../stylesheets/modules/layout.module.css";
import Button from "../../../stylesheets/modules/button.module.css";

function parseJwt (token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const SignIn = () => {
    const navigate = useNavigate();

    const requestSignIn = async () => {
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement
        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement

        const data = {
            email: emailInput.value,
            password: passwordInput.value,
        }

        const response = fetch(SERVER_IP+'/signIn', {
            headers: {
                "Content-Type": 'application/json',
//                 "credentials": 'include',
            },
            method: 'POST',
//             credentials: 'include',
            body: JSON.stringify(data),
        })
        .then(response => {
            if(response.ok){
                let accessToken = response.headers.get('Authorization');
                accessToken = accessToken || '';
                const decodedAccessToken = parseJwt(accessToken);

                const isStayInput = document.querySelector('input[name="staySignedIn"]') as HTMLInputElement;
                const isStay = isStayInput.checked.toString();
                localStorage.setItem('isStay', isStay);
                
                if(isStay === "true"){
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('userId', decodedAccessToken.userId);
                    localStorage.setItem('email', decodedAccessToken.email);
                    localStorage.setItem('nick', decodedAccessToken.nick);
                }else{
                    sessionStorage.setItem('accessToken', accessToken);
                    sessionStorage.setItem('userId', decodedAccessToken.userId);
                    sessionStorage.setItem('email', decodedAccessToken.email);
                    sessionStorage.setItem('nick', decodedAccessToken.nick);
                }
                
                navigate('/');
            }
        })
        .catch(e => {
            console.log(e);
        })
    }
    return (
        <SignLayout>
            <div id='signInFrame' className={Layout.centerFrame}>

                <div id="signInFrame-inputs">
                    <p>Email</p>
                    <input type="text" name="email"></input>
                    <p>Password</p>
                    <input type="text" name="password"></input>
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
        </SignLayout>
    )
}

export default SignIn;
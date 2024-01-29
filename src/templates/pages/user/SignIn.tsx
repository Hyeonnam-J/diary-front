import { useNavigate } from 'react-router-dom';
import { SERVER_IP } from "../../../Config";
import Button from "../../../stylesheets/modules/button.module.css";
import Layout from "../../../stylesheets/modules/layout.module.css";
import '../../../stylesheets/pages/user/signIn.css';
import SignLayout from "../../layouts/SignLayout";

const SignIn = () => {
    const navigate = useNavigate();

    const requestSignIn = async () => {
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement
        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement

        const data = {
            email: emailInput.value,
            password: passwordInput.value,
        }

        fetch(SERVER_IP+'/signIn', {
            headers: {
                "Content-Type": 'application/json',
            },
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
        })
        .then(response => {
            if(response.ok){
                const isStayInput = document.querySelector('input[name="staySignedIn"]') as HTMLInputElement;
                const isStay = isStayInput.checked.toString();
                localStorage.setItem('isStay', isStay);
    
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
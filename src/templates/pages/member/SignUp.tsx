import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_IP } from "../../../Config";
import Button from "../../../stylesheets/modules/button.module.css";
import Layout from "../../../stylesheets/modules/layout.module.css";
import '../../../stylesheets/pages/member/signUp.css';
import DefaultLayout from "../../layouts/DefaultLayout";

const SignUp = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [nick, setNick] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [inputValidations, setInputValidations] = useState({
        email: false,
        password: false,
        userName: false,
        nick: false,
        phoneNumber: true,
    });
    const [duplicateValidations, setDuplicateValidations] = useState({
        email: false,
        nick: false,
    })

    const getInputValidationMessage = (name: string) => {
        switch (name) {
            case "email":
                if(!emailRegex.test(email)) return "Invalid email format";
                else return "Valid email";
            case "password":
                if (!/^\S+$/.test(password)) {
                    return "Password cannot contain spaces";
                } else if (/[^ -~]/.test(password)) {
                    return "Password can contain only ASCII characters";
                } else if (!/[A-Z]/.test(password)) {
                    return "Password must contain at least one uppercase letter";
                } else if (!/[a-z]/.test(password)) {
                    return "Password must contain at least one lowercase letter";
                } else if (!/\d/.test(password)) {
                    return "Password must contain at least one digit";
                } else if (!/[@$!%*#?&]/.test(password)) {
                    return "Password must contain at least one special character";
                } else if (password.length < 8) {
                    return "Password must be at least 8 characters long";
                } else {
                    return "Valid password";
                }
            case "userName":
                if (/\p{P}/u.test(userName)) return "Name cannot contain special characters";
                else if (/\d/.test(userName)) return "Name cannot contain numbers";
                else if (/^\s|\s$/.test(userName)) return "Name cannot start or end with spaces";
                else if (!userName.trim()) return "Name is required";
                else return "Valid name";
            case "nick":
                if(!nickRegex.test(nick)) return "Nick cannot contain space";
                else return "Valid Nick";
            case "phoneNumber":
                if(phoneNumberRegex.test(phoneNumber)) return "";
                return "";
            default:
                return "";
        }
    };
    
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const userNameRegex = /^(?!\d)(?!\s)[\p{L}\d\s]*[\p{L}\d]$/u;
    const nickRegex = /^[^\s]+[^\s]*$/;
    const phoneNumberRegex = /.*/;

    let isValid = false;
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        switch (name) {
            case "email":
                setDuplicateValidations({
                    ...duplicateValidations,
                    [name]: false,
                });

                isValid = emailRegex.test(value);
                break;
            case "password":
                isValid = passwordRegex.test(value);
                break;
            case "userName":
                isValid = userNameRegex.test(value);
                break;
            case "nick":
                setDuplicateValidations({
                    ...duplicateValidations,
                    [name]: false,
                });

                isValid = nickRegex.test(value);
                break;
            case "phoneNumber":
                isValid = phoneNumberRegex.test(value);
                break;
            default:
                break;
        }

        setInputValidations({
            ...inputValidations,
            [name]: isValid,
        });

        switch (name) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "userName":
                setUserName(value);
                break;
            case "nick":
                setNick(value)
                break;
            case "phoneNumber":
                setPhoneNumber(value);
                break;
            default:
                break;
        }
    };

    const requestSignUp = async () => {
        for (const key in inputValidations) {
            if (!inputValidations[key as keyof typeof inputValidations]) {
                
                if(key === 'userName') {
                    alert("Check your name value");
                    return;
                }

                alert("Check your "+key+" value");
                return;
            }
        }

        for (const key in duplicateValidations) {
            if(!duplicateValidations[key as keyof typeof duplicateValidations]){
                alert("Check "+key+" duplicate");
                return;
            }
        }

        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
        const passwordConfirmInput = document.querySelector('input[name="passwordConfirm"]') as HTMLInputElement;
        const userNamedInput = document.querySelector('input[name="userName"]') as HTMLInputElement;
        const nickInput = document.querySelector('input[name="nick"]') as HTMLInputElement;
        const phoneNumberInput = document.querySelector('input[name="phoneNumber"]') as HTMLInputElement;

        if(passwordInput.value !== passwordConfirmInput.value){
            alert('Check your password confirm');
            return;
        }

        const data = {
            email: emailInput.value,
            password: passwordInput.value,
            userName: userNamedInput.value,
            nick: nickInput.value,
            phoneNumber: phoneNumberInput.value,
        };

        const response = await fetch(SERVER_IP+'/signUp', {
            headers: {
                "Content-Type": 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        });

        if(response.ok){
            if(response.status === 208) {
                alert('Duplicated email or nick. Please check your email and nick');
                return;
            }
            navigate('/');
            alert("Registration is complete")
        }
    } // requestSignUp

    const checkDuplication = async (checkItem: string) => {
        // 체크 전에 input에 입력된 값의 유효성을 먼저 확인.
        let inputValid: boolean = false;
        switch(checkItem){
            case "email":
                inputValid = inputValidations.email;
                break;
            case "nick":
                inputValid = inputValidations.nick;
                break;
        }
        if(! inputValid){
            alert('Invalid value');
            return;
        }

        // input의 값은 유효한 값. 이제 중복 검사 시작.
        let input= document.querySelector(`input[name="${checkItem}"]`) as HTMLInputElement;
        const data = {
            item: checkItem,
            value: input.value,
        }

        const response = await fetch(SERVER_IP+'/signUp/checkDuplication', {
            headers: {
                "Content-Type": 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        });

        if(response.ok){
            if(response.status === 208){
                alert('Existing value');

                setDuplicateValidations({
                    ...duplicateValidations,
                    [checkItem]: false,
                })

                return;
            }else if(response.status === 200){
                alert('Valid value');

                setDuplicateValidations({
                    ...duplicateValidations,
                    [checkItem]: true,
                })

                return;
            }
        }
    }

    return (
        <DefaultLayout>
            <div id='signUpFrame' className={Layout.centerFrame_width}>
                <div id='submitList'>
                    <label className={inputValidations.email ? 'valid' : 'invalid'}>
                        <div>
                            <p>* Email</p>
                            <p onClick={() => checkDuplication('email')} className='duplicateButton'>Duplicate check</p>
                        </div>
                        <input name='email' value={email} onChange={handleInputChange}></input>
                        <span>{getInputValidationMessage('email')}</span>
                    </label>

                    <label className={inputValidations.password ? 'valid' : 'invalid'}>
                        <p>* Password</p>
                        <input type='password' name='password' value={password} onChange={handleInputChange}></input>
                        <span>{getInputValidationMessage('password')}</span>
                    </label>

                    <label>
                        <p>* Password confirm</p>
                        <input type='password' name='passwordConfirm'></input>
                        <span />
                    </label>

                    <label className={inputValidations.userName ? 'valid' : 'invalid'}>
                        <p>* Name</p>
                        <input name='userName' value={userName} onChange={handleInputChange}></input>
                        <span>{getInputValidationMessage('userName')}</span>
                    </label>

                    <label className={inputValidations.nick ? 'valid' : 'invalid'}>
                        <div>
                            <p>* Nick</p>
                            <p onClick={() => checkDuplication('nick')} className='duplicateButton'>Duplicate check</p>
                        </div>
                        <input name='nick' value={nick} onChange={handleInputChange}></input>
                        <span>{getInputValidationMessage('nick')}</span>
                    </label>

                    <label className={inputValidations.phoneNumber ? 'valid' : 'invalid'}>
                        <p>Phone number</p>
                        <input name='phoneNumber' value={phoneNumber} onChange={handleInputChange}></input>
                        <span>{getInputValidationMessage('phoneNumber')}</span>
                    </label>
                </div>
                <button id='terms' className={ Button.primaryOutline }>Terms of Service</button>
                <button id='submit-btn' className={ Button.primary } onClick={ requestSignUp }>Sign up</button>
            </div>
        </DefaultLayout>
    )
}

export default SignUp;
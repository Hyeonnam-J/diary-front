import { Auth } from "../type/Auth";
import { ErrorResponse } from "../type/Response";

export const responseHandler = async (response: Response): Promise<Auth> => {
    let auth: Auth = {
        result: true,
        status: 200,
        message: 'success'
    }

    if(! response.ok){
        auth.result = false;

        if(response.status === 400){
            // signatureException
            auth.message = 'Please sign in again';
            // todo: navi -> /signIn

            
        }else if(response.status === 401){
            // 권한 없음
            const data: ErrorResponse = await response.json();
            auth.message = data.message;
        }else if(response.status === 403){
            auth.message = 'Replies exist';
        }else if(response.status === 404){
            auth.message = 'Invalid request';
        }

        alert(auth.message);
    }

    auth.status = response.status;
    return auth;
}
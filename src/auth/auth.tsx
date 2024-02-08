import { SERVER_IP } from "../Config";
import { ErrorResponse } from "../type/Response";

export const user = async () => {
    let result = {
        auth: false,
        message: 'success'
    }

    const response = await fetch(SERVER_IP+"/user", {
        method: 'GET',
        credentials: "include",
    })

    if(response.ok){
        result.auth = true;
    }else{
        const data: ErrorResponse = await response.json();
        result.message = data.message;
    }
    
    return result;
}
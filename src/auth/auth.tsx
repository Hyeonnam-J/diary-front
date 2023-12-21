import { SERVER_IP } from "../Config"

export const user = async (userId : string, accessToken : string) => {
    let auth = false;

    const response = await fetch(SERVER_IP+"/user", {
        headers: {
            "userId": `${userId}`,
            'Authorization': `${accessToken}`,
        },
        method: 'GET',
    })
    .then(response => {
        auth = response.status == 200 ? true : false;
    });
    
    return auth;
}
import { SERVER_IP } from "../Config";

export const user = async () => {
    let auth = false;

    await fetch(SERVER_IP+"/user", {
        method: 'GET',
        credentials: "include",
    })
    .then(response => {
        auth = response.status === 200 ? true : false;
    });
    
    return auth;
}
import { SERVER_IP } from "../Config";
import { responseHandler } from "../handler/responseHandler";

export const user = async () => {
    const response = await fetch(SERVER_IP+"/user", {
        method: 'GET',
        credentials: "include",
    });

    return await responseHandler(response);
}
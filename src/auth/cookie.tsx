export function getCookie() {
    return document.cookie.split('; ')
        .find(cookie => cookie.startsWith('jws='));
}

export const getAccessToken = (cookie: string) => {
    const startIndex = cookie.indexOf('jws=') + "jws=".length;
    return cookie.substring(startIndex);
}

export const parseAccessToken = (accessToken: string) => {
    const decodedAccessToken = parseJwt(accessToken);
    const email = decodedAccessToken.email;
    const nick = decodedAccessToken.nick;

    return { email, nick };
}

export const deleteCookie = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 7);
    document.cookie = `jws=deleted; expires=` + expirationDate.toUTCString() + '; path=/';
}

function parseJwt (token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
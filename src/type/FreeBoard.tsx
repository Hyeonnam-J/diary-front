export type FreeBoardPosts = {
    id: number,
    title: string,
    user: {
        email: string,
        nick: string,
    },
    createdDate: string,
    viewCount: number,
    depth: number,
};

export type FreeBoardPostRead = {
    id: number,
    title: string,
    content: string,
    user: {
        id: number,
        email: string,
        nick: string,
    };
    createdDate: string,
    viewCount: number,
    depth: number,
};

export type FreeBoardComment = {
    id: number,
    user: {
        id: number,
        email: string,
        nick: string,
    };
    content: string,
    createdDate: string,
    parent: boolean,
};

export const FreeBoardSort = {
    BASIC: "basic"
};

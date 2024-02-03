export type ErrorResponse = {
    status: number,
    message: string,
}

export type PlainDataResponse<T> = {
    status: number,
    data: T,
}

export type ListDataResponse<T> = {
    status: number;
    data: T[];
};
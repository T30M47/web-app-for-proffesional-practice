import message from "antd/lib/message"
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { isExpired } from "react-jwt"
import { router } from "../components/main/Routes"
import { handleDates } from "../lib/handleDates"
//import { sleep } from "../lib/helpers"
import { store } from "../store"
import { ErrorResponse } from "../types/responses/errors/ErrorResponse"


const client = axios.create({ baseURL: "https://localhost:7078", withCredentials: true });

//request
export const FetchNewToken = async (): Promise<string | null> => {
    const token = await store.currentUserStore.getNewAccesToken();
    return token;
}

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = store.currentUserStore.accessToken;
    if (token && config.headers != null) {
        if (isExpired(token) && !store.currentUserStore.isFetchingToken) {
            await FetchNewToken();
        }
        config.headers.authorization = `Bearer ${store.currentUserStore.accessToken}`
    }
    return config;
});

//response
client.interceptors.response.use(async (response: any) => {
    try {
        //await sleep(1000);
        handleDates(response.data); // pretvaramo sve dates u js date objecte
        return response;
    } catch (e) {
        return Promise.reject(e);
    }
}, async (error: AxiosError) => {
    //await sleep(1000);
    if (error.response == null) {
        message.error({ content: "Server je trenutno nedostupan", duration: 4 });
        throw error;
    }
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            const serverError400 = (data as ErrorResponse);
            message.error({ content: serverError400.errorMessage, duration: 4 });
            break;
        case 401:
            // unauthorized
            if (store.currentUserStore.refreshToken && !store.currentUserStore.triedRefreshingToken) {
                await FetchNewToken();
                return client(config);
            }
            throw error;
        case 403:
            // forbidden
            router.navigate("/unauthorized");
            break;
        case 404:
            // not found
            message.error({ content: (data as ErrorResponse).errorMessage, duration: 4 });
            break;
        case 500:
            const serverError500 = (data as ErrorResponse);
            message.error({ content: serverError500.errorMessage, duration: 4 });
            break;
        default:
            // sve ostale greske
            throw error;
    }
})


const responsebody = <T>(response: AxiosResponse<T>) => response.data

const agent = {
    get: <T>(url: string) => client.get<T>(url).then(responsebody),
    post: <T>(url: string, data: any) => client.post<T>(url, data, { headers: { 'Content-Type': 'application/json; charset=utf-8' } }).then(responsebody),
    put: <T>(url: string, data: any) => client.put<T>(url, data, { headers: { 'Content-Type': 'application/json; charset=utf-8' } }),
    delete: <T>(url: string, data?: any) => client.delete<T>(url, { headers: { 'Content-Type': 'application/json; charset=utf-8' }, data }).then(responsebody),
}

export default agent

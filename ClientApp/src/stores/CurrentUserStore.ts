import axios, { AxiosError } from "axios";
import { makeAutoObservable, reaction } from "mobx";
import api from "../api/api";
import { router } from "../components/main/Routes";
import { JWTParse } from "../lib/jwt";
import { store } from "../store";
import { CurrentUser } from "../types/CurrentUser";
import { Rola } from "../types/enums/Rola";

export default class CurrentUserStore {
    refreshToken: string | null = window.localStorage.getItem("refreshToken");
    accessToken: string | null = window.localStorage.getItem("accessToken");
    isFetchingToken: boolean = false;
    triedRefreshingToken: boolean = false;
    rememberMe: boolean = this.isLoggedIn;

    isLoggingIn: boolean = false;

    korisnik: CurrentUser | null = null;

    constructor() {
        this.setKorisnik(JWTParse(this.accessToken));
        makeAutoObservable(this);


        reaction(() =>
            this.accessToken,
            (accessToken: string | null) => accessToken != null && this.rememberMe ?
                window.localStorage.setItem("accessToken", accessToken) : window.localStorage.removeItem("accessToken")
        );

        reaction(() =>
            this.refreshToken,
            (refreshToken: string | null) => refreshToken != null && this.rememberMe ?
                window.localStorage.setItem("refreshToken", refreshToken) : window.localStorage.removeItem("refreshToken")
        );
    }

    get isLoggedIn() {
        return this.refreshToken != null
    }


    korisnikImaRolu(role: Rola[]) {
        return role.some((rola) => this.korisnik?.role?.includes(rola));
    }

    setTriedRefreshingToken(state: boolean) {
        this.triedRefreshingToken = state;
    }

    setIsFetchingToken(state: boolean) {
        this.isFetchingToken = state;
    }

    private setRefreshToken(token: string | null) {
        this.refreshToken = token;
    }

    private setAccessToken(token: string | null) {
        this.accessToken = token;

    }

    private setRememberMe(state: boolean) {
        this.rememberMe = state;
    }

    private setIsLoggingIn(state: boolean) {
        this.isLoggingIn = state;
    }

    private setKorisnik(korisik: CurrentUser | null) {
        this.korisnik = korisik;
    }

    private clearAll() {
        this.setAccessToken(null);
        this.setRefreshToken(null);
        this.setKorisnik(null);
        this.setTriedRefreshingToken(false);
    }


    async login(user: { username: string; password: string, rememberMe: boolean }) {
        try {
            this.setIsLoggingIn(true);
            const res = await api.sessions.login({ username: user.username, password: user.password });
            this.setRememberMe(user.rememberMe);
            this.setRefreshToken(res.refreshToken);
            this.setAccessToken(res.accessToken);
            this.setKorisnik(JWTParse(this.accessToken));
        } catch (error) {
            console.log(error);
        } finally {
            this.setIsLoggingIn(false);
        }
    };

    async logout() {
        try {
            store.appStore.setIsLoading(true, "Odjava u tijeku...");
            await api.sessions.logout({ refreshToken: this.refreshToken as string });
            this.clearAll();
        } catch (error) {
            const e = error as Error | AxiosError;
            if (axios.isAxiosError(e)) {
                if ((e as AxiosError).response?.status === 404) {
                    //ako ga API nema ne vazi..
                    this.clearAll();
                }
            }
        } finally {
            store.appStore.setIsLoading(false);
        }
    };

    async getNewAccesToken(): Promise<string | null> {
        try {
            this.setIsFetchingToken(true);
            const res = await api.sessions.refreshToken({ refreshToken: this.refreshToken as string });
            this.setRefreshToken(res.refreshToken);
            this.setAccessToken(res.accessToken);
            this.setKorisnik(JWTParse(res.accessToken));
            return res.accessToken;
        } catch (error) {
            this.setTriedRefreshingToken(true);
            this.clearAll();
            router.navigate("/login");
            return null;
        } finally {
            this.setIsFetchingToken(false);
        }

    }
}

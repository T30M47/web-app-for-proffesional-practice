import { makeAutoObservable } from "mobx";

export default class AppStore {
    isSignalRConnected: boolean = false;
    isLoading: boolean = false;
    loadingText: string = "";
    isSideMenuCollapsed: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setIsSignalRConnected(state: boolean) {
        this.isSignalRConnected = state;
    }

    setIsLoading(state: boolean, text: string = "") {
        this.isLoading = state;
        this.loadingText = text;
    }

    toggleIsSideMenuCollapsed() {
        this.isSideMenuCollapsed = !this.isSideMenuCollapsed;
    }

    setIsSideMenuCollapsed(state: boolean) {
        this.isSideMenuCollapsed = state;
    }
}

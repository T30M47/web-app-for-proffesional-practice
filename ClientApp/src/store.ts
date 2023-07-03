import { createContext, useContext } from "react";
import { Store } from "./types/Store";
import { injectStores } from '@mobx-devtools/tools';
import KorisniciStore from "./stores/KorisniciStore";
import CurrentUserStore from "./stores/CurrentUserStore";
import AppStore from "./stores/AppStore";
import KompanijeStore from "./stores/KompanijeStore";
import PrakseStore from "./stores/PrakseStore";


// enkapsulacija objekata pod "store"
export const store: Store = {
    appStore: new AppStore(),
    korisniciStore: new KorisniciStore(),
    currentUserStore: new CurrentUserStore(),
    kompanijeStore: new KompanijeStore(),
    prakseStore: new PrakseStore()
    // tu dodajemo nove storove
}

injectStores(store);

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);

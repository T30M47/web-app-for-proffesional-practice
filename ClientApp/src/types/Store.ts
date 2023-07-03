import AppStore from "../stores/AppStore"
import CurrentUserStore from "../stores/CurrentUserStore"
import KompanijeStore from "../stores/KompanijeStore"
import KorisniciStore from "../stores/KorisniciStore"
import PrakseStore from "../stores/PrakseStore"

export type Store = {
    appStore: AppStore,
    korisniciStore: KorisniciStore,
    currentUserStore: CurrentUserStore
    kompanijeStore: KompanijeStore
    prakseStore: PrakseStore
}

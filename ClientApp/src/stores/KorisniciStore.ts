import { makeAutoObservable } from "mobx";
import api from "../api/api";
import { router } from "../components/main/Routes";
import { RequestUpdateUser } from "../types/users/requests/RequestUpdateUser";
import { RequestUser } from "../types/users/requests/RequestUser";
import { ResponseUser } from "../types/users/responses/ResponseUser";
import { v4 as uuid } from 'uuid';


export default class KorisniciStore {
    korisniciRegistry = new Map<string, ResponseUser>();
    fetchedKorisnici: boolean = false;
    selectedKorisnik: ResponseUser | undefined = undefined;
    isloading: boolean = false;
    isFetchingUser: boolean = false;


    constructor() {
        makeAutoObservable(this);
    }

    get korisnici() {
        return Array.from(this.korisniciRegistry.values());
    }

    setSelectedKorisnik(korisnik: ResponseUser | undefined) {
        this.selectedKorisnik = korisnik;
    }

    setFetchedKorisnici(state: boolean) {
        this.fetchedKorisnici = state;
    }

    noviKorisnik() {
        this.setSelectedKorisnik(undefined);
        router.navigate("/korisnici/novi");
    }

    private setirajKorisnike(korisnici: ResponseUser[]) {
        this.korisniciRegistry.clear();
        korisnici.forEach((korisnik) => {
            this.korisniciRegistry.set(korisnik.id_user, korisnik);
        });
    }

    private dodajKorisnika(korisnik: ResponseUser) {
        this.korisniciRegistry.set(korisnik.id_user, korisnik);
    }

    private updateKorisnika(korisnik: ResponseUser) {
        this.korisniciRegistry.set(korisnik.id_user, korisnik);
    }

    private deleteKorisnika(id_user: string) {
        this.korisniciRegistry.delete(id_user);
    }

    private setIsLoading(state: boolean) {
        this.isloading = state;
    }

    private setIsFetchingUser(state: boolean) {
        this.isFetchingUser = state;
    }

    getKorisnik(id_user: string): ResponseUser | undefined {
        return this.korisniciRegistry.get(id_user);
    }

    async GetAll() {
        try {
            this.setIsLoading(true);
            this.setirajKorisnike([]);
            const data = await api.users.GetAll();
            this.setirajKorisnike(data);
            this.setFetchedKorisnici(true);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsLoading(false);
        }
    };

    async SelectKorisnik(id_user: string) {
        try {
            let korisnik = this.korisnici.find((x) => x.id_user === id_user);
            if (!korisnik) {
                this.setIsFetchingUser(true);
                korisnik = await api.users.GetUser(id_user);
            }
            this.setSelectedKorisnik(korisnik);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsFetchingUser(false);
        }
    }

    async CreateOrUpdate(id_user: string | undefined, korisnik: RequestUpdateUser | RequestUser) : Promise<boolean> {
        if (id_user !== undefined) {
            let user = korisnik as RequestUpdateUser;
            user.id_user = id_user;
            return await this.UpdateKorisnika(id_user, user)
        } else {
            return await this.DodajKorisnika(korisnik as RequestUser);
        }
    }

    async DodajKorisnika(korisnik: RequestUser): Promise<boolean> {
        try {
            korisnik.id_user = uuid();
            this.setIsLoading(true);
            const noviKorisnik = await api.users.AddUser(korisnik);
            if (noviKorisnik) {
                this.dodajKorisnika(noviKorisnik);
                return true;
            }
            return false;
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    async UpdateKorisnika(id_user: string, korisnik: RequestUpdateUser): Promise<boolean>{
        try {
            this.setIsLoading(true);
            const res = await api.users.UpdateUser(id_user, korisnik);
            if (res) { 
                 this.updateKorisnika(res.data);
                 return true;
            }
            return false;
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    async DeleteKorisnika(id_user: string) {
        try {
            this.setIsLoading(true);
            await api.users.RemoveUser(id_user);
            this.deleteKorisnika(id_user);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsLoading(false);
        }
    };
}

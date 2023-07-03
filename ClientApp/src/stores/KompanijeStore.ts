import { makeAutoObservable } from "mobx";
import api from "../api/api";
import { router } from "../components/main/Routes";
import { Company } from "../types/companies/Company";
import { v4 as uuid } from 'uuid';

export default class KompanijeStore {
    kompanijeRegistry = new Map<string, Company>();
    fetchedKompanije: boolean = false;
    selectedKompanija: Company | undefined = undefined;
    isloading: boolean = false;
    isFetchingCompany: boolean = false;


    constructor() {
        makeAutoObservable(this);
    }

    get kompanije() {
        return Array.from(this.kompanijeRegistry.values());
    }

    setSelectedKompanija(kompanija: Company | undefined) {
        this.selectedKompanija = kompanija;
    }

    setFetchedKompanije(state: boolean) {
        this.fetchedKompanije = state;
    }

    novaKompanija() {
        this.setSelectedKompanija(undefined);
        router.navigate("/kompanije/nova");
    }

    private setirajKompanije(kompanije: Company[]) {
        this.kompanijeRegistry.clear();
        kompanije.forEach((kompanija) => {
            this.kompanijeRegistry.set(kompanija.id_company, kompanija);
        });
    }

    private dodajKompaniju(kompanija: Company) {
        this.kompanijeRegistry.set(kompanija.id_company, kompanija);
    }

    private updateKompaniju(kompanija: Company) {
        this.kompanijeRegistry.set(kompanija.id_company, kompanija);
    }

    private deleteKompaniju(id_company: string) {
        this.kompanijeRegistry.delete(id_company);
    }

    private setIsLoading(state: boolean) {
        this.isloading = state;
    }

    private setIsFetchingCompany(state: boolean) {
        this.isFetchingCompany = state;
    }

    async GetAll() {
        try {
            this.setIsLoading(true);
            this.setirajKompanije([]);
            const data = await api.companies.GetAll();
            this.setirajKompanije(data);
            this.setFetchedKompanije(true);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsLoading(false);
        }
    };

    async SelectKompaniju(id_company: string) {
        try {
            let kompanija = this.kompanije.find((x) => x.id_company === id_company);
            if (!kompanija) {
                this.setIsFetchingCompany(true);
                kompanija = await api.companies.GetCompany(id_company);
            }
            this.setSelectedKompanija(kompanija);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsFetchingCompany(false);
        }
    }

    async CreateOrUpdate(id_company: string | undefined, kompanija: Company) : Promise<boolean> {
        if (id_company !== undefined) {
            let company = kompanija as Company;
            kompanija.id_company = id_company;
            return await this.UpdateKompaniju(id_company, company)
        } else {
            return await this.DodajKompaniju(kompanija);
        }
    }

    async DodajKompaniju(kompanija: Company):Promise<boolean> {
        try {
            kompanija.id_company = uuid();
            this.setIsLoading(true);
            const novaKompanija = await api.companies.AddCompany(kompanija);
            if (novaKompanija) {
                this.dodajKompaniju(novaKompanija);
                return true;
            }
            return false;
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    async UpdateKompaniju(id_company: string, kompanija: Company):Promise<boolean> {
        try {
            this.setIsLoading(true);
            const res = await api.companies.UpdateCompany(id_company, kompanija);
            if (res) {
                this.updateKompaniju(res.data);
                return true;
            }
            return false;
        } catch (e) {
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    };

    async DeleteKompaniju(id_company: string) {
        try {
            this.setIsLoading(true);
            await api.companies.RemoveCompany(id_company);
            this.deleteKompaniju(id_company);
        } catch (e) {
            console.log(e);
        } finally {
            this.setIsLoading(false);
        }
    };
}
